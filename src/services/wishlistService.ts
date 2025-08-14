import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '../types';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  addedAt: Date;
}

// Add product to wishlist
export async function addToWishlist(userId: string, product: Product): Promise<void> {
  try {
    const wishlistRef = doc(db, 'wishlists', `${userId}_${product.id}`);
    
    await setDoc(wishlistRef, {
      userId,
      productId: product.id,
      product,
      addedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw new Error('Không thể thêm vào danh sách yêu thích');
  }
}

// Remove product from wishlist
export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  try {
    const wishlistRef = doc(db, 'wishlists', `${userId}_${productId}`);
    await deleteDoc(wishlistRef);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw new Error('Không thể xóa khỏi danh sách yêu thích');
  }
}

// Get user's wishlist
export async function getUserWishlist(userId: string): Promise<WishlistItem[]> {
  try {
    const q = query(
      collection(db, 'wishlists'),
      where('userId', '==', userId),
      orderBy('addedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const wishlistItems: WishlistItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      wishlistItems.push({
        id: doc.id,
        ...data,
        addedAt: data.addedAt?.toDate() || new Date(),
      } as WishlistItem);
    });
    
    return wishlistItems;
  } catch (error) {
    console.error('Error getting wishlist:', error);
    throw new Error('Không thể lấy danh sách yêu thích');
  }
}

// Check if product is in wishlist
export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    const wishlistRef = doc(db, 'wishlists', `${userId}_${productId}`);
    const docSnap = await getDoc(wishlistRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
}

// Clear entire wishlist
export async function clearWishlist(userId: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'wishlists'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw new Error('Không thể xóa danh sách yêu thích');
  }
}
