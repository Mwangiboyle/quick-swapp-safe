// src/lib/validation.ts
import type { CreateItemData } from './types';

// University email domains
export const VALID_UNIVERSITY_DOMAINS = [
  'uonbi.ac.ke',
  'students.jkuat.ac.ke', 
  'ku.ac.ke',
  'egerton.ac.ke',
  'dkut.ac.ke',
  'daystar.ac.ke',
  'cuea.edu',
  'strathmore.edu',
  'mku.ac.ke',
  'anu.ac.ke',
  'gretsauniversity.ac.ke',
  'kca.ac.ke',
  'pu.ac.ke',
  'seku.ac.ke',
  'gmail.com',
];

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    } else {
      const domain = email.split('@')[1];
      if (!VALID_UNIVERSITY_DOMAINS.includes(domain)) {
        errors.push({ 
          field: 'email', 
          message: 'Please use a valid Kenyan university email address' 
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    if (password.length < 6) {
      errors.push({ 
        field: 'password', 
        message: 'Password must be at least 6 characters long' 
      });
    }
    if (password.length > 128) {
      errors.push({ 
        field: 'password', 
        message: 'Password must be less than 128 characters' 
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Name validation
export const validateName = (name: string, fieldName: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!name.trim()) {
    errors.push({ field: fieldName, message: `${fieldName} is required` });
  } else {
    if (name.length < 2) {
      errors.push({ 
        field: fieldName, 
        message: `${fieldName} must be at least 2 characters long` 
      });
    }
    if (name.length > 50) {
      errors.push({ 
        field: fieldName, 
        message: `${fieldName} must be less than 50 characters` 
      });
    }
    // Only allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(name)) {
      errors.push({ 
        field: fieldName, 
        message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` 
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Item validation
export const validateItem = (item: CreateItemData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Title validation
  if (!item.title.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else {
    if (item.title.length < 3) {
      errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
    }
    if (item.title.length > 100) {
      errors.push({ field: 'title', message: 'Title must be less than 100 characters' });
    }
  }

  // Price validation
  if (!item.price || item.price <= 0) {
    errors.push({ field: 'price', message: 'Price must be greater than 0' });
  } else {
    if (item.price > 1000000) {
      errors.push({ field: 'price', message: 'Price must be less than 1,000,000' });
    }
    // Check for valid decimal places (max 2)
    const priceStr = item.price.toString();
    const decimalIndex = priceStr.indexOf('.');
    if (decimalIndex !== -1 && priceStr.length - decimalIndex > 3) {
      errors.push({ field: 'price', message: 'Price can have maximum 2 decimal places' });
    }
  }

  // Condition validation
  const validConditions = ['new', 'like_new', 'good', 'fair', 'poor'];
  if (!validConditions.includes(item.condition)) {
    errors.push({ field: 'condition', message: 'Please select a valid condition' });
  }

  // Description validation (optional but if provided should be valid)
  if (item.description && item.description.length > 1000) {
    errors.push({ 
      field: 'description', 
      message: 'Description must be less than 1000 characters' 
    });
  }

  // Location validation (optional but if provided should be valid)
  if (item.location && item.location.length > 100) {
    errors.push({ 
      field: 'location', 
      message: 'Location must be less than 100 characters' 
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Image file validation
export const validateImageFile = (file: File): ValidationResult => {
  const errors: ValidationError[] = [];

  // File type validation
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    errors.push({ 
      field: 'image', 
      message: 'Only JPEG, PNG, and WebP images are allowed' 
    });
  }

  // File size validation (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    errors.push({ 
      field: 'image', 
      message: 'Image size must be less than 5MB' 
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Multiple images validation
export const validateImageFiles = (files: FileList): ValidationResult => {
  const errors: ValidationError[] = [];

  // Max 5 images
  if (files.length > 5) {
    errors.push({ 
      field: 'images', 
      message: 'Maximum 5 images allowed' 
    });
  }

  // Validate each file
  Array.from(files).forEach((file, index) => {
    const fileValidation = validateImageFile(file);
    if (!fileValidation.isValid) {
      fileValidation.errors.forEach(error => {
        errors.push({
          field: `image-${index}`,
          message: `Image ${index + 1}: ${error.message}`
        });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Message validation
export const validateMessage = (message: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!message.trim()) {
    errors.push({ field: 'message', message: 'Message cannot be empty' });
  } else {
    if (message.length > 500) {
      errors.push({ 
        field: 'message', 
        message: 'Message must be less than 500 characters' 
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Review validation
export const validateReview = (rating: number, comment?: string): ValidationResult => {
  const errors: ValidationError[] = [];

  // Rating validation
  if (!rating || rating < 1 || rating > 5) {
    errors.push({ field: 'rating', message: 'Rating must be between 1 and 5' });
  }

  // Comment validation (optional)
  if (comment && comment.length > 500) {
    errors.push({ 
      field: 'comment', 
      message: 'Review comment must be less than 500 characters' 
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Profile bio validation
export const validateBio = (bio: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (bio.length > 300) {
    errors.push({ 
      field: 'bio', 
      message: 'Bio must be less than 300 characters' 
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Phone number validation (basic)
export const validatePhoneNumber = (phone: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (phone) {
    // Basic phone validation for Kenyan numbers
    const phoneRegex = /^(\+254|0)?[17]\d{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      errors.push({ 
        field: 'phone', 
        message: 'Please enter a valid Kenyan phone number' 
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to combine validation results
export const combineValidationResults = (...results: ValidationResult[]): ValidationResult => {
  const allErrors = results.flatMap(result => result.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};
