import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Rate, Spin, Typography, Row, Col, Space, Image } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useFeaturedProducts, useCategories } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { SEO } from '../components/SEO';


const { Title, Paragraph, Text } = Typography;

export const HomePage: React.FC = () => {
  const { data: featuredProducts, isLoading: loadingProducts } = useFeaturedProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: any) => {
    addItem(product);
  };

  return (
    <>
      <SEO 
        title="E-Shop - Cửa hàng trực tuyến hàng đầu"
        description="Khám phá hàng ngàn sản phẩm chất lượng cao với giá cả hợp lý tại E-Shop. Giao hàng nhanh, thanh toán an toàn."
        keywords="mua sắm trực tuyến, e-commerce, sản phẩm chất lượng, giao hàng nhanh, thời trang, điện tử, gia dụng"
      />
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
        {/* Hero Section */}
        <section style={{ 
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '80px 0'
        }}>
          <div className="container">
            <Title level={1} style={{ color: 'white', fontSize: '3rem', marginBottom: '24px' }}>
              Chào mừng đến với E-Shop
            </Title>
            <Paragraph style={{ color: 'white', fontSize: '1.25rem', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
              Khám phá hàng ngàn sản phẩm chất lượng cao với giá cả hợp lý
            </Paragraph>
            <Link to="/products">
              <Button 
                type="primary" 
                size="large"
                style={{ 
                  backgroundColor: 'white', 
                  borderColor: 'white', 
                  color: '#1890ff',
                  fontWeight: 600,
                  height: '48px',
                  padding: '0 32px'
                }}
              >
                Mua sắm ngay
              </Button>
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container">
            <Title level={2} className="text-center mb-8">Danh mục sản phẩm</Title>
            {loadingCategories ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[24, 24]}>
                {categories?.map((category) => (
                  <Col xs={12} md={6} key={category.id}>
                    <Link to={`/products?category=${category.id}`}>
                      <Card
                        hoverable
                        cover={
                          <Image
                            alt={category.name}
                            src={category.image || '/placeholder-image.jpg'}
                            height={200}
                            style={{ objectFit: 'cover' }}
                          />
                        }
                      >
                        <Card.Meta
                          title={category.name}
                          description={category.description}
                        />
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16" style={{ backgroundColor: 'white' }}>
          <div className="container">
            <Title level={2} className="text-center mb-8">Sản phẩm nổi bật</Title>
            {loadingProducts ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[24, 24]}>
                {featuredProducts?.map((product) => (
                  <Col xs={24} sm={12} lg={6} key={product.id}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
                        <Link to={`/products/${product.id}`}>
                          <Image
                            alt={product.name}
                            src={product.images[0] || '/placeholder-image.jpg'}
                            height={250}
                            style={{ objectFit: 'cover' }}
                          />
                        </Link>
                      </div>
                      }
                      actions={[
                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => handleAddToCart(product)}
                          style={{ width: '100%' }}
                        >
                          Thêm vào giỏ
                        </Button>
                      ]}
                    >
                      <Card.Meta
                        title={
                          <Link to={`/products/${product.id}`} style={{ color: 'inherit' }}>
                            {product.name}
                          </Link>
                        }
                        description={
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div>
                              <Rate disabled defaultValue={product.rating} />
                              <Text type="secondary" style={{ marginLeft: 8 }}>
                                ({product.reviewCount})
                              </Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Space>
                                <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                                  {product.price.toLocaleString('vi-VN')}đ
                                </Text>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <Text delete type="secondary">
                                    {product.originalPrice.toLocaleString('vi-VN')}đ
                                  </Text>
                                )}
                              </Space>
                            </div>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
            <div className="text-center mt-8">
              <Link to="/products">
                <Button type="primary" size="large">
                  Xem tất cả sản phẩm
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16" style={{ backgroundColor: '#fafafa' }}>
          <div className="container text-center">
            <Title level={2} className="mb-4">Đăng ký nhận tin</Title>
            <Paragraph style={{ marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt qua email
            </Paragraph>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Space.Compact style={{ width: '100%' }}>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px 0 0 6px',
                    outline: 'none'
                  }}
                />
                <Button type="primary" style={{ borderRadius: '0 6px 6px 0' }}>
                  Đăng ký
                </Button>
              </Space.Compact>
            </div>
          </div>
        </section>



      </div>
    </>
  );
}; 