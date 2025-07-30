import React from 'react';
import { Alert, Button } from 'antd';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCartSync } from '../hooks/useCartSync';
import { useAuth } from '../hooks/useAuth';

export const CartStatus: React.FC = () => {
  const { isGuestCart, itemCount } = useCartSync();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null; 
  }

  if (itemCount === 0) {
    return null; 
  }

  return (
    <Alert
      message="Giỏ hàng tạm thời"
      description={
        <div>
          <p>
            Bạn đang sử dụng giỏ hàng tạm thời. 
            <strong> Đăng nhập</strong> để lưu giỏ hàng vào tài khoản và không bị mất khi đóng trình duyệt.
          </p>
          <div style={{ marginTop: '12px' }}>
            <Button 
              type="primary" 
              icon={<UserOutlined />}
              href="/login"
              style={{ marginRight: '8px' }}
            >
              Đăng nhập ngay
            </Button>
            <Button 
              icon={<ShoppingCartOutlined />}
              href="/register"
            >
              Tạo tài khoản
            </Button>
          </div>
        </div>
      }
      type="info"
      showIcon
      style={{ marginBottom: '16px' }}
    />
  );
}; 