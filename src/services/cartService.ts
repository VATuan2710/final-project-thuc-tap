import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { CartItem } from '../types';

export interface UserCart {
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt: Date;
}

// Lưu cart vào database
export const saveUserCart = async (userId: string, items: CartItem[], total: number): Promise<void> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, {
      userId,
      items,
      total,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error saving user cart:', error);
    throw error;
  }
};

// Lấy cart từ database
export const getUserCart = async (userId: string): Promise<UserCart | null> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);
    
    if (cartDoc.exists()) {
      const data = cartDoc.data();
      return {
        userId: data.userId,
        items: data.items || [],
        total: data.total || 0,
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user cart:', error);
    throw error;
  }
};

// Cập nhật cart trong database
export const updateUserCart = async (userId: string, items: CartItem[], total: number): Promise<void> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    await updateDoc(cartRef, {
      items,
      total,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user cart:', error);
    throw error;
  }
};

// Merge guest cart với user cart
export const mergeGuestCartWithUserCart = async (
  userId: string, 
  guestItems: CartItem[], 
  guestTotal: number
): Promise<{ items: CartItem[], total: number }> => {
  try {
    // Lấy user cart hiện tại
    const userCart = await getUserCart(userId);
    
    if (!userCart || userCart.items.length === 0) {
      // Nếu user chưa có cart, lưu guest cart
      await saveUserCart(userId, guestItems, guestTotal);
      return { items: guestItems, total: guestTotal };
    }
    
    // Merge guest cart với user cart
    const mergedItems = [...userCart.items];
    const existingProductIds = new Set(userCart.items.map(item => item.productId));
    
    guestItems.forEach(guestItem => {
      const existingItemIndex = mergedItems.findIndex(item => item.productId === guestItem.productId);
      
      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, cộng thêm số lượng
        mergedItems[existingItemIndex].quantity += guestItem.quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        mergedItems.push(guestItem);
      }
    });
    
    const mergedTotal = mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Lưu cart đã merge
    await saveUserCart(userId, mergedItems, mergedTotal);
    
    return { items: mergedItems, total: mergedTotal };
  } catch (error) {
    console.error('Error merging guest cart with user cart:', error);
    throw error;
  }
}; 