import React from 'react';
import { Button, Card, Space, Typography, message } from 'antd';
import { HeartOutlined, BugOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useWishlist, useAddToWishlist, useIsInWishlist } from '../hooks/useWishlist';
import { testFirebaseConnection, testWishlistFirestore } from '../utils/testFirebase';
import type { Product } from '../types';

const { Title, Text } = Typography;

const testProduct: Product = {
  id: 'test-product-1',
  name: 'Test Product',
  description: 'This is a test product for wishlist',
  price: 100000,
  category: 'test',
  images: ['https://via.placeholder.com/300'],
  stock: 10,
  rating: 4.5,
  reviewCount: 10,
  tags: ['test'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const WishlistTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { data: wishlist, isLoading: wishlistLoading, error: wishlistError } = useWishlist();
  const { data: isInWishlist = false, isLoading: checkLoading } = useIsInWishlist(testProduct.id);
  const addToWishlist = useAddToWishlist();

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      message.error('Vui lòng đăng nhập để sử dụng tính năng yêu thích');
      return;
    }
    
    addToWishlist.mutate(testProduct);
  };

  const handleTestFirebase = async () => {
    message.info('Testing Firebase connection...');
    const result = await testFirebaseConnection();
    if (result) {
      message.success('Firebase connection test passed!');
    } else {
      message.error('Firebase connection test failed!');
    }
  };

  const handleTestWishlist = async () => {
    if (!user?.id) {
      message.error('User not authenticated');
      return;
    }
    
    message.info('Testing wishlist Firestore...');
    const result = await testWishlistFirestore(user.id);
    if (result) {
      message.success('Wishlist Firestore test passed!');
    } else {
      message.error('Wishlist Firestore test failed!');
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <Title level={4}>Wishlist Test</Title>
        <Text>Vui lòng đăng nhập để test tính năng wishlist</Text>
      </Card>
    );
  }

  return (
    <Card style={{ margin: '20px' }}>
      <Title level={4}>Wishlist Test Component</Title>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>User ID: </Text>
          <Text>{user?.id}</Text>
        </div>
        
        <div>
          <Text strong>Wishlist Status: </Text>
          {wishlistLoading ? (
            <Text>Loading...</Text>
          ) : wishlistError ? (
            <Text type="danger">Error: {wishlistError.message}</Text>
          ) : (
            <Text>Loaded ({wishlist?.length || 0} items)</Text>
          )}
        </div>
        
        <div>
          <Text strong>Test Product in Wishlist: </Text>
          {checkLoading ? (
            <Text>Checking...</Text>
          ) : (
            <Text>{isInWishlist ? 'Yes' : 'No'}</Text>
          )}
        </div>
        
        <Space>
          <Button
            type="primary"
            icon={<HeartOutlined />}
            loading={addToWishlist.isPending}
            onClick={handleAddToWishlist}
            disabled={isInWishlist}
          >
            {isInWishlist ? 'Already in Wishlist' : 'Add Test Product to Wishlist'}
          </Button>
          
          <Button
            icon={<BugOutlined />}
            onClick={handleTestFirebase}
          >
            Test Firebase
          </Button>
          
          <Button
            icon={<BugOutlined />}
            onClick={handleTestWishlist}
          >
            Test Wishlist Firestore
          </Button>
        </Space>
        
        {wishlist && wishlist.length > 0 && (
          <div>
            <Title level={5}>Wishlist Items:</Title>
            {wishlist.map((item) => (
              <div key={item.id}>
                <Text>{item.product.name} - {item.productId}</Text>
              </div>
            ))}
          </div>
        )}
      </Space>
    </Card>
  );
};
