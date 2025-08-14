import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Input,
  Badge,
  Avatar,
  Dropdown,
  Space,
  Typography,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
  SearchOutlined,
  LogoutOutlined,
  UserAddOutlined,
  ProfileOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useAuth, useLogout } from "../hooks/useAuth";
import { useCartSync } from "../hooks/useCartSync";

const { Header } = Layout;
const { Search } = Input;
const { Text } = Typography;

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Sync cart with user authentication
  const { itemCount } = useCartSync();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    logout.mutate();
    setIsMenuOpen(false);
  };

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value.trim())}`);
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: <Link to="/profile">Tài khoản</Link>,
    },
    {
      key: "orders",
      icon: <ShoppingOutlined />,
      label: <Link to="/orders">Đơn hàng</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  const mobileMenuItems: any[] = [
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: <Link to="/products">Sản phẩm</Link>,
    },
    {
      key: "cart",
      icon: <ShoppingCartOutlined />,
      label: (
        <Space>
          <Link to="/cart">Giỏ hàng</Link>
          {itemCount > 0 && <Badge count={itemCount} size="small" />}
        </Space>
      ),
    },
  ];

  if (isAuthenticated) {
    mobileMenuItems.push(
      {
        key: "profile",
        icon: <ProfileOutlined />,
        label: <Link to="/profile">Tài khoản</Link>,
      },
      {
        key: "orders",
        icon: <ShoppingOutlined />,
        label: <Link to="/orders">Đơn hàng</Link>,
      },
              {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
          onClick: handleLogout,
        }
    );
  } else {
    mobileMenuItems.push(
      {
        key: "login",
        icon: <UserOutlined />,
        label: <Link to="/login">Đăng nhập</Link>,
      },
      {
        key: "register",
        icon: <UserAddOutlined />,
        label: <Link to="/register">Đăng ký</Link>,
      }
    );
  }

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        padding: "0 16px",
        height: "64px",
        lineHeight: "64px",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", height: "100%" }}
      >
        {/* Logo */}
        <div style={{ marginRight: "32px" }}>
          <Link to="/">
            <Text strong style={{ fontSize: "24px", color: "#1890ff" }}>
              E-Shop
            </Text>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        {!isMobile && (
          <div
            style={{
              flex: 1,
              maxWidth: "500px",
              marginRight: "32px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </div>
        )}

        {/* Desktop Menu */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link to="/products">
              <Button type="text" style={{ color: "#666" }}>
                Sản phẩm
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Badge count={itemCount} size="small">
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined />}
                  style={{ color: "#666" }}
                />
              </Badge>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button type="text" style={{ padding: "0 8px" }}>
                  <Space>
                    {user?.photoURL ? (
                      <Avatar src={user.photoURL} size="small" />
                    ) : (
                      <Avatar icon={<UserOutlined />} size="small" />
                    )}
                    {!isMobile && (
                      <Text style={{ color: "#666" }}>
                        {user?.displayName || user?.email}
                      </Text>
                    )}
                  </Space>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Link to="/login">
                  <Button type="text" style={{ color: "#666" }}>
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button type="primary">Đăng ký</Button>
                </Link>
              </Space>
            )}
          </div>
        )}

        {/* Mobile menu button */}
        {isMobile && (
          <div>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div
          style={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderTop: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            padding: "16px",
          }}
        >
          {/* Mobile Search */}
          <div style={{ marginBottom: "16px" }}>
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
            />
          </div>

          <Menu
            mode="vertical"
            items={mobileMenuItems}
            style={{ border: "none" }}
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
      )}
    </Header>
  );
};
