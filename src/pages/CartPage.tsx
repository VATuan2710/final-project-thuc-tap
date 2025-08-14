import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Space, 
  Empty,
  Image,
  InputNumber,
  Divider,
  Breadcrumb,
  Table,
  Popconfirm,
  message,
  Badge,
  Alert
} from 'antd';
import { 
  ShoppingCartOutlined, 
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  HomeOutlined,
  ShoppingOutlined,
  ClearOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  TruckOutlined
} from '@ant-design/icons';
import { useCartStore } from '../store/cartStore';
import { SEO } from '../components/SEO';
import { CartStatus } from '../components/CartStatus';
import type { ColumnsType } from 'antd/es/table';
import type { CartItem } from '../types';

const { Title, Text, Paragraph } = Typography;

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);
  
  const { 
    items, 
    total, 
    updateQuantity, 
    removeItem, 
    clearCart,
    getItemCount 
  } = useCartStore();

  const itemCount = getItemCount();

  // Check screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      message.warning('Giỏ hàng của bạn đang trống');
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  // Table columns for desktop view
  const columns: ColumnsType<CartItem> = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image
            src={record.product.images[0] || '/placeholder-image.jpg'}
            alt={record.product.name}
            width={80}
            height={80}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
          <div>
            <Link to={`/products/${record.product.id}`}>
              <Text strong style={{ color: 'inherit' }}>
                {record.product.name}
              </Text>
            </Link>
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {record.product.category}
              </Text>
            </div>
            {record.product.tags && (
              <div style={{ marginTop: '4px' }}>
                {record.product.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} count={tag} style={{ backgroundColor: '#f0f0f0', color: '#666' }} />
                ))}
              </div>
            )}
          </div>
        </div>
      ),
      width: '40%'
    },
    {
      title: 'Đơn giá',
      key: 'price',
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
            {formatPrice(record.price)}
          </Text>
          {record.product.originalPrice && record.product.originalPrice > record.price && (
            <div>
              <Text delete type="secondary" style={{ fontSize: '12px' }}>
                {formatPrice(record.product.originalPrice)}
              </Text>
            </div>
          )}
        </div>
      ),
      width: '15%'
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(record.productId, record.quantity - 1)}
            disabled={record.quantity <= 1}
          />
          <InputNumber
            min={1}
            max={record.product.stock || 999}
            value={record.quantity}
            onChange={(value) => handleQuantityChange(record.productId, value || 1)}
            style={{ width: '60px' }}
            size="small"
          />
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(record.productId, record.quantity + 1)}
            disabled={record.quantity >= (record.product.stock || 999)}
          />
        </Space>
      ),
      width: '20%'
    },
    {
      title: 'Thành tiền',
      key: 'subtotal',
      render: (_, record) => (
        <Text strong style={{ color: '#ff4d4f', fontSize: '16px' }}>
          {formatPrice(record.price * record.quantity)}
        </Text>
      ),
      width: '15%'
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Xóa sản phẩm"
          description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
          onConfirm={() => handleRemoveItem(record.productId)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      ),
      width: '10%'
    }
  ];

  // Mobile Card Component
  const MobileCartItem = ({ item }: { item: CartItem }) => (
    <Card style={{ marginBottom: '16px' }}>
      <Row gutter={12}>
        <Col span={8}>
          <Link to={`/products/${item.product.id}`}>
            <Image
              src={item.product.images[0] || '/placeholder-image.jpg'}
              alt={item.product.name}
              width="100%"
              height={100}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
          </Link>
        </Col>
        <Col span={16}>
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <Link to={`/products/${item.product.id}`}>
              <Text strong style={{ color: 'inherit' }}>
                {item.product.name}
              </Text>
            </Link>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ color: '#1890ff' }}>
                  {formatPrice(item.price)}
                </Text>
                {item.product.originalPrice && item.product.originalPrice > item.price && (
                  <div>
                    <Text delete type="secondary" style={{ fontSize: '12px' }}>
                      {formatPrice(item.product.originalPrice)}
                    </Text>
                  </div>
                )}
              </div>
              <Popconfirm
                title="Xóa sản phẩm?"
                onConfirm={() => handleRemoveItem(item.productId)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button type="text" danger icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <Button
                  type="text"
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                />
                <Text strong>{item.quantity}</Text>
                <Button
                  type="text"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= (item.product.stock || 999)}
                />
              </Space>
              <Text strong style={{ color: '#ff4d4f' }}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  if (items.length === 0) {
    return (
      <>
        <SEO 
          title="Giỏ hàng - E-Shop"
          description="Giỏ hàng của bạn tại E-Shop"
          keywords="giỏ hàng, mua sắm, thanh toán"
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
                  title: <><ShoppingCartOutlined /> Giỏ hàng</>
                }
              ]}
            />

            <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Empty
                image={<ShoppingCartOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                description={
                  <div>
                    <Title level={3}>Giỏ hàng của bạn đang trống</Title>
                    <Paragraph type="secondary">
                      Hãy khám phá các sản phẩm tuyệt vời và thêm chúng vào giỏ hàng
                    </Paragraph>
                  </div>
                }
              >
                <Button 
                  type="primary" 
                  size="large"
                  icon={<ShoppingOutlined />}
                  onClick={handleContinueShopping}
                >
                  Tiếp tục mua sắm
                </Button>
              </Empty>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`Giỏ hàng (${itemCount}) - E-Shop`}
        description="Xem và quản lý sản phẩm trong giỏ hàng của bạn"
        keywords="giỏ hàng, mua sắm, thanh toán, sản phẩm"
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
                title: <><ShoppingCartOutlined /> Giỏ hàng ({itemCount})</>
              }
            ]}
          />

          {/* Cart Status Alert */}
          <CartStatus />
          
          <Row gutter={24}>
            {/* Cart Items */}
            <Col xs={24} lg={16}>
              <Card 
                title={
                  <Space>
                    <ShoppingCartOutlined />
                    <span>Giỏ hàng của bạn ({itemCount} sản phẩm)</span>
                  </Space>
                }
                extra={
                  items.length > 0 && (
                    <Popconfirm
                      title="Xóa tất cả sản phẩm"
                      description="Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?"
                      onConfirm={handleClearCart}
                      okText="Xóa tất cả"
                      cancelText="Hủy"
                    >
                      <Button 
                        type="text" 
                        danger 
                        icon={<ClearOutlined />}
                        size="small"
                      >
                        Xóa tất cả
                      </Button>
                    </Popconfirm>
                  )
                }
              >
                {/* Desktop Table View */}
                {!isMobile && (
                  <div>
                    <Table
                      dataSource={items}
                      columns={columns}
                      rowKey="id"
                      pagination={false}
                      scroll={{ x: 800 }}
                    />
                  </div>
                )}

                {/* Mobile Card View */}
                {isMobile && (
                  <div>
                    {items.map(item => (
                      <MobileCartItem key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </Card>
            </Col>

            {/* Order Summary */}
            <Col xs={24} lg={8}>
              <Card title="Tóm tắt đơn hàng" style={{ position: 'sticky', top: '24px' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {/* Summary Details */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <Text>Tạm tính ({itemCount} sản phẩm):</Text>
                      <Text strong>{formatPrice(total)}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <Text>Phí vận chuyển:</Text>
                      <Text strong style={{ color: '#52c41a' }}>Miễn phí</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <Text>Giảm giá:</Text>
                      <Text>-{formatPrice(0)}</Text>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <Text strong style={{ fontSize: '18px' }}>Tổng cộng:</Text>
                      <Text strong style={{ fontSize: '20px', color: '#ff4d4f' }}>
                        {formatPrice(total)}
                      </Text>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    onClick={handleCheckout}
                    style={{ width: '100%', height: '48px' }}
                  >
                    Tiến hành thanh toán
                  </Button>

                  {/* Continue Shopping */}
                  <Button
                    type="default"
                    size="large"
                    icon={<ShoppingOutlined />}
                    onClick={handleContinueShopping}
                    style={{ width: '100%' }}
                  >
                    Tiếp tục mua sắm
                  </Button>

                  <Divider />

                  {/* Benefits */}
                  <div>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TruckOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                        <Text style={{ fontSize: '14px' }}>Miễn phí vận chuyển toàn quốc</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SafetyCertificateOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        <Text style={{ fontSize: '14px' }}>Bảo hành chính hãng</Text>
                      </div>
                    </Space>
                  </div>

                  {/* Promotion Alert */}
                  <Alert
                    message="Khuyến mãi đặc biệt"
                    description="Mua thêm 500.000đ để được giảm 10% tổng đơn hàng"
                    type="info"
                    showIcon
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}; 