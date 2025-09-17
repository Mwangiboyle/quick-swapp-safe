import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Camera, Loader2 } from "lucide-react";
import Navigation from "@/components/DashboardNavigation";
import { useCreateItem, useCategories } from '@/lib/hooks';
import { uploadItemImages } from '@/lib/storage';
import { validateItem } from '@/lib/validation';
import { useToast } from '@/components/ui/use-toast';
import type { CreateItemData } from '@/lib/types';

const Sell = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    location: '',
    category_id: ''
  });

  const createItemMutation = useCreateItem();
  const { data: categoriesData } = useCategories();
  
  const categories = categoriesData?.data || [];
  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      const totalImages = images.length + newFiles.length;
      
      if (totalImages > 5) {
        toast({
          title: "Too many images",
          description: "Maximum 5 images allowed",
          variant: "destructive"
        });
        return;
      }

      // Validate each file
      for (const file of newFiles) {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file",
            description: "Only image files are allowed",
            variant: "destructive"
          });
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Images must be less than 5MB",
            variant: "destructive"
          });
          return;
        }
      }

      setImages(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      newFiles.forEach(file => {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(prev => [...prev, previewUrl]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Clean up the removed URL
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Prepare data for validation
    const itemData: CreateItemData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      condition: formData.condition as CreateItemData['condition'],
      location: formData.location,
      category_id: formData.category_id || undefined,
    };

    // Validate form data
    const validation = validateItem(itemData);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors[0]?.message || "Please check your input",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images first if any
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const fileList = new DataTransfer();
        images.forEach(file => fileList.items.add(file));
        imageUrls = await uploadItemImages(fileList.files, 'temp-' + Date.now());
      }

      // Create item with image URLs
      const finalItemData = {
        ...itemData,
        images: imageUrls
      };

      await createItemMutation.mutateAsync(finalItemData);
      
      toast({
        title: "Success!",
        description: "Your item has been listed successfully.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create listing",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">List Your Item</h1>
            <p className="text-muted-foreground">Create a listing to sell to fellow students</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Photos ({images.length}/5)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Image Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        onDragEnter={() => setDragActive(true)}
                        onDragLeave={() => setDragActive(false)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragActive(false);
                          handleImageUpload(e.dataTransfer.files);
                        }}
                      >
                        <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">Upload Photos</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Drag & drop photos here, or click to select (Max 5 photos)
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={images.length >= 5}
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Files
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e.target.files)}
                        />
                      </div>

                      {/* Image Preview */}
                      {imagePreview.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {imagePreview.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                                onClick={() => removeImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Item Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Item Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g. MacBook Pro 2021 - Excellent Condition"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => handleInputChange('category_id', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="condition">Condition *</Label>
                        <Select onValueChange={(value) => handleInputChange('condition', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map((condition) => (
                              <SelectItem key={condition.value} value={condition.value}>
                                {condition.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your item in detail. Include any defects, original purchase price, etc."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (KSh) *</Label>
                        <Input 
                          id="price" 
                          type="number" 
                          placeholder="0"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Pickup Location</Label>
                        <Input 
                          id="location" 
                          placeholder="e.g. Campus North, Building A"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Listing Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {imagePreview.length > 0 ? (
                          <img src={imagePreview[0]} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-muted-foreground">No image</span>
                        )}
                      </div>
                      <h3 className="font-medium">
                        {formData.title || 'Your Item Title'}
                      </h3>
                      <p className="text-xl font-bold text-primary">
                        KSh {formData.price ? parseFloat(formData.price).toLocaleString() : '0'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        By You • {formData.location || 'Campus Location'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tips for Success</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Use clear, well-lit photos</li>
                      <li>• Write detailed descriptions</li>
                      <li>• Price competitively</li>
                      <li>• Respond quickly to messages</li>
                      <li>• Meet in safe, public places</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    type="submit"
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      'Publish Listing'
                    )}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Sell;
