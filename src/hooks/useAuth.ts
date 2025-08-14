import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import * as authService from '../services/authService';
import type { LoginForm, RegisterForm } from '../types';
import { message } from 'antd';
import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';

// Auth state hook
export const useAuth = () => {
  const { user, isLoading, isAuthenticated, setUser, logout } = useAuthStore();

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, [setUser]);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
  };
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginForm) => authService.signInWithEmail(data),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries();
      message.success(`Chào mừng ${user.displayName || user.email}!`);
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterForm) => authService.signUpWithEmail(data),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries();
      message.success(`Chào mừng ${user.displayName}! Tài khoản đã được tạo thành công.`);
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};

// Google login mutation
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: authService.signInWithGoogle,
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries();
      message.success(`Chào mừng ${user.displayName || user.email}!`);
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};



// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      logout();
      useCartStore.getState().clearCart();
      queryClient.clear();
      message.success('Đã đăng xuất thành công!');
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
}; 