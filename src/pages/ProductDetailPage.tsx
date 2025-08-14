import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Rate, 
  Typography, 
  Space, 
  Spin, 
  Empty,
  Tag,
  Image,
  InputNumber,
  Tabs,
  Breadcrumb,
  Divider,
  Statistic,
  Alert,
  Avatar,
  List
} from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined,
  ShareAltOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
  HomeOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useProduct, useFeaturedProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { SEO } from '../components/SEO';

const { Title, Text, Paragraph } = Typography;

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, error } = useProduct(id!);
  const { data: relatedProducts } = useFeaturedProducts(4);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to cart or checkout
    window.location.href = '/cart';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0', minHeight: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0', minHeight: '50vh' }}>
        <Empty 
          description="Không tìm thấy sản phẩm"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link to="/products">
            <Button type="primary">Về trang sản phẩm</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  const mockReviews = [
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
      content: 'Sản phẩm chất lượng, đóng gói cẩn thận. Tôi rất hài lòng với mua hàng này.',
      rating: 5,
      datetime: '2 ngày trước'
    },
    {
      id: 2,
      author: 'Trần Thị B',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=2',
      content: 'Giao hàng nhanh, sản phẩm đúng như mô tả. Sẽ mua lại.',
      rating: 4,
      datetime: '5 ngày trước'
    },
    {
      id: 3,
      author: 'Lê Văn C',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=3',
      content: 'Giá cả hợp lý, chất lượng tốt. Recommend cho mọi người.',
      rating: 5,
      datetime: '1 tuần trước'
    }
  ];

  return (
    <>
      <SEO 
        title={`${product.name} - E-Shop`}
        description={product.description}
        keywords={product.tags?.join(', ')}
        type="product"
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
                title: <Link to="/products">Sản phẩm</Link>
              },
              {
                title: product.name
              }
            ]}
          />

          <Row gutter={24}>
            {/* Product Images */}
            <Col xs={24} md={12}>
              <Card style={{ marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Image
                    src={product.images[selectedImageIndex] || '/placeholder-image.jpg'}
                    alt={product.name}
                    style={{ 
                      width: '100%', 
                      maxWidth: '400px',
                      height: '400px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                
                {product.images.length > 1 && (
                  <Row gutter={8}>
                    {product.images.map((image, index) => (
                      <Col span={6} key={index}>
                        <div
                          onClick={() => setSelectedImageIndex(index)}
                          style={{
                            cursor: 'pointer',
                            border: selectedImageIndex === index ? '2px solid #1890ff' : '1px solid #d9d9d9',
                            borderRadius: '4px',
                            padding: '2px'
                          }}
                        >
                          <Image
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            width="100%"
                            height={80}
                            style={{ objectFit: 'cover' }}
                            preview={false}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card>
            </Col>

            {/* Product Info */}
            <Col xs={24} md={12}>
              <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Title level={2} style={{ margin: 0 }}>
                      {product.name}
                    </Title>
                    <Space wrap style={{ marginTop: '8px' }}>
                      {product.tags?.map(tag => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                  </div>

                  <div>
                    <Space align="center">
                      <Rate disabled value={product.rating} />
                      <Text strong>{product.rating}</Text>
                      <Text type="secondary">({product.reviewCount} đánh giá)</Text>
                      <Divider type="vertical" />
                      <Text type="secondary">Đã bán: 1.2k</Text>
                    </Space>
                  </div>

                  <div style={{ 
                    backgroundColor: '#fafafa', 
                    padding: '16px', 
                    borderRadius: '8px' 
                  }}>
                    <Space direction="vertical" size="small">
                      <div>
                        <Text strong style={{ fontSize: '24px', color: '#ff4d4f' }}>
                          {formatPrice(product.price)}
                        </Text>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <Space style={{ marginLeft: '16px' }}>
                            <Text delete type="secondary" style={{ fontSize: '16px' }}>
                              {formatPrice(product.originalPrice)}
                            </Text>
                            <Tag color="red">
                              -{product.discount}%
                            </Tag>
                          </Space>
                        )}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <Text type="secondary">
                          Tiết kiệm: {formatPrice(product.originalPrice - product.price)}
                        </Text>
                      )}
                    </Space>
                  </div>

                  <div>
                    <Text strong>Số lượng:</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Space>
                        <InputNumber
                          min={1}
                          max={product.stock}
                          value={quantity}
                          onChange={(value) => setQuantity(value || 1)}
                          style={{ width: '80px' }}
                        />
                        <Text type="secondary">
                          Còn lại {product.stock} sản phẩm
                        </Text>
                      </Space>
                    </div>
                  </div>

                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row gutter={12}>
                      <Col span={12}>
                        <Button
                          type="default"
                          size="large"
                          icon={<ShoppingCartOutlined />}
                          onClick={handleAddToCart}
                          style={{ width: '100%' }}
                        >
                          Thêm vào giỏ
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          type="primary"
                          size="large"
                          onClick={handleBuyNow}
                          style={{ width: '100%' }}
                        >
                          Mua ngay
                        </Button>
                      </Col>
                    </Row>

                    <Row gutter={12}>
                      <Col span={12}>
                        <Button
                          type="text"
                          icon={<HeartOutlined />}
                          style={{ width: '100%' }}
                        >
                          Yêu thích
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          type="text"
                          icon={<ShareAltOutlined />}
                          style={{ width: '100%' }}
                        >
                          Chia sẻ
                        </Button>
                      </Col>
                    </Row>
                  </Space>

                  <div>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SafetyCertificateOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        <Text>Bảo hành chính hãng 12 tháng</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TruckOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                        <Text>Miễn phí vận chuyển toàn quốc</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ShopOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                        <Text>Đổi trả trong 7 ngày</Text>
                      </div>
                    </Space>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Product Details Tabs */}
          <Card style={{ marginTop: '24px' }}>
            <Tabs 
              defaultActiveKey="description"
              items={[
                {
                  key: 'description',
                  label: 'Mô tả sản phẩm',
                  children: (
                    <div style={{ padding: '16px 0' }}>
                      <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                        {product.description}
                      </Paragraph>
                      
                      <Title level={4}>Thông số kỹ thuật</Title>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Text strong>Danh mục:</Text> {product.category}
                        </Col>
                        <Col span={12}>
                          <Text strong>Tình trạng:</Text> Còn hàng
                        </Col>
                        <Col span={12}>
                          <Text strong>Thương hiệu:</Text> E-Shop
                        </Col>
                        <Col span={12}>
                          <Text strong>Xuất xứ:</Text> Việt Nam
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'reviews',
                  label: `Đánh giá (${product.reviewCount})`,
                  children: (
                    <div style={{ padding: '16px 0' }}>
                      <Row gutter={24} style={{ marginBottom: '24px' }}>
                        <Col span={8}>
                          <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                            <Statistic
                              title="Đánh giá trung bình"
                              value={product.rating}
                              precision={1}
                              suffix={<span style={{ fontSize: '16px' }}>/5</span>}
                              valueStyle={{ fontSize: '32px', color: '#faad14' }}
                            />
                            <Rate disabled value={product.rating} style={{ marginTop: '8px' }} />
                            <div style={{ marginTop: '8px' }}>
                              <Text type="secondary">{product.reviewCount} đánh giá</Text>
                            </div>
                          </div>
                        </Col>
                        <Col span={16}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            {[5, 4, 3, 2, 1].map(star => (
                              <div key={star} style={{ display: 'flex', alignItems: 'center' }}>
                                <Rate disabled value={star} count={star} />
                                <div style={{ 
                                  width: '200px', 
                                  height: '8px', 
                                  backgroundColor: '#f0f0f0', 
                                  borderRadius: '4px',
                                  marginLeft: '16px',
                                  marginRight: '16px'
                                }}>
                                  <div style={{
                                    width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%`,
                                    height: '100%',
                                    backgroundColor: '#faad14',
                                    borderRadius: '4px'
                                  }} />
                                </div>
                                <Text>{star === 5 ? 70 : star === 4 ? 20 : 10}%</Text>
                              </div>
                            ))}
                          </Space>
                        </Col>
                      </Row>

                      <List
                        dataSource={mockReviews}
                        renderItem={(review) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar src={review.avatar} icon={<UserOutlined />} />}
                              title={
                                <Space>
                                  <Text strong>{review.author}</Text>
                                  <Rate disabled value={review.rating} style={{ fontSize: '12px' }} />
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {review.datetime}
                                  </Text>
                                </Space>
                              }
                              description={
                                <Paragraph style={{ margin: 0 }}>
                                  {review.content}
                                </Paragraph>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  )
                },
                {
                  key: 'policy',
                  label: 'Chính sách đổi trả',
                  children: (
                    <div style={{ padding: '16px 0' }}>
                      <Alert
                        message="Chính sách đổi trả 7 ngày"
                        description="Sản phẩm có thể đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện còn nguyên tem mác, chưa qua sử dụng."
                        type="info"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                      
                      <Title level={4}>Điều kiện đổi trả:</Title>
                      <ul>
                        <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng</li>
                        <li>Đầy đủ hộp, phụ kiện đi kèm</li>
                        <li>Không áp dụng với sản phẩm đã qua sử dụng</li>
                      </ul>
                    </div>
                  )
                }
              ]}
            />
          </Card>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <Card 
              title="Sản phẩm liên quan"
              style={{ marginTop: '24px' }}
            >
              <Row gutter={16}>
                {relatedProducts.map((relatedProduct) => (
                  <Col xs={12} sm={8} lg={6} key={relatedProduct.id}>
                    <Card
                      hoverable
                      size="small"
                      cover={
                        <Link to={`/products/${relatedProduct.id}`}>
                          <Image
                            alt={relatedProduct.name}
                            src={relatedProduct.images[0]}
                            height={150}
                            style={{ objectFit: 'cover' }}
                          />
                        </Link>
                      }
                    >
                      <Card.Meta
                        title={
                          <Link to={`/products/${relatedProduct.id}`} style={{ color: 'inherit' }}>
                            <Text ellipsis style={{ fontSize: '14px' }}>{relatedProduct.name}</Text>
                          </Link>
                        }
                        description={
                          <Text strong style={{ color: '#1890ff' }}>
                            {formatPrice(relatedProduct.price)}
                          </Text>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}; 