import type { Item, Profile, Message, Category } from "./types";

export const demoProfile: Profile = {
  id: "demo-user-1",
  email: "demo1@gmail.com",
  first_name: "Demo",
  last_name: "User",
  avatar_url: "",
  university_domain: "gmail.com",
  is_verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoOtherProfile: Profile = {
  id: "demo-user-2",
  email: "demo2@gmail.com",
  first_name: "Seller",
  last_name: "Jane",
  avatar_url: "",
  university_domain: "gmail.com",
  is_verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoCategories: Category[] = [
  { id: "cat-electronics", name: "Electronics", description: "", created_at: new Date().toISOString() },
  { id: "cat-books", name: "Books", description: "", created_at: new Date().toISOString() },
  { id: "cat-fashion", name: "Fashion", description: "", created_at: new Date().toISOString() },
];

export const demoItems: Item[] = [
  {
    id: "item-1",
    user_id: demoOtherProfile.id,
    category_id: demoCategories[0].id,
    title: "MacBook Pro 2021 - M1",
    description: "Great condition, 16GB RAM, 512GB SSD",
    price: 145000,
    condition: "good",
    location: "Campus North, CS Block",
    images: ["/placeholder.svg"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: demoOtherProfile,
    categories: { id: demoCategories[0].id, name: demoCategories[0].name, created_at: demoCategories[0].created_at },
  },
  {
    id: "item-2",
    user_id: demoOtherProfile.id,
    category_id: demoCategories[1].id,
    title: "Clean Code by Robert C. Martin",
    description: "Slightly used, excellent condition",
    price: 2000,
    condition: "like_new",
    location: "Library Entrance",
    images: ["/placeholder.svg"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: demoOtherProfile,
    categories: { id: demoCategories[1].id, name: demoCategories[1].name, created_at: demoCategories[1].created_at },
  },
  {
    id: "item-3",
    user_id: demoProfile.id,
    category_id: demoCategories[2].id,
    title: "Hoodie - Campus Edition",
    description: "Brand new hoodie",
    price: 3500,
    condition: "new",
    location: "Dorm A",
    images: ["/placeholder.svg"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: demoProfile,
    categories: { id: demoCategories[2].id, name: demoCategories[2].name, created_at: demoCategories[2].created_at },
  },
];

export const demoMessages: Message[] = [
  {
    id: "msg-1",
    conversation_id: `conv-${demoProfile.id}-${demoOtherProfile.id}-item-1`,
    sender_id: demoProfile.id,
    receiver_id: demoOtherProfile.id,
    item_id: "item-1",
    message: "Hi! I'm interested in your MacBook.",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    sender: demoProfile,
    receiver: demoOtherProfile,
    items: demoItems[0],
  },
  {
    id: "msg-2",
    conversation_id: `conv-${demoProfile.id}-${demoOtherProfile.id}-item-1`,
    sender_id: demoOtherProfile.id,
    receiver_id: demoProfile.id,
    item_id: "item-1",
    message: "Yes, it's still available!",
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    sender: demoOtherProfile,
    receiver: demoProfile,
    items: demoItems[0],
  },
];

export const makeDemoConversationId = (a: string, b: string, itemId?: string) => {
  return [a, b, itemId].filter(Boolean).sort().join('-');
};

// Runtime, mutable stores for demo mode
let demoItemsRuntime: Item[] = [...demoItems];
let demoMessagesRuntime: Message[] = [...demoMessages];

export const demoStore = {
  getItems: () => demoItemsRuntime,
  getItemById: (id: string) => demoItemsRuntime.find(i => i.id === id) || null,
  setItems: (next: Item[]) => { demoItemsRuntime = next; },
  updateItem: (id: string, updates: Partial<Item>) => {
    demoItemsRuntime = demoItemsRuntime.map(i => i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i);
    return demoItemsRuntime.find(i => i.id === id) || null;
  },
  getMessages: () => demoMessagesRuntime,
  addMessage: (msg: Omit<Message, 'id' | 'created_at'>) => {
    const newMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    demoMessagesRuntime = [...demoMessagesRuntime, newMsg];
    return newMsg;
  }
};
