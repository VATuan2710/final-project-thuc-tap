// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  parentId?: string;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt: Date;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerInfo: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: Pick<User, 'displayName' | 'photoURL'>;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export interface ProductFilterForm {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  sortBy?: 'price' | 'rating' | 'newest' | 'popular';
  sortOrder?: 'asc' | 'desc';
}

export interface CheckoutForm {
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

// Wishlist types
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  addedAt: Date;
} 