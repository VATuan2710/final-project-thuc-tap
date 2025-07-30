import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productService from '../services/productService';
import type { Product, ProductFilterForm } from '../types';
import { message } from 'antd';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilterForm) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  categories: () => ['categories'] as const,
  search: (term: string) => [...productKeys.all, 'search', term] as const,
  byCategory: (categoryId: string) => [...productKeys.all, 'category', categoryId] as const,
};

// Get products with filters and pagination
export const useProducts = (filters: ProductFilterForm = {}, pageSize = 12) => {
  return useInfiniteQuery({
    queryKey: productKeys.list(filters),
    queryFn: ({ pageParam }) => 
      productService.getProducts(filters, pageParam?.page || 1, pageSize, pageParam?.lastDoc),
    initialPageParam: { page: 1, lastDoc: undefined as any },
    getNextPageParam: (lastPage) => {
      const { pagination, lastDoc } = lastPage;
      if (pagination.page < pagination.pages && lastDoc) {
        return { page: pagination.page + 1, lastDoc };
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get featured products
export const useFeaturedProducts = (limit = 8) => {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productService.getFeaturedProducts(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: productService.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Search products
export const useSearchProducts = (searchTerm: string) => {
  return useQuery({
    queryKey: productKeys.search(searchTerm),
    queryFn: () => productService.searchProducts(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get products by category
export const useProductsByCategory = (categoryId: string, limit = 12) => {
  return useQuery({
    queryKey: productKeys.byCategory(categoryId),
    queryFn: () => productService.getProductsByCategory(categoryId, limit),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutations for admin operations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      message.success('Sản phẩm đã được tạo thành công!');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Có lỗi xảy ra khi tạo sản phẩm');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      productService.updateProduct(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      message.success('Sản phẩm đã được cập nhật thành công!');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      message.success('Sản phẩm đã được xóa thành công!');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Có lỗi xảy ra khi xóa sản phẩm');
    },
  });
}; 