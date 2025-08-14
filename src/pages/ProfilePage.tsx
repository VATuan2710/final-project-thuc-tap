import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Row,
  Col,
  Space,
  Typography,
  Tabs,
  Modal,
  Spin,
} from 'antd';
import {
  UserOutlined,
  CameraOutlined,
  SaveOutlined,
  LockOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useUpdateProfile, useChangePassword, useUploadAvatar } from '../hooks/useProfile';
import { SEO } from '../components/SEO';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ProfileFormData {
  displayName: string;
  email: string;
  phoneNumber?: string;
}

interface AddressFormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const uploadAvatar = useUploadAvatar();

  const [profileForm] = Form.useForm<ProfileFormData>();
  const [addressForm] = Form.useForm<AddressFormData>();
  const [passwordForm] = Form.useForm<PasswordFormData>();

  // Initialize forms with user data
  React.useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
      });

      if (user.address) {
        addressForm.setFieldsValue(user.address);
      }
    }
  }, [user, profileForm, addressForm]);

  const handleProfileSubmit = async (values: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        displayName: values.displayName,
        phoneNumber: values.phoneNumber,
      });
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error('Cập nhật thông tin thất bại!');
    }
  };

  const handleAddressSubmit = async (values: AddressFormData) => {
    try {
      await updateProfile.mutateAsync({
        address: values,
      });
      message.success('Cập nhật địa chỉ thành công!');
    } catch (error) {
      message.error('Cập nhật địa chỉ thất bại!');
    }
  };

  const handlePasswordSubmit = async (values: PasswordFormData) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Đổi mật khẩu thành công!');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error('Đổi mật khẩu thất bại!');
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatar.mutateAsync(file);
      message.success('Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      message.error('Cập nhật ảnh đại diện thất bại!');
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ hỗ trợ file JPG/PNG!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
      return false;
    }
    
    handleAvatarUpload(file);
    return false; // Prevent automatic upload
  };

  if (!user) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Trang cá nhân" 
        description="Quản lý thông tin cá nhân, địa chỉ giao hàng và bảo mật tài khoản" 
      />
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 200px)' }}>
        <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Row gutter={[24, 24]}>
          {/* Avatar Section */}
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="large">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  src={user.photoURL}
                  icon={<UserOutlined />}
                />
                <Upload
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  accept="image/*"
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CameraOutlined />}
                    size="small"
                    loading={uploadAvatar.isPending}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                    }}
                  />
                </Upload>
              </div>
              <div>
                <Title level={4}>{user.displayName}</Title>
                <Text type="secondary">{user.email}</Text>
              </div>
            </Space>
          </Col>

          {/* Content Section */}
          <Col xs={24} md={16}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Thông tin cá nhân" key="profile">
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileSubmit}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Họ và tên"
                        name="displayName"
                        rules={[
                          { required: true, message: 'Vui lòng nhập họ và tên!' }
                        ]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Email"
                        name="email"
                      >
                        <Input disabled prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                      { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại (VD: 0123456789)" />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={updateProfile.isPending}
                      >
                        Lưu thay đổi
                      </Button>
                      <Button
                        icon={<LockOutlined />}
                        onClick={() => setPasswordModalVisible(true)}
                      >
                        Đổi mật khẩu
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane tab="Địa chỉ giao hàng" key="address">
                <Form
                  form={addressForm}
                  layout="vertical"
                  onFinish={handleAddressSubmit}
                >
                  <Form.Item
                    label="Địa chỉ"
                    name="street"
                    rules={[
                      { required: true, message: 'Vui lòng nhập địa chỉ!' }
                    ]}
                  >
                    <Input prefix={<EnvironmentOutlined />} placeholder="Số nhà, tên đường" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Thành phố"
                        name="city"
                        rules={[
                          { required: true, message: 'Vui lòng nhập thành phố!' }
                        ]}
                      >
                        <Input placeholder="Thành phố" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Tỉnh/Thành"
                        name="state"
                        rules={[
                          { required: true, message: 'Vui lòng nhập tỉnh/thành!' }
                        ]}
                      >
                        <Input placeholder="Tỉnh/Thành" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Mã bưu điện"
                        name="zipCode"
                        rules={[
                          { required: true, message: 'Vui lòng nhập mã bưu điện!' }
                        ]}
                      >
                        <Input placeholder="Mã bưu điện" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Quốc gia"
                        name="country"
                        rules={[
                          { required: true, message: 'Vui lòng nhập quốc gia!' }
                        ]}
                      >
                        <Input placeholder="Quốc gia" defaultValue="Việt Nam" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={updateProfile.isPending}
                    >
                      Lưu địa chỉ
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Card>

      {/* Change Password Modal */}
      <Modal
        title="Đổi mật khẩu"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={changePassword.isPending}
              >
                Đổi mật khẩu
              </Button>
              <Button
                onClick={() => {
                  setPasswordModalVisible(false);
                  passwordForm.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </>
  );
};
