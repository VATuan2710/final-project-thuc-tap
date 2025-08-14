import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import * as cartService from '../services/cartService';

export const useCartSync = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { /*syncWithUser,*/ mergeGuestCart, setCartFromDatabase } = useCartStore();

  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthenticated && user) {
        try {
          // Lấy cart từ Firebase
          const userCart = await cartService.getUserCart(user.id);
          
          if (userCart && userCart.items.length > 0) {
            // Nếu user có cart trong database, load nó
            setCartFromDatabase(userCart.items, userCart.total);
          } else {
            // Nếu user chưa có cart, merge guest cart
            await mergeGuestCart();
          }
        } catch (error) {
          console.error('Error loading user cart:', error);
          // Fallback: merge guest cart
          await mergeGuestCart();
        }
      } 
    //   else if (!isAuthenticated) {
    //     // Khi user đăng xuất, chỉ clear local state, không xóa Firebase
    //     syncWithUser();
    //     console.log('user đăng xuất');
    //   }
    };

    handleAuthChange();
  }, [isAuthenticated, user, mergeGuestCart, /*syncWithUser,*/ setCartFromDatabase]);

  return {
    isGuestCart: useCartStore(state => state.isGuestCart),
    itemCount: useCartStore(state => state.getItemCount()),
  };
}; 