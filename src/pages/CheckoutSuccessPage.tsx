import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Result, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Divider,
  Spin,
  Tag
} from 'antd';
import { 
  HomeOutlined, 
  ShoppingOutlined,
  PrinterOutlined 
} from '@ant-design/icons';
import { useOrder } from '../hooks/useOrders';
import { SEO } from '../components/SEO';

const { Title, Text, Paragraph } = Typography;

export const CheckoutSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  
  const { data: order, isLoading, error } = useOrder(orderId || '');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'processing';
      case 'shipped':
        return 'blue';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đã gửi hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <Result
        status="error"
        title="Không tìm thấy đơn hàng"
        subTitle="Đơn hàng không tồn tại hoặc đã bị xóa."
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        ]}
      />
    );
  }

  return (
    <>
      <SEO 
        title="Thanh toán thành công - E-Shop"
        description="Đơn hàng của bạn đã được thanh toán thành công"
      />
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        minHeight: '100vh', 
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          {/* Success Result */}
          <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle={`Đơn hàng #${order.id} đã được đặt thành công. Chúng tôi sẽ sớm liên hệ với bạn để xác nhận.`}
            extra={[
              <Button type="primary" key="orders" onClick={() => navigate('/orders')}>
                <ShoppingOutlined /> Xem đơn hàng
              </Button>,
              <Button key="home" onClick={() => navigate('/')}>
                <HomeOutlined /> Về trang chủ
              </Button>
            ]}
          />

          {/* Order Details */}
          <Card title="Chi tiết đơn hàng" style={{ marginTop: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {/* Order Info */}
              <div>
                <Space size="large" wrap>
                  <div>
                    <Text strong>Mã đơn hàng:</Text>
                    <div>#{order.id}</div>
                  </div>
                  <div>
                    <Text strong>Ngày đặt:</Text>
                    <div>{formatDate(order.createdAt)}</div>
                  </div>
                  <div>
                    <Text strong>Trạng thái:</Text>
                    <div>
                      <Tag color={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Tag>
                    </div>
                  </div>
                  {transactionId && (
                    <div>
                      <Text strong>Mã giao dịch:</Text>
                      <div>{transactionId}</div>
                    </div>
                  )}
                </Space>
              </div>

              <Divider />

              {/* Customer Info */}
              <div>
                <Title level={5}>Thông tin khách hàng</Title>
                <Space direction="vertical">
                  <Text><strong>Họ tên:</strong> {order.customerInfo.fullName}</Text>
                  <Text><strong>Email:</strong> {order.customerInfo.email}</Text>
                  <Text><strong>Số điện thoại:</strong> {order.customerInfo.phoneNumber}</Text>
                </Space>
              </div>

              <Divider />

              {/* Shipping Address */}
              <div>
                <Title level={5}>Địa chỉ giao hàng</Title>
                <Paragraph>
                  {order.shippingAddress.street}<br/>
                  {order.shippingAddress.city}, {order.shippingAddress.state}<br/>
                  {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                </Paragraph>
              </div>

              <Divider />

              {/* Order Items */}
              <div>
                <Title level={5}>Sản phẩm đã đặt</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <Text strong>{item.product.name}</Text>
                        <div>
                          <Text type="secondary">Số lượng: {item.quantity}</Text>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Text strong style={{ color: '#1890ff' }}>
                          {formatPrice(item.price * item.quantity)}
                        </Text>
                        <div>
                          <Text type="secondary">{formatPrice(item.price)}/sp</Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </Space>
              </div>

              <Divider />

              {/* Order Total */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                backgroundColor: '#fafafa',
                borderRadius: '8px'
              }}>
                <Title level={4} style={{ margin: 0 }}>Tổng cộng:</Title>
                <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>
                  {formatPrice(order.total)}
                </Title>
              </div>

              {/* Action Buttons */}
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Space>
                  <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
                    In hóa đơn
                  </Button>
                  <Link to="/products">
                    <Button type="primary">
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </Space>
              </div>
            </Space>
          </Card>
        </div>
      </div>
    </>
  );
};
