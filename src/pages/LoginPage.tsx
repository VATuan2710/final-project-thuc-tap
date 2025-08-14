import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, Divider, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useLogin, useGoogleLogin, useFacebookLogin } from '../hooks/useAuth';
import type { LoginForm } from '../types';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const googleLogin = useGoogleLogin();
  const facebookLogin = useFacebookLogin();

  // Kiểm tra URL params và sessionStorage để redirect
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get('message');
  const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin') || '/';

  const from = location.state?.from?.pathname || redirectAfterLogin;

  const onFinish = async (values: LoginForm) => {
    try {
      await login.mutateAsync(values);
      // Xóa redirect URL sau khi login thành công
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin.mutateAsync();
      // Xóa redirect URL sau khi login thành công
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await facebookLogin.mutateAsync();
      // Xóa redirect URL sau khi login thành công
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f5f5', padding: '48px 16px' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2}>Đăng nhập vào tài khoản</Title>
          {message === 'checkout' && (
            <div style={{ marginBottom: '16px' }}>
              <Text type="warning" strong>
                Vui lòng đăng nhập để tiếp tục thanh toán
              </Text>
            </div>
          )}
          <Text type="secondary">
            Hoặc{' '}
            <Link to="/register" style={{ color: '#1890ff' }}>
              tạo tài khoản mới
            </Link>
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="Nhập email của bạn"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: '#1890ff' }}>
                Quên mật khẩu?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={login.isPending}
              size="large"
              style={{ width: '100%' }}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider>Hoặc</Divider>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              type="default"
              icon={<GoogleOutlined />}
              onClick={handleGoogleLogin}
              loading={googleLogin.isPending}
              size="large"
              style={{ width: '100%' }}
            >
              Đăng nhập với Google
            </Button>

            <Button
              type="default"
              icon={<FacebookOutlined />}
              onClick={handleFacebookLogin}
              loading={facebookLogin.isPending}
              size="large"
              style={{ width: '100%' }}
            >
              Đăng nhập với Facebook
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}; 