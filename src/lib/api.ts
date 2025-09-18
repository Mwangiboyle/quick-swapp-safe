// src/lib/api.ts
import { supabase } from './supabaseClient';
import {
  demoStore,
  demoProfile,
  demoCategories,
  makeDemoConversationId,
} from './demoData';
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
const DEMO_MODE = (import.meta as any).env?.VITE_DEMO_MODE === 'true';

// Robust UUID v4 generator for browsers/environments without crypto.randomUUID
function generateUUIDv4(): string {
  // Prefer native randomUUID
  // @ts-ignore
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    // @ts-ignore
    return globalThis.crypto.randomUUID();
  }
  // Use getRandomValues if available
  // @ts-ignore
  const cryptoObj = (typeof globalThis !== 'undefined') ? globalThis.crypto || (globalThis as any).msCrypto : undefined;
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const buf = new Uint8Array(16);
    cryptoObj.getRandomValues(buf);
    // Per RFC 4122 section 4.4
    buf[6] = (buf[6] & 0x0f) | 0x40; // version 4
    buf[8] = (buf[8] & 0x3f) | 0x80; // variant 10
    const hex = Array.from(buf).map(b => b.toString(16).padStart(2, '0'));
    return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
  }
  // Last resort (less random but valid format)
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export const itemsApi = {
  // Get all active items with optional filters
  async getItems(filters?: ItemFilters) {
    if (DEMO_MODE) {
      // Demo: filter from in-memory store
      let items = demoStore.getItems().filter(i => i.status === 'active');
      if (filters?.category && filters.category !== 'all') {
        items = items.filter(i => i.categories?.name?.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        items = items.filter(i =>
          i.title.toLowerCase().includes(s) || (i.description || '').toLowerCase().includes(s)
        );
      }
      if (filters?.minPrice !== undefined) items = items.filter(i => i.price >= (filters.minPrice as number));
      if (filters?.maxPrice !== undefined) items = items.filter(i => i.price <= (filters.maxPrice as number));
      if (filters?.condition) items = items.filter(i => i.condition === filters.condition);
      // sort by created_at desc
      items = items.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      return Promise.resolve({ data: items, error: null } as any);
    }

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
    if (DEMO_MODE) {
      const item = demoStore.getItemById(id);
      return Promise.resolve({ data: item, error: null } as any);
    }
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
    if (DEMO_MODE) {
      const all = demoStore.getItems().filter(i => i.category_id === categoryId && i.id !== excludeId && i.status === 'active');
      const items = all.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, limit);
      return Promise.resolve({ data: items, error: null } as any);
    }
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
    if (DEMO_MODE) {
      const newItem: any = {
        id: `demo-item-${Date.now()}`,
        user_id: demoProfile.id,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...itemData,
        profiles: demoProfile,
        categories: demoCategories.find(c => c.id === itemData.category_id) || undefined,
      };
      demoStore.setItems([newItem, ...demoStore.getItems()]);
      return Promise.resolve({ data: newItem, error: null } as any);
    }

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
    if (DEMO_MODE) {
      const updated = demoStore.updateItem(id, updates as any);
      return Promise.resolve({ data: updated, error: null } as any);
    }
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
    if (DEMO_MODE) {
      const remaining = demoStore.getItems().filter(i => i.id !== id);
      demoStore.setItems(remaining);
      return Promise.resolve({ data: null, error: null } as any);
    }
    return supabase.from('items').delete().eq('id', id);
  },

  // Get user's items
  async getUserItems(userId: string) {
    if (DEMO_MODE) {
      const items = demoStore.getItems().filter(i => i.user_id === userId);
      return Promise.resolve({ data: items, error: null } as any);
    }
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
    if (DEMO_MODE) {
      const updated = demoStore.updateItem(id, { status: 'sold' } as any);
      return Promise.resolve({ data: updated, error: null } as any);
    }
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
    if (DEMO_MODE) {
      const p = userId === demoProfile.id ? demoProfile : demoProfile; // single demo user for now
      return Promise.resolve({ data: p, error: null } as any);
    }
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },

  async getCurrentProfile() {
    if (DEMO_MODE) {
      return Promise.resolve({ data: demoProfile, error: null } as any);
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    return this.getProfile(user.id);
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    if (DEMO_MODE) {
      // Shallow merge for demo
      const updated = { ...demoProfile, ...updates, updated_at: new Date().toISOString() } as Profile;
      return Promise.resolve({ data: updated, error: null } as any);
    }
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
    if (DEMO_MODE) {
      // Return all messages involving user
      const msgs = demoStore.getMessages().filter(m => m.sender_id === userId || m.receiver_id === userId)
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      return Promise.resolve({ data: msgs, error: null } as any);
    }
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
    if (DEMO_MODE) {
      const msgs = demoStore.getMessages().filter(m => m.conversation_id === conversationId)
        .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
      return Promise.resolve({ data: msgs, error: null } as any);
    }
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
    if (DEMO_MODE) {
      const saved = demoStore.addMessage(messageData);
      return Promise.resolve({ data: saved, error: null } as any);
    }
    const { data, error } = await supabase.from('messages').insert(messageData).select().single();
    if (error) throw error;
    return { data, error } as any;
  },

  async createConversation(senderId: string, receiverId: string, itemId?: string) {
    if (DEMO_MODE) {
      const conversationId = makeDemoConversationId(senderId, receiverId, itemId);
      return conversationId;
    }
    // Try to find an existing conversation (either direction). If itemId provided, include it; otherwise ignore item filter.
    let existing: any[] | null = null;
    let findErr: any = null;
    if (itemId) {
      const { data, error } = await supabase
        .from('messages')
        .select('conversation_id')
        .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
        .eq('item_id', itemId)
        .limit(1);
      existing = data as any[] | null;
      findErr = error;
    } else {
      const { data, error } = await supabase
        .from('messages')
        .select('conversation_id')
        .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
        .limit(1);
      existing = data as any[] | null;
      findErr = error;
    }
    if (!findErr && existing && existing.length > 0 && existing[0]?.conversation_id) {
      return existing[0].conversation_id as unknown as string;
    }
    // Create a new UUID conversation id that matches DB uuid type
    const newId = generateUUIDv4();
    return newId;
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
    if (DEMO_MODE) {
      return Promise.resolve({ data: demoCategories, error: null } as any);
    }
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
    if (DEMO_MODE) {
      const items = demoStore.getItems().filter(i => i.user_id === userId);
      const activeListings = items.filter(i => i.status === 'active').length;
      const soldItems = items.filter(i => i.status === 'sold');
      const totalSales = soldItems.reduce((sum, i) => sum + (i.price || 0), 0);
      const unreadMessages = demoStore.getMessages().filter(m => m.receiver_id === userId).length;
      return {
        activeListings,
        totalSales: `$${totalSales.toFixed(2)}`,
        soldItemsCount: soldItems.length,
        unreadMessages
      };
    }

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
