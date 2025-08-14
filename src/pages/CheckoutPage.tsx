import React, { useEffect, useState } from 'react';
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
  Radio,
  Divider,
  Modal,
  Spin,
  message
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
import { useCreateOrder, useProcessPayment } from '../hooks/useOrders';
import { SEO } from '../components/SEO';
import type { Address, PaymentMethod } from '../types';

const { Title, Text } = Typography;

interface CheckoutForm {
  fullName: string;
  phoneNumber: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: PaymentMethod;
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, getItemCount, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuth();
  const createOrder = useCreateOrder();
  const processPayment = useProcessPayment();
  
  const [form] = Form.useForm<CheckoutForm>();
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  
  const itemCount = getItemCount();

  // Kiểm tra authentication khi vào trang checkout
  useEffect(() => {
    if (!isAuthenticated) {
      // Lưu URL hiện tại để redirect lại sau khi login
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login?message=checkout');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        paymentMethod: 'cod' as PaymentMethod,
      });
    }
  }, [user, form]);

  // Check if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      message.warning('Giỏ hàng của bạn đang trống');
      navigate('/cart');
    }
  }, [items.length, navigate]);

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

  const handlePlaceOrder = async (formData: CheckoutForm) => {
    try {
      setProcessing(true);

      // Convert cart items to order items
      const orderItems = items.map(item => ({
        id: item.id,
        productId: item.productId,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      }));

      // Create shipping address
      const shippingAddress: Address = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: 'Việt Nam',
      };

      // Create order
      const order = await createOrder.mutateAsync({
        items: orderItems,
        total,
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        customerInfo: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
        },
      });

      setCurrentOrderId(order.id);

      // Show payment modal
      setPaymentModalVisible(true);
    } catch (error) {
      console.error('Error placing order:', error);
      message.error('Không thể tạo đơn hàng!');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!currentOrderId) return;

    try {
      setProcessing(true);
      const paymentMethod = form.getFieldValue('paymentMethod');
      
      const result = await processPayment.mutateAsync({
        orderId: currentOrderId,
        paymentMethod,
      });

      if (result.success) {
        // Clear cart after successful payment
        clearCart();
        
        // Navigate to success page
        navigate(`/checkout/success?orderId=${currentOrderId}&transactionId=${result.transactionId}`);
      } else {
        message.error('Thanh toán thất bại! Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      message.error('Có lỗi xảy ra trong quá trình thanh toán!');
    } finally {
      setProcessing(false);
      setPaymentModalVisible(false);
    }
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
                <Form form={form} layout="vertical" onFinish={handlePlaceOrder}>
                  <Title level={4}>
                    <EnvironmentOutlined /> Địa chỉ giao hàng
                  </Title>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item 
                        label="Họ và tên" 
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                      >
                        <Input placeholder="Nhập họ và tên" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item 
                        label="Số điện thoại" 
                        name="phoneNumber"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số điện thoại!' },
                          { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                      >
                        <Input placeholder="Nhập số điện thoại" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item 
                    label="Email" 
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>

                  <Form.Item 
                    label="Địa chỉ" 
                    name="street"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                  >
                    <Input placeholder="Số nhà, tên đường" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item 
                        label="Thành phố" 
                        name="city"
                        rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
                      >
                        <Input placeholder="Nhập thành phố" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item 
                        label="Tỉnh/Thành" 
                        name="state"
                        rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành!' }]}
                      >
                        <Input placeholder="Nhập tỉnh/thành" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item 
                    label="Mã bưu điện" 
                    name="zipCode"
                    rules={[{ required: true, message: 'Vui lòng nhập mã bưu điện!' }]}
                  >
                    <Input placeholder="Nhập mã bưu điện" />
                  </Form.Item>

                  <Divider />

                  <Title level={4}>
                    <CreditCardOutlined /> Phương thức thanh toán
                  </Title>

                  <Form.Item 
                    name="paymentMethod"
                    rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                  >
                    <Radio.Group>
                      <Space direction="vertical">
                        <Radio value="cash_on_delivery">Thanh toán khi nhận hàng (COD)</Radio>
                        <Radio value="bank_transfer">Chuyển khoản ngân hàng (Demo)</Radio>
                        <Radio value="credit_card">Thanh toán bằng thẻ (Demo)</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      size="large"
                      loading={processing}
                      style={{ width: '100%' }}
                    >
                      Đặt hàng ngay
                    </Button>
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

        {/* Payment Modal */}
        <Modal
          title="Xác nhận thanh toán"
          open={paymentModalVisible}
          onCancel={() => setPaymentModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setPaymentModalVisible(false)}>
              Hủy
            </Button>,
            <Button 
              key="pay" 
              type="primary" 
              loading={processing}
              onClick={handlePayment}
            >
              Xác nhận thanh toán
            </Button>,
          ]}
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            {processing ? (
              <div>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>
                  <Text>Đang xử lý thanh toán...</Text>
                </div>
              </div>
            ) : (
              <div>
                <Title level={4}>Xác nhận đơn hàng</Title>
                <Text>Tổng tiền: <strong style={{ color: '#ff4d4f' }}>{formatPrice(total)}</strong></Text>
                <div style={{ marginTop: '16px' }}>
                  <Text type="secondary">
                    Bạn có chắc chắn muốn thanh toán đơn hàng này không?
                  </Text>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}; 