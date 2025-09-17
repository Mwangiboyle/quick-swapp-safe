export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  university_domain?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Item {
  id: string;
  user_id: string;
  category_id?: string;
  title: string;
  description?: string;
  price: number;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  location?: string;
  images?: string[];
  status: 'active' | 'sold' | 'pending' | 'draft';
  created_at: string;
  updated_at: string;
  // Relations
  profiles?: Profile;
  categories?: Category;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  item_id?: string;
  message: string;
  created_at: string;
  // Relations
  sender?: Profile;
  receiver?: Profile;
  items?: Item;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  item_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  // Relations
  reviewer?: Profile;
  reviewed_user?: Profile;
  items?: Item;
}
