// src/lib/constants.ts

// Application metadata
export const APP_NAME = 'Quick Swapp';
export const APP_DESCRIPTION = 'The trusted campus marketplace for students';
export const APP_VERSION = '1.0.0';

// API endpoints and limits
export const API_LIMITS = {
  MAX_ITEMS_PER_USER: 50,
  MAX_IMAGES_PER_ITEM: 5,
  MAX_IMAGE_SIZE_MB: 5,
  MAX_MESSAGE_LENGTH: 500,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_BIO_LENGTH: 300,
} as const;

// Item conditions
export const ITEM_CONDITIONS = [
  { value: 'new', label: 'New', description: 'Never used, in original packaging' },
  { value: 'like_new', label: 'Like New', description: 'Used once or twice, excellent condition' },
  { value: 'good', label: 'Good', description: 'Used but well maintained' },
  { value: 'fair', label: 'Fair', description: 'Shows wear but fully functional' },
  { value: 'poor', label: 'Poor', description: 'Well worn, may need repairs' },
] as const;

// Item statuses
export const ITEM_STATUSES = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'sold', label: 'Sold', color: 'secondary' },
  { value: 'draft', label: 'Draft', color: 'muted' },
] as const;

// Categories
export const DEFAULT_CATEGORIES = [
  { name: 'Electronics', icon: '💻' },
  { name: 'Books', icon: '📚' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Furniture', icon: '🪑' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Other', icon: '📦' },
] as const;

// University domains
export const KENYAN_UNIVERSITY_DOMAINS = [
  'uonbi.ac.ke',           // University of Nairobi
  'students.jkuat.ac.ke',  // Jomo Kenyatta University
  'ku.ac.ke',              // Kenyatta University
  'egerton.ac.ke',         // Egerton University
  'dkut.ac.ke',           // Dedan Kimathi University
  'daystar.ac.ke',        // Daystar University
  'cuea.edu',             // Catholic University of Eastern Africa
  'strathmore.edu',       // Strathmore University
  'mku.ac.ke',            // Mount Kenya University
  'anu.ac.ke',            // Africa Nazarene University
  'gretsauniversity.ac.ke', // Great Lakes University
  'kca.ac.ke',            // KCA University
  'pu.ac.ke',             // Pwani University
  'seku.ac.ke',// South Eastern Kenya University
  'gmail.com'
] as const;

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: 'Under KSh 1,000', min: 0, max: 1000 },
  { label: 'KSh 1,000 - 5,000', min: 1000, max: 5000 },
  { label: 'KSh 5,000 - 10,000', min: 5000, max: 10000 },
  { label: 'KSh 10,000 - 25,000', min: 10000, max: 25000 },
  { label: 'KSh 25,000 - 50,000', min: 25000, max: 50000 },
  { label: 'Above KSh 50,000', min: 50000, max: Infinity },
] as const;

// File types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
] as const;

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_KENYA: /^(\+254|0)?[17]\d{8}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  NAME: /^[a-zA-Z\s'-]+$/,
} as const;

// Messages
export const MESSAGES = {
  ERRORS: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You need to sign in to perform this action.',
    FORBIDDEN: 'You don\'t have permission to perform this action.',
    NOT_FOUND: 'The requested item was not found.',
    VALIDATION: 'Please check your input and try again.',
  },
  SUCCESS: {
    ITEM_CREATED: 'Item listed successfully!',
    ITEM_UPDATED: 'Item updated successfully!',
    ITEM_DELETED: 'Item deleted successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    MESSAGE_SENT: 'Message sent successfully!',
  },
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  BROWSE: '/browse',
  SELL: '/sell',
  MESSAGES: '/messages',
  PROFILE: '/profile',
  PRODUCT_DETAILS: '/product/:id',
  AUTH_CALLBACK: '/auth/callback',
  RESEND_CONFIRMATION: '/auth/resendconfirmation',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'quick-swapp-theme',
  SEARCH_HISTORY: 'quick-swapp-search-history',
  DRAFT_ITEM: 'quick-swapp-draft-item',
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  AUTH: 'auth',
  PROFILE: 'profile',
  CURRENT_PROFILE: 'current-profile',
  ITEMS: 'items',
  ITEM: 'item',
  USER_ITEMS: 'user-items',
  SIMILAR_ITEMS: 'similar-items',
  CATEGORIES: 'categories',
  CONVERSATIONS: 'conversations',
  CONVERSATION_MESSAGES: 'conversation-messages',
  USER_REVIEWS: 'user-reviews',
  USER_RATING: 'user-rating',
  DASHBOARD_STATS: 'dashboard-stats',
} as const;

// Supabase table names
export const TABLES = {
  PROFILES: 'profiles',
  ITEMS: 'items',
  CATEGORIES: 'categories',
  MESSAGES: 'messages',
  REVIEWS: 'reviews',
} as const;

// Supabase storage buckets
export const STORAGE_BUCKETS = {
  ITEM_IMAGES: 'item_mages',
  AVATARS: 'avatars',
} as const;

// Theme colors (for dynamic styling)
export const THEME_COLORS = {
  PRIMARY: 'hsl(262.1 83.3% 57.8%)',
  SECONDARY: 'hsl(220 14.3% 95.9%)',
  SUCCESS: 'hsl(142.1 76.2% 36.3%)',
  WARNING: 'hsl(38.0 92% 50%)',
  ERROR: 'hsl(0 84.2% 60.2%)',
  INFO: 'hsl(221.2 83.2% 53.3%)',
} as const;

// Animation durations (in ms)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
