import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export async function testFirebaseConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    // Test reading from a collection
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('Firebase read test successful. Documents:', snapshot.size);
    
    // Test writing to Firebase
    const docRef = await addDoc(testCollection, {
      message: 'Test from wishlist debug',
      timestamp: new Date(),
    });
    console.log('Firebase write test successful. Document ID:', docRef.id);
    
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
}

export async function testWishlistFirestore(userId: string) {
  try {
    console.log('Testing wishlist Firestore operations...');
    
    // Test creating a wishlist item
    const testItem = {
      userId,
      productId: 'test-product-123',
      product: {
        id: 'test-product-123',
        name: 'Test Product',
        price: 100000,
        images: ['test.jpg'],
        description: 'Test',
        category: 'test',
        stock: 1,
        rating: 5,
        reviewCount: 1,
        tags: ['test'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      addedAt: new Date(),
    };
    
    const docRef = await addDoc(collection(db, 'wishlists'), testItem);
    console.log('Wishlist item created successfully:', docRef.id);
    
    return true;
  } catch (error) {
    console.error('Wishlist Firestore test failed:', error);
    return false;
  }
}
