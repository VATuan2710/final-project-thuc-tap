import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Input, 
  Select, 
  Button, 
  Rate, 
  Typography, 
  Space, 
  Pagination, 
  Spin, 
  Empty,
  Tag,
  Image,
  Slider,
  Collapse,
  Checkbox
} from 'antd';
import { 
  SearchOutlined, 
  ShoppingCartOutlined, 
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined 
} from '@ant-design/icons';
import { useCategories } from '../hooks/useProducts';
import { useSimpleProducts } from '../hooks/useSimpleProducts';
import { useCartStore } from '../store/cartStore';
import { SEO } from '../components/SEO';
import type { ProductFilterForm } from '../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'name';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<ProductFilterForm>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: (searchParams.get('sort') as any) || 'newest'
  });

  const addItem = useCartStore((state) => state.addItem);
  const { data: categoriesData } = useCategories();
  const { data: products, isLoading, error } = useSimpleProducts();

  // Use products directly
  const allProducts = useMemo(() => {
    return products || [];
  }, [products]);

  const handleFilterChange = (key: keyof ProductFilterForm, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);

    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
  };

  const handleSearch = (value: string) => {
    handleFilterChange('search', value);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculatePaginatedProducts = () => {
    const itemsPerPage = 12;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allProducts.slice(startIndex, endIndex).filter(product => product && product.id);
  };

  const paginatedProducts = calculatePaginatedProducts();

  const ProductCard = ({ product }: { product: any }) => {
    if (viewMode === 'list') {
      return (
        <Card 
          hoverable
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16} align="middle">
            <Col xs={24} sm={6}>
              <Link to={`/products/${product.id}`}>
                <Image
                  src={product.images[0] || '/placeholder-image.jpg'}
                  alt={product.name}
                  width="100%"
                  height={150}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
              </Link>
            </Col>
            <Col xs={24} sm={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Link to={`/products/${product.id}`}>
                  <Title level={4} style={{ margin: 0, color: 'inherit' }}>
                    {product.name}
                  </Title>
                </Link>
                <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                  {product.description}
                </Paragraph>
                <div>
                  <Rate disabled value={product.rating} style={{ fontSize: '14px' }} />
                  <Text type="secondary" style={{ marginLeft: '8px' }}>
                    ({product.reviewCount} đánh giá)
                  </Text>
                </div>
                <Space wrap>
                  {product.tags?.slice(0, 3).map((tag: string) => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </Space>
              </Space>
            </Col>
            <Col xs={24} sm={6}>
              <Space direction="vertical" style={{ width: '100%', textAlign: 'right' }}>
                <div>
                  <Text strong style={{ color: '#1890ff', fontSize: '18px' }}>
                    {formatPrice(product.price)}
                  </Text>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div>
                      <Text delete type="secondary">
                        {formatPrice(product.originalPrice)}
                      </Text>
                      <Tag color="red" style={{ marginLeft: '8px' }}>
                        -{product.discount}%
                      </Tag>
                    </div>
                  )}
                </div>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleAddToCart(product)}
                  block
                >
                  Thêm vào giỏ
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      );
    }

    return (
      <Card
        hoverable
        cover={
          <Link to={`/products/${product.id}`}>
            <Image
              alt={product.name}
              src={product.images[0] || '/placeholder-image.jpg'}
              height={250}
              style={{ objectFit: 'cover' }}
            />
          </Link>
        }
        actions={[
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => handleAddToCart(product)}
            style={{ width: '90%' }}
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
              <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                {product.description}
              </Paragraph>
              <div>
                <Rate disabled value={product.rating} style={{ fontSize: '12px' }} />
                <Text type="secondary" style={{ marginLeft: '4px', fontSize: '12px' }}>
                  ({product.reviewCount})
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                    {formatPrice(product.price)}
                  </Text>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div>
                      <Text delete type="secondary" style={{ fontSize: '12px' }}>
                        {formatPrice(product.originalPrice)}
                      </Text>
                      <Tag color="red" style={{ marginLeft: '4px' }}>
                        -{product.discount}%
                      </Tag>
                    </div>
                  )}
                </div>
              </div>
            </Space>
          }
        />
      </Card>
    );
  };

  return (
    <>
      <SEO 
        title="Sản phẩm - E-Shop"
        description="Khám phá hàng ngàn sản phẩm chất lượng cao với giá cả hợp lý tại E-Shop"
        keywords="sản phẩm, mua sắm, điện tử, thời trang, gia dụng, sách"
      />
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '24px 0' }}>
        <div className="container">
          <Row gutter={24}>
            {/* Sidebar Filters */}
            <Col xs={24} lg={6}>
              <Card title={<><FilterOutlined /> Bộ lọc</>} style={{ marginBottom: '24px' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {/* Search */}
                  <div>
                    <Text strong>Tìm kiếm</Text>
                    <Input.Search
                      placeholder="Tên sản phẩm..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      onSearch={handleSearch}
                      style={{ marginTop: '8px' }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Text strong>Danh mục</Text>
                    <Select
                      placeholder="Chọn danh mục"
                      value={filters.category}
                      onChange={(value) => handleFilterChange('category', value)}
                      style={{ width: '100%', marginTop: '8px' }}
                      allowClear
                    >
                      {categoriesData && categoriesData.length > 0 && categoriesData.map(category => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Text strong>Khoảng giá</Text>
                    <Slider
                      range
                      min={0}
                      max={50000000}
                      step={100000}
                      value={[filters.minPrice || 0, filters.maxPrice || 50000000]}
                      onChange={([min, max]) => {
                        handleFilterChange('minPrice', min);
                        handleFilterChange('maxPrice', max);
                      }}
                      tooltip={{
                        formatter: (value) => formatPrice(value || 0)
                      }}
                      style={{ marginTop: '8px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <Text type="secondary">{formatPrice(filters.minPrice || 0)}</Text>
                      <Text type="secondary">{formatPrice(filters.maxPrice || 50000000)}</Text>
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <Text strong>Sắp xếp</Text>
                    <Select
                      value={filters.sortBy}
                      onChange={(value) => handleFilterChange('sortBy', value)}
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      <Option value="newest">Mới nhất</Option>
                      <Option value="price-asc">Giá thấp đến cao</Option>
                      <Option value="price-desc">Giá cao đến thấp</Option>
                      <Option value="rating">Đánh giá cao nhất</Option>
                      <Option value="name">Tên A-Z</Option>
                    </Select>
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Main Content */}
            <Col xs={24} lg={18}>
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px',
                backgroundColor: 'white',
                padding: '16px 24px',
                borderRadius: '8px'
              }}>
                <div>
                  <Title level={2} style={{ margin: 0 }}>
                    Sản phẩm
                  </Title>
                  <Text type="secondary">
                    Tìm thấy {allProducts.length} sản phẩm
                  </Text>
                </div>
                <Space.Compact>
                  <Button
                    type={viewMode === 'grid' ? 'primary' : 'default'}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode('grid')}
                  />
                  <Button
                    type={viewMode === 'list' ? 'primary' : 'default'}
                    icon={<BarsOutlined />}
                    onClick={() => setViewMode('list')}
                  />
                </Space.Compact>
              </div>

              {/* Products Grid/List */}
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <Spin size="large" />
                </div>
              ) : paginatedProducts.length === 0 ? (
                <Empty 
                  description="Không tìm thấy sản phẩm nào"
                  style={{ padding: '64px 0' }}
                />
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <Row gutter={[16, 16]}>
                      {paginatedProducts.map((product) => (
                        <Col xs={24} sm={12} lg={8} key={product.id}>
                          <ProductCard product={product} />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div>
                      {paginatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <Pagination
                      current={currentPage}
                      total={allProducts.length}
                      pageSize={12}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) => 
                        `${range[0]}-${range[1]} của ${total} sản phẩm`
                      }
                    />
                  </div>

                  {/* Load More Button - Removed since we're using simple products */}
                  {/* {hasNextPage && (
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                      <Button 
                        type="dashed" 
                        size="large"
                        loading={isFetchingNextPage}
                        onClick={() => fetchNextPage()}
                      >
                        Tải thêm sản phẩm
                      </Button>
                    </div>
                  )} */}
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}; 