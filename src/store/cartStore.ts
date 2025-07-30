import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import * as cartService from '../services/cartService';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
  isGuestCart: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  mergeGuestCart: () => void;
  syncWithUser: () => void;
  setCartFromDatabase: (items: CartItem[], total: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      isGuestCart: true,
      
      addItem: (product, quantity = 1) => {
        const { items, isGuestCart } = get();
        const existingItem = items.find(item => item.productId === product.id);
        
        let newItems: CartItem[];
        
        if (existingItem) {
          newItems = items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            product,
            quantity,
            price: product.price
          };
          newItems = [...items, newItem];
        }
        
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        set({ items: newItems, total, isGuestCart });

        // Nếu user đã đăng nhập, lưu cart vào Firebase
        const { user } = useAuthStore.getState();
        if (user && !isGuestCart) {
          cartService.saveUserCart(user.id, newItems, total).catch(error => {
            console.error('Error saving cart to Firebase:', error);
          });
        }
      },
      
      removeItem: (productId) => {
        const { items, isGuestCart } = get();
        const newItems = items.filter(item => item.productId !== productId);
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        set({ items: newItems, total });

        // Nếu user đã đăng nhập, lưu cart vào Firebase
        const { user } = useAuthStore.getState();
        if (user && !isGuestCart) {
          cartService.saveUserCart(user.id, newItems, total).catch(error => {
            console.error('Error saving cart to Firebase:', error);
          });
        }
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const { items, isGuestCart } = get();
        const newItems = items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        set({ items: newItems, total });

        // Nếu user đã đăng nhập, lưu cart vào Firebase
        const { user } = useAuthStore.getState();
        if (user && !isGuestCart) {
          cartService.saveUserCart(user.id, newItems, total).catch(error => {
            console.error('Error saving cart to Firebase:', error);
          });
        }
      },
      
      clearCart: () => {
        const { isGuestCart } = get();
        set({ items: [], total: 0 });

        // Nếu user đã đăng nhập, xóa cart trong Firebase
        const { user } = useAuthStore.getState();
        if (user && !isGuestCart) {
          cartService.saveUserCart(user.id, [], 0).catch(error => {
            console.error('Error clearing cart in Firebase:', error);
          });
        }
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      mergeGuestCart: async () => {
        const { user } = useAuthStore.getState();
        const { items, total } = get();
        
        if (user && items.length > 0) {
          try {
            // Kiểm tra xem user đã có cart trong Firebase chưa
            const existingCart = await cartService.getUserCart(user.id);
            
            if (existingCart && existingCart.items.length > 0) {
              // Nếu user đã có cart, không merge, chỉ load cart hiện tại
              set({ 
                items: existingCart.items, 
                total: existingCart.total, 
                isGuestCart: false 
              });
            } else {
              // Nếu user chưa có cart, lưu guest cart
              await cartService.saveUserCart(user.id, items, total);
              set({ isGuestCart: false });
            }
          } catch (error) {
            console.error('Error merging guest cart:', error);
            set({ isGuestCart: false });
          }
        } else {
          // Nếu không có items hoặc user, chỉ chuyển sang user cart
          set({ isGuestCart: false });
        }
      },

      syncWithUser: () => {
        const { user } = useAuthStore.getState();
        if (user) {
          // Khi user đăng nhập, sync cart với database
          get().mergeGuestCart();
        } else {
          // Khi logout, chỉ chuyển về guest cart (không xóa cart trong Firebase)
          set({ items: [], total: 0, isGuestCart: true });
        }
      },

      setCartFromDatabase: (items: CartItem[], total: number) => {
        set({ 
          items, 
          total, 
          isGuestCart: false 
        });
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => {
        // Không lưu cart vào localStorage, chỉ lưu vào Firebase
        return {
          items: [],
          total: 0,
          isGuestCart: true,
        };
      },
    }
  )
); 