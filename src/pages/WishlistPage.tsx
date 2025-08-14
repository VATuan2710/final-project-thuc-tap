import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Space, 
  Button, 
  Empty,
  Spin,
  Alert,
  Image,
  Row,
  Col,
  Breadcrumb,
  Rate,
  Popconfirm,
  message
} from 'antd';
import { 
  HeartOutlined, 
  ShoppingCartOutlined,
  DeleteOutlined,
  HomeOutlined,
  EyeOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { useWishlist, useRemoveFromWishlist, useClearWishlist } from '../hooks/useWishlist';
import { useCartStore } from '../store/cartStore';
import { SEO } from '../components/SEO';
import type { WishlistItem } from '../types';

const { Title, Text, Paragraph } = Typography;

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: wishlist, isLoading, error } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const clearWishlist = useClearWishlist();
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (item: WishlistItem) => {
    addItem(item.product, 1);
    message.success('Đã thêm vào giỏ hàng!');
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist.mutate(productId);
  };

  const handleClearAll = () => {
    clearWishlist.mutate();
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
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

  if (error) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải danh sách yêu thích. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Danh sách yêu thích - E-Shop"
        description="Quản lý và xem lại các sản phẩm yêu thích của bạn"
      />
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 200px)' }}>
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
              title: <><HeartOutlined /> Danh sách yêu thích</>
            }
          ]}
        />

        <Card>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <Title level={2}>
                <HeartOutlined /> Danh sách yêu thích
              </Title>
              <Paragraph type="secondary">
                {wishlist && wishlist.length > 0 
                  ? `Bạn có ${wishlist.length} sản phẩm yêu thích`
                  : 'Chưa có sản phẩm yêu thích nào'
                }
              </Paragraph>
            </div>
            
            {wishlist && wishlist.length > 0 && (
              <Popconfirm
                title="Xóa tất cả sản phẩm yêu thích"
                description="Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?"
                onConfirm={handleClearAll}
                okText="Xóa tất cả"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button 
                  icon={<ClearOutlined />} 
                  loading={clearWishlist.isPending}
                  danger
                >
                  Xóa tất cả
                </Button>
              </Popconfirm>
            )}
          </div>

          {!wishlist || wishlist.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Danh sách yêu thích trống"
              style={{ margin: '60px 0' }}
            >
              <Link to="/products">
                <Button type="primary" size="large">
                  Khám phá sản phẩm
                </Button>
              </Link>
            </Empty>
          ) : (
            <Row gutter={[24, 24]}>
              {wishlist.map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                        <Image
                          alt={item.product.name}
                          src={item.product.images[0]}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          preview={false}
                          onClick={() => handleViewProduct(item.product.id)}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                        />
                        
                        {/* Remove button overlay */}
                        <Popconfirm
                          title="Xóa khỏi yêu thích"
                          description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?"
                          onConfirm={() => handleRemove(item.product.id)}
                          okText="Xóa"
                          cancelText="Hủy"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            loading={removeFromWishlist.isPending}
                          />
                        </Popconfirm>

                        {/* Discount badge */}
                        {item.product.discount && item.product.discount > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            -{item.product.discount}%
                          </div>
                        )}
                      </div>
                    }
                    actions={[
                      <Button
                        key="view"
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewProduct(item.product.id)}
                      >
                        Xem
                      </Button>,
                      <Button
                        key="cart"
                        type="text"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => handleAddToCart(item)}
                      >
                        Thêm vào giỏ
                      </Button>
                    ]}
                    bodyStyle={{ padding: '16px' }}
                  >
                    <div style={{ minHeight: '120px' }}>
                      <Title 
                        level={5} 
                        ellipsis={{ rows: 2 }}
                        style={{ marginBottom: '8px', cursor: 'pointer' }}
                        onClick={() => handleViewProduct(item.product.id)}
                      >
                        {item.product.name}
                      </Title>
                      
                      <div style={{ marginBottom: '8px' }}>
                        <Rate 
                          disabled 
                          defaultValue={item.product.rating} 
                          style={{ fontSize: '14px' }}
                        />
                        <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
                          ({item.product.reviewCount})
                        </Text>
                      </div>

                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Text strong style={{ color: '#ff4d4f', fontSize: '16px' }}>
                            {formatPrice(item.product.price)}
                          </Text>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <Text 
                              delete 
                              type="secondary" 
                              style={{ fontSize: '14px' }}
                            >
                              {formatPrice(item.product.originalPrice)}
                            </Text>
                          )}
                        </div>
                        
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Đã thêm: {new Intl.DateTimeFormat('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }).format(item.addedAt)}
                        </Text>
                      </Space>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>
      </div>
    </>
  );
};
