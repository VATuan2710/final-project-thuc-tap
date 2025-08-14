import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import * as orderService from '../services/orderService';
import type { Order, OrderItem, Address, PaymentMethod } from '../types';
import { message } from 'antd';

export interface CreateOrderData {
  items: OrderItem[];
  total: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  customerInfo: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
}

// Get user orders
export const useUserOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return orderService.getUserOrders(user.id);
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
  });
};

// Get specific order
export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
  });
};

// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const orderData = {
        ...data,
        userId: user.id,
      };

      return orderService.createOrder(orderData);
    },
    onSuccess: (order) => {
      // Invalidate orders query to refetch
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
      message.success('Đơn hàng đã được tạo thành công!');
      return order;
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      message.error('Tạo đơn hàng thất bại!');
    },
  });
};

// Process payment mutation
export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ orderId, paymentMethod }: { orderId: string; paymentMethod: PaymentMethod }) => {
      return orderService.processPayment(orderId, paymentMethod);
    },
    onSuccess: (result, { orderId }) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });

      if (result.success) {
        message.success('Thanh toán thành công!');
      } else {
        message.error('Thanh toán thất bại!');
      }
      
      return result;
    },
    onError: (error) => {
      console.error('Error processing payment:', error);
      message.error('Có lỗi xảy ra trong quá trình thanh toán!');
    },
  });
};

// Update order status mutation
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
      return orderService.updateOrderStatus(orderId, status);
    },
    onSuccess: (_, { orderId }) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      message.success('Cập nhật trạng thái đơn hàng thành công!');
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
      message.error('Cập nhật trạng thái đơn hàng thất bại!');
    },
  });
};
