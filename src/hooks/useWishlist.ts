import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import * as wishlistService from '../services/wishlistService';
import type { Product } from '../types';
import { message } from 'antd';

// Get user wishlist
export const useWishlist = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return wishlistService.getUserWishlist(user.id);
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
  });
};

// Check if product is in wishlist
export const useIsInWishlist = (productId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist', user?.id, 'check', productId],
    queryFn: () => {
      if (!user?.id) {
        return false;
      }
      return wishlistService.isInWishlist(user.id, productId);
    },
    enabled: !!user?.id && !!productId,
    staleTime: 60000, // 1 minute
  });
};

// Add to wishlist mutation
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return wishlistService.addToWishlist(user.id, product);
    },
    onSuccess: (_, product) => {
      // Invalidate wishlist queries
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id, 'check', product.id] });
      message.success('Đã thêm vào danh sách yêu thích!');
    },
    onError: (error) => {
      console.error('Error adding to wishlist:', error);
      message.error('Không thể thêm vào danh sách yêu thích!');
    },
  });
};

// Remove from wishlist mutation
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return wishlistService.removeFromWishlist(user.id, productId);
    },
    onSuccess: (_, productId) => {
      // Invalidate wishlist queries
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id, 'check', productId] });
      message.success('Đã xóa khỏi danh sách yêu thích!');
    },
    onError: (error) => {
      console.error('Error removing from wishlist:', error);
      message.error('Không thể xóa khỏi danh sách yêu thích!');
    },
  });
};

// Clear wishlist mutation
export const useClearWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return wishlistService.clearWishlist(user.id);
    },
    onSuccess: () => {
      // Invalidate all wishlist queries
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      message.success('Đã xóa toàn bộ danh sách yêu thích!');
    },
    onError: (error) => {
      console.error('Error clearing wishlist:', error);
      message.error('Không thể xóa danh sách yêu thích!');
    },
  });
};

// Toggle wishlist (add/remove)
export const useToggleWishlist = () => {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ product, isInWishlist }: { product: Product; isInWishlist: boolean }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      if (isInWishlist) {
        return removeFromWishlist.mutateAsync(product.id);
      } else {
        return addToWishlist.mutateAsync(product);
      }
    },
  });
};
