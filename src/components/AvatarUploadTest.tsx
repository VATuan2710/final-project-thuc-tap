import React from 'react';
import { Button, Upload, Avatar, message, Card, Space, Typography } from 'antd';
import { UserOutlined, CameraOutlined, BugOutlined } from '@ant-design/icons';
import { useAuth, useUploadAvatar } from '../hooks';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

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

  const testDirectUpload = async () => {
    try {
      message.info('Testing Firebase Storage connection...');
      
      // Create a test file
      const testData = 'test file content';
      const testFile = new File([testData], 'test.txt', { type: 'text/plain' });
      
      const testRef = ref(storage, `test/${user?.id}/test_${Date.now()}.txt`);
      
      console.log('Uploading test file to:', testRef.fullPath);
      const snapshot = await uploadBytes(testRef, testFile);
      console.log('Test upload successful:', snapshot);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);
      
      message.success('Firebase Storage test successful!');
    } catch (error) {
      console.error('Firebase Storage test failed:', error);
      message.error('Firebase Storage test failed: ' + (error as Error).message);
    }
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
        
        <Space>
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
          
          <Button
            icon={<BugOutlined />}
            onClick={testDirectUpload}
          >
            Test Firebase Storage
          </Button>
        </Space>
        
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
