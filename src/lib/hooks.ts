// src/lib/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { 
  itemsApi, 
  profilesApi, 
  messagesApi, 
  reviewsApi, 
  categoriesApi,
  dashboardApi 
} from './api';
import type { CreateItemData, ItemFilters } from './types';

// Items hooks
export const useItems = (filters?: ItemFilters) => {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: () => itemsApi.getItems(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useItem = (id: string) => {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => itemsApi.getItem(id),
    enabled: !!id,
  });
};

export const useSimilarItems = (categoryId: string, excludeId: string) => {
  return useQuery({
    queryKey: ['similar-items', categoryId, excludeId],
    queryFn: () => itemsApi.getSimilarItems(categoryId, excludeId),
    enabled: !!categoryId && !!excludeId,
  });
};

export const useUserItems = (userId: string) => {
  return useQuery({
    queryKey: ['user-items', userId],
    queryFn: () => itemsApi.getUserItems(userId),
    enabled: !!userId,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (itemData: CreateItemData) => itemsApi.createItem(itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['user-items'] });
      toast({
        title: "Success!",
        description: "Your item has been listed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateItemData> }) =>
      itemsApi.updateItem(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', data?.data?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-items'] });
      toast({
        title: "Updated!",
        description: "Your item has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => itemsApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['user-items'] });
      toast({
        title: "Deleted!",
        description: "Your item has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Profile hooks
export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profilesApi.getProfile(userId),
    enabled: !!userId,
  });
};

export const useCurrentProfile = () => {
  return useQuery({
    queryKey: ['current-profile'],
    queryFn: async () => {
      console.log('🔍 Fetching current profile...');
      
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('❌ Auth error:', userError);
          throw userError;
        }
        
        if (!user) {
          console.log('❌ No authenticated user');
          return null;
        }
        
        console.log('✅ Found user:', user.id, user.email);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('❌ Profile fetch error:', profileError);
          // If profile doesn't exist, create it
          if (profileError.code === 'PGRST116') {
            console.log('🔧 Creating missing profile...');
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: user.id,
                  email: user.email!,
                  first_name: user.user_metadata?.first_name || '',
                  last_name: user.user_metadata?.last_name || '',
                  university_domain: user.email!.split('@')[1],
                  is_verified: false
                }
              ])
              .select()
              .single();
              
            if (createError) {
              console.error('❌ Profile creation error:', createError);
              throw createError;
            }
            
            console.log('✅ Created new profile:', newProfile);
            return newProfile;
          }
          throw profileError;
        }
        
        console.log('✅ Found profile:', profile);
        return profile;
      } catch (error) {
        console.error('❌ useCurrentProfile error:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) =>
      profilesApi.updateProfile(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['current-profile'] });
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Messages hooks
export const useConversations = (userId: string) => {
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => messagesApi.getConversations(userId),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useConversationMessages = (conversationId: string, userId: string) => {
  return useQuery({
    queryKey: ['conversation-messages', conversationId],
    queryFn: () => messagesApi.getConversationMessages(conversationId, userId),
    enabled: !!conversationId && !!userId,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time feel
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation-messages'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Reviews hooks
export const useUserReviews = (userId: string) => {
  return useQuery({
    queryKey: ['user-reviews', userId],
    queryFn: () => reviewsApi.getUserReviews(userId),
    enabled: !!userId,
  });
};

export const useUserRating = (userId: string) => {
  return useQuery({
    queryKey: ['user-rating', userId],
    queryFn: () => reviewsApi.getUserRating(userId),
    enabled: !!userId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['user-rating'] });
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
    staleTime: Infinity, // Categories rarely change
  });
};

// Dashboard hooks
export const useDashboardStats = (userId: string) => {
  return useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: () => dashboardApi.getUserStats(userId),
    enabled: !!userId,
    refetchInterval: 60000, // Refetch every minute
  });
};

// Authentication helper hooks
export const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });
};

// Real-time subscriptions hook
export const useRealtimeSubscription = (
  table: string,
  filter?: string,
  onUpdate?: () => void
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table,
          filter 
        }, 
        (payload) => {
          // Invalidate relevant queries on data changes
          queryClient.invalidateQueries({ queryKey: [table] });
          if (onUpdate) onUpdate();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, filter, queryClient, onUpdate]);
};
