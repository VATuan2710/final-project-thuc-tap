import React from 'react';
import { Button, Upload, Avatar, message, Card, Space, Typography } from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { useAuth, useUploadAvatar } from '../hooks';

const { Title, Text } = Typography;

export const AvatarUploadTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const uploadAvatar = useUploadAvatar();

  const handleFileSelect = (file: File) => {
    console.log('File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ hỗ trợ file JPG/PNG!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
      return false;
    }

    uploadAvatar.mutate(file);
    return false; // Prevent automatic upload
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <Title level={4}>Avatar Upload Test</Title>
        <Text>Vui lòng đăng nhập để test upload avatar</Text>
      </Card>
    );
  }

  return (
    <Card style={{ margin: '20px' }}>
      <Title level={4}>Avatar Upload Test</Title>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>Current User: </Text>
          <Text>{user?.displayName} ({user?.email})</Text>
        </div>
        
        <div>
          <Text strong>Current Avatar: </Text>
        </div>
        
        <Avatar
          size={100}
          src={user?.photoURL}
          icon={<UserOutlined />}
        />
        
        <div>
          <Text strong>Upload Status: </Text>
          <Text>{uploadAvatar.isPending ? 'Uploading...' : 'Ready'}</Text>
        </div>
        
        <Upload
          showUploadList={false}
          beforeUpload={handleFileSelect}
          accept="image/*"
        >
          <Button
            type="primary"
            icon={<CameraOutlined />}
            loading={uploadAvatar.isPending}
          >
            Test Upload Avatar
          </Button>
        </Upload>
        
        {uploadAvatar.error && (
          <div>
            <Text strong>Error: </Text>
            <Text type="danger">{uploadAvatar.error.message}</Text>
          </div>
        )}
      </Space>
    </Card>
  );
};
