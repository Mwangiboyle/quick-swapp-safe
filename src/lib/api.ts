// src/lib/api.ts
import { supabase } from './supabaseClient';
import type { 
  Item, 
  Profile, 
  Message, 
  Review, 
  CreateItemData, 
  ItemFilters,
  Category 
} from './types';

// Items API
export const itemsApi = {
  // Get all active items with optional filters
  async getItems(filters?: ItemFilters) {
    let query = supabase
      .from('items')
      .select(`
        *,
        profiles:user_id(first_name, last_name, avatar_url, is_verified),
        categories(name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters?.category && filters.category !== 'all') {
      // Join with categories table to filter by category name
      query = query.eq('categories.name', filters.category);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.condition) {
      query = query.eq('condition', filters.condition);
    }

    return query;
  },

  // Get single item with seller info
  async getItem(id: string) {
    return supabase
      .from('items')
      .select(`
        *,
        profiles:user_id(
          first_name, 
          last_name, 
          avatar_url, 
          is_verified,
          created_at
        ),
        categories(name)
      `)
      .eq('id', id)
      .single();
  },

  // Get similar items (same category, different item)
  async getSimilarItems(categoryId: string, excludeId: string, limit = 4) {
    return supabase
      .from('items')
      .select(`
        *,
        profiles:user_id(first_name, last_name, avatar_url, is_verified),
        categories(name)
      `)
      .eq('category_id', categoryId)
      .eq('status', 'active')
      .neq('id', excludeId)
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  // Create new item
  async createItem(itemData: CreateItemData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const item = {
      ...itemData,
      user_id: user.id,
      status: 'active' as const
    };

    return supabase.from('items').insert(item).select(`
      *,
      profiles:user_id(first_name, last_name, avatar_url),
      categories(name)
    `).single();
  },

  // Update item
  async updateItem(id: string, updates: Partial<CreateItemData>) {
    return supabase
      .from('items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        profiles:user_id(first_name, last_name, avatar_url),
        categories(name)
      `)
      .single();
  },

  // Delete item
  async deleteItem(id: string) {
    return supabase.from('items').delete().eq('id', id);
  },

  // Get user's items
  async getUserItems(userId: string) {
    return supabase
      .from('items')
      .select(`
        *,
        categories(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  // Mark item as sold
  async markAsSold(id: string) {
    return supabase
      .from('items')
      .update({ status: 'sold', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  }
};

// Profile API
export const profilesApi = {
  async getProfile(userId: string) {
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },

  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    return this.getProfile(user.id);
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    return supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
  },

  async updateCurrentProfile(updates: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    return this.updateProfile(user.id, updates);
  }
};

// Messages API
export const messagesApi = {
  async getConversations(userId: string) {
    // Get unique conversations by grouping messages
    return supabase
      .from('messages')
      .select(`
        conversation_id,
        created_at,
        message,
        sender_id,
        receiver_id,
        sender:profiles!messages_sender_id_fkey(first_name, last_name, avatar_url, is_verified),
        receiver:profiles!messages_receiver_id_fkey(first_name, last_name, avatar_url, is_verified),
        items(id, title)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
  },

  async getConversationMessages(conversationId: string, userId: string) {
    return supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(first_name, last_name, avatar_url),
        receiver:profiles!messages_receiver_id_fkey(first_name, last_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: true });
  },

  async sendMessage(messageData: Omit<Message, 'id' | 'created_at'>) {
    return supabase.from('messages').insert(messageData).select().single();
  },

  async createConversation(senderId: string, receiverId: string, itemId?: string) {
    // Generate a conversation ID (could be a combination of user IDs or UUID)
    const conversationId = [senderId, receiverId, itemId].filter(Boolean).sort().join('-');
    return conversationId;
  }
};

// Reviews API
export const reviewsApi = {
  async getUserReviews(userId: string) {
    return supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(first_name, last_name, avatar_url),
        items(title)
      `)
      .eq('reviewed_user_id', userId)
      .order('created_at', { ascending: false });
  },

  async createReview(reviewData: Omit<Review, 'id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    return supabase.from('reviews').insert({
      ...reviewData,
      reviewer_id: user.id
    }).select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey(first_name, last_name, avatar_url),
      items(title)
    `).single();
  },

  async getUserRating(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewed_user_id', userId);

    if (error) return { data: null, error };

    const ratings = data.map(r => r.rating);
    const average = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    return {
      data: {
        average: Math.round(average * 10) / 10,
        count: ratings.length
      },
      error: null
    };
  }
};

// Categories API
export const categoriesApi = {
  async getCategories() {
    return supabase
      .from('categories')
      .select('*')
      .order('name');
  },

  async getCategoryByName(name: string) {
    return supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .single();
  }
};

// Dashboard Stats API
export const dashboardApi = {
  async getUserStats(userId: string) {
    const [itemsResult, salesResult, messagesResult] = await Promise.all([
      // Active listings count
      supabase
        .from('items')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active'),
      
      // Sold items count and total revenue
      supabase
        .from('items')
        .select('price')
        .eq('user_id', userId)
        .eq('status', 'sold'),
      
      // Unread messages count (this is simplified)
      supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', userId)
    ]);

    const activeListings = itemsResult.count || 0;
    const soldItems = salesResult.data || [];
    const totalSales = soldItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const unreadMessages = messagesResult.count || 0;

    return {
      activeListings,
      totalSales: `$${totalSales.toFixed(2)}`,
      soldItemsCount: soldItems.length,
      unreadMessages
    };
  }
};
