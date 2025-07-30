import React, { useState } from 'react';
import { Button, message } from 'antd';
import { DatabaseOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { seedData } from '../scripts/seedData';

export const SeedDataButton: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);

  const handleSeedData = async () => {
    if (isSeeding || isSeeded) return;
    
    setIsSeeding(true);
    try {
      await seedData();
      setIsSeeded(true);
      message.success('Dữ liệu mẫu đã được tạo thành công!');
      console.log('Data seeded successfully!');
    } catch (error) {
      console.error('Error seeding data:', error);
      message.error('Có lỗi xảy ra khi tạo dữ liệu mẫu');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      zIndex: 1000
    }}>
      <Button
        type={isSeeded ? 'default' : 'primary'}
        icon={
          isSeeded ? <CheckCircleOutlined /> : 
          isSeeding ? <LoadingOutlined /> : 
          <DatabaseOutlined />
        }
        onClick={handleSeedData}
        disabled={isSeeding || isSeeded}
        size="large"
        style={{
          backgroundColor: isSeeded ? '#52c41a' : undefined,
          borderColor: isSeeded ? '#52c41a' : undefined,
          color: isSeeded ? 'white' : undefined
        }}
      >
        {isSeeded ? 'Đã tạo dữ liệu' : isSeeding ? 'Đang tạo...' : 'Tạo dữ liệu mẫu'}
      </Button>
    </div>
  );
}; 