import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Product } from '../types';

export const useSimpleProducts = () => {
  return useQuery({
    queryKey: ['simple-products'],
    queryFn: async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Product[];
        
        return products;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 