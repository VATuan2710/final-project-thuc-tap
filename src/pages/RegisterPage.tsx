import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, Divider, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, MailOutlined } from '@ant-design/icons';
import { useRegister, useGoogleLogin, useFacebookLogin } from '../hooks/useAuth';
import type { RegisterForm } from '../types';

const { Title, Text } = Typography;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const googleLogin = useGoogleLogin();
  const facebookLogin = useFacebookLogin();

  const onFinish = async (values: RegisterForm) => {
    try {
      await register.mutateAsync(values);
      navigate('/');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin.mutateAsync();
      navigate('/');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await facebookLogin.mutateAsync();
      navigate('/');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f5f5', padding: '48px 16px' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2}>Tạo tài khoản mới</Title>
          <Text type="secondary">
            Hoặc{' '}
            <Link to="/login" style={{ color: '#1890ff' }}>
              đăng nhập vào tài khoản có sẵn
            </Link>
          </Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Tên hiển thị"
            name="displayName"
            rules={[
              { required: true, message: 'Vui lòng nhập tên hiển thị!' },
              { min: 2, message: 'Tên hiển thị phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="Nhập tên hiển thị"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
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

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập lại mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản!')),
              },
            ]}
          >
            <Checkbox>
              Tôi đồng ý với{' '}
              <Link to="/terms" style={{ color: '#1890ff' }}>
                Điều khoản dịch vụ
              </Link>{' '}
              và{' '}
              <Link to="/privacy" style={{ color: '#1890ff' }}>
                Chính sách bảo mật
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={register.isPending}
              size="large"
              style={{ width: '100%' }}
            >
              Tạo tài khoản
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
              Đăng ký với Google
            </Button>

            <Button
              type="default"
              icon={<FacebookOutlined />}
              onClick={handleFacebookLogin}
              loading={facebookLogin.isPending}
              size="large"
              style={{ width: '100%' }}
            >
              Đăng ký với Facebook
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}; 