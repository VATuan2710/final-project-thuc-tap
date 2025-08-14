import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Space, 
  Table, 
  Tag, 
  Button, 
  Empty,
  Spin,
  Alert,
  Image,
  Descriptions,
  Modal,
  Row,
  Col,
  Breadcrumb
} from 'antd';
import { 
  ShoppingOutlined, 
  EyeOutlined, 
  HomeOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useUserOrders } from '../hooks/useOrders';
import { SEO } from '../components/SEO';
import type { Order, OrderItem } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

export const OrdersPage: React.FC = () => {
  const { data: orders, isLoading, error } = useUserOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'processing';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'processing':
        return 'Đang xử lý';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Text strong>#{id.slice(-8)}</Text>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => (
        <Space>
          <CalendarOutlined />
          <Text>{formatDate(date)}</Text>
        </Space>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'items',
      key: 'items',
      render: (items: OrderItem[]) => (
        <div>
          <Text>{items.length} sản phẩm</Text>
          <div>
            {items.slice(0, 2).map((item, index) => (
              <Text key={index} type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                {item.product.name} (x{item.quantity})
              </Text>
            ))}
            {items.length > 2 && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                +{items.length - 2} sản phẩm khác
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <Text strong style={{ color: '#ff4d4f' }}>
          {formatPrice(total)}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus: string) => (
        <Tag color={getPaymentStatusColor(paymentStatus)}>
          {getPaymentStatusText(paymentStatus)}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, order: Order) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(order)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

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
          description="Không thể tải danh sách đơn hàng. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Đơn hàng của tôi - E-Shop"
        description="Quản lý và theo dõi đơn hàng của bạn"
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
              title: <><ShoppingOutlined /> Đơn hàng của tôi</>
            }
          ]}
        />

        <Card>
          <div style={{ marginBottom: '24px' }}>
            <Title level={2}>
              <ShoppingOutlined /> Đơn hàng của tôi
            </Title>
            <Paragraph type="secondary">
              Theo dõi và quản lý tất cả đơn hàng của bạn
            </Paragraph>
          </div>

          {!orders || orders.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Bạn chưa có đơn hàng nào"
              style={{ margin: '60px 0' }}
            >
              <Link to="/products">
                <Button type="primary" size="large">
                  Bắt đầu mua sắm
                </Button>
              </Link>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
              }}
              scroll={{ x: 800 }}
            />
          )}
        </Card>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <Modal
            title={`Chi tiết đơn hàng #${selectedOrder.id.slice(-8)}`}
            open={detailModalVisible}
            onCancel={() => setDetailModalVisible(false)}
            width={800}
            footer={[
              <Button key="close" onClick={() => setDetailModalVisible(false)}>
                Đóng
              </Button>
            ]}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Order Info */}
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Mã đơn hàng" span={2}>
                  <Text strong>#{selectedOrder.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">
                  {formatDate(selectedOrder.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thanh toán">
                  <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                    {getPaymentStatusText(selectedOrder.paymentStatus)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                  <Text strong style={{ color: '#ff4d4f' }}>
                    {formatPrice(selectedOrder.total)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              {/* Customer Info */}
              <div>
                <Title level={5}>
                  <UserOutlined /> Thông tin khách hàng
                </Title>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Họ tên">
                    {selectedOrder.customerInfo.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {selectedOrder.customerInfo.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {selectedOrder.customerInfo.phoneNumber}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              {/* Shipping Address */}
              <div>
                <Title level={5}>Địa chỉ giao hàng</Title>
                <Card size="small">
                  <Paragraph>
                    {selectedOrder.shippingAddress.street}<br/>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br/>
                    {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                  </Paragraph>
                </Card>
              </div>

              {/* Order Items */}
              <div>
                <Title level={5}>Sản phẩm đã đặt</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {selectedOrder.items.map(item => (
                    <Card key={item.id} size="small">
                      <Row gutter={16} align="middle">
                        <Col span={4}>
                          <Image
                            width={60}
                            height={60}
                            src={item.product.images[0]}
                            alt={item.product.name}
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                          />
                        </Col>
                        <Col span={12}>
                          <Text strong>{item.product.name}</Text>
                          <div>
                            <Text type="secondary">Số lượng: {item.quantity}</Text>
                          </div>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                          <Text strong style={{ color: '#1890ff' }}>
                            {formatPrice(item.price * item.quantity)}
                          </Text>
                          <div>
                            <Text type="secondary">{formatPrice(item.price)}/sp</Text>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
              </div>
            </Space>
          </Modal>
        )}
      </div>
    </>
  );
};
