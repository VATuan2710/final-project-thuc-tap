import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Space, 
  Breadcrumb,
  Steps,
  Form,
  Input,
  Select,
  Radio,
  Divider,
  Alert
} from 'antd';
import { 
  ShoppingCartOutlined, 
  HomeOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../hooks/useAuth';
import { SEO } from '../components/SEO';

const { Title, Text } = Typography;
const { Option } = Select;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, getItemCount } = useCartStore();
  const { isAuthenticated } = useAuth();
  const itemCount = getItemCount();

  // Kiểm tra authentication khi vào trang checkout
  useEffect(() => {
    if (!isAuthenticated) {
      // Lưu URL hiện tại để redirect lại sau khi login
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login?message=checkout');
    }
  }, [isAuthenticated, navigate]);

  // Nếu chưa đăng nhập, hiển thị loading
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Đang chuyển hướng đến trang đăng nhập...</div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <>
      <SEO 
        title="Thanh toán - E-Shop"
        description="Hoàn tất đặt hàng tại E-Shop"
        keywords="thanh toán, đặt hàng, checkout"
      />
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '24px 0' }}>
        <div className="container">
          {/* Breadcrumb */}
          <Breadcrumb 
            style={{ marginBottom: '24px' }}
            items={[
              {
                title: (
                  <Link to="/">
                    <HomeOutlined /> Trang chủ
                  </Link>
                )
              },
              {
                title: <Link to="/cart"><ShoppingCartOutlined /> Giỏ hàng</Link>
              },
              {
                title: <><CreditCardOutlined /> Thanh toán</>
              }
            ]}
          />

          {/* Progress Steps */}
          <Card style={{ marginBottom: '24px' }}>
            <Steps
              current={1}
              items={[
                {
                  title: 'Giỏ hàng',
                  icon: <ShoppingCartOutlined />,
                },
                {
                  title: 'Thanh toán',
                  icon: <CreditCardOutlined />,
                },
                {
                  title: 'Hoàn tất',
                  icon: <CheckCircleOutlined />,
                },
              ]}
            />
          </Card>

          <Row gutter={24}>
            {/* Checkout Form */}
            <Col xs={24} lg={16}>
              <Card title="Thông tin thanh toán">
                <Alert
                  message="Tính năng thanh toán đang được phát triển"
                  description="Đây là trang demo. Tính năng thanh toán thực tế sẽ được cập nhật trong phiên bản tiếp theo."
                  type="info"
                  showIcon
                  style={{ marginBottom: '24px' }}
                />

                <Form layout="vertical">
                  <Title level={4}>
                    <EnvironmentOutlined /> Địa chỉ giao hàng
                  </Title>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Họ và tên" required>
                        <Input placeholder="Nhập họ và tên" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Số điện thoại" required>
                        <Input placeholder="Nhập số điện thoại" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Địa chỉ" required>
                    <Input placeholder="Số nhà, tên đường" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Tỉnh/Thành phố" required>
                        <Select placeholder="Chọn tỉnh/thành">
                          <Option value="hcm">TP. Hồ Chí Minh</Option>
                          <Option value="hn">Hà Nội</Option>
                          <Option value="dn">Đà Nẵng</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Quận/Huyện" required>
                        <Select placeholder="Chọn quận/huyện">
                          <Option value="q1">Quận 1</Option>
                          <Option value="q2">Quận 2</Option>
                          <Option value="q3">Quận 3</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Phường/Xã" required>
                        <Select placeholder="Chọn phường/xã">
                          <Option value="p1">Phường 1</Option>
                          <Option value="p2">Phường 2</Option>
                          <Option value="p3">Phường 3</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider />

                  <Title level={4}>
                    <CreditCardOutlined /> Phương thức thanh toán
                  </Title>

                  <Form.Item>
                    <Radio.Group defaultValue="cod">
                      <Space direction="vertical">
                        <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
                        <Radio value="bank" disabled>Chuyển khoản ngân hàng (Sắp ra mắt)</Radio>
                        <Radio value="visa" disabled>Thanh toán bằng thẻ (Visa/MasterCard) (Sắp ra mắt)</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            {/* Order Summary */}
            <Col xs={24} lg={8}>
              <Card title="Đơn hàng của bạn" style={{ position: 'sticky', top: '24px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Items */}
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <Text strong>{item.product.name}</Text>
                        <div>
                          <Text type="secondary">x{item.quantity}</Text>
                        </div>
                      </div>
                      <Text strong style={{ color: '#1890ff' }}>
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                    </div>
                  ))}

                  <Divider />

                  {/* Summary */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Tạm tính ({itemCount} sản phẩm):</Text>
                    <Text strong>{formatPrice(total)}</Text>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Phí vận chuyển:</Text>
                    <Text strong style={{ color: '#52c41a' }}>Miễn phí</Text>
                  </div>

                  <Divider />

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: '18px' }}>Tổng cộng:</Text>
                    <Text strong style={{ fontSize: '20px', color: '#ff4d4f' }}>
                      {formatPrice(total)}
                    </Text>
                  </div>

                  <Button 
                    type="primary" 
                    size="large" 
                    style={{ width: '100%', marginTop: '16px' }}
                    disabled
                  >
                    Đặt hàng (Demo)
                  </Button>

                  <Link to="/cart">
                    <Button type="default" style={{ width: '100%', marginTop: '8px' }}>
                      Quay lại giỏ hàng
                    </Button>
                  </Link>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}; 