
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Layout, Typography } from 'antd';

import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';


import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';

const { Content, Footer } = Layout;
const { Text } = Typography;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Content style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/products" element={<ProductsPage />} />
                
                <Route path="/products/:id" element={<ProductDetailPage />} />
                
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
              </Routes>
            </Content>
            
            <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: 'white' }}>
              <div className="container" style={{ padding: '32px 0' }}>
                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <h3 style={{ color: 'white', marginBottom: '16px' }}>E-Shop</h3>
                    <p style={{ color: '#bfbfbf' }}>
                      Cửa hàng trực tuyến uy tín với hàng ngàn sản phẩm chất lượng cao.
                    </p>
                  </div>
                  
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '16px' }}>Về chúng tôi</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <a href="/about" style={{ color: '#bfbfbf' }}>Giới thiệu</a>
                      <a href="/contact" style={{ color: '#bfbfbf' }}>Liên hệ</a>
                      <a href="/careers" style={{ color: '#bfbfbf' }}>Tuyển dụng</a>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '16px' }}>Chính sách</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <a href="/terms" style={{ color: '#bfbfbf' }}>Điều khoản dịch vụ</a>
                      <a href="/privacy" style={{ color: '#bfbfbf' }}>Chính sách bảo mật</a>
                      <a href="/return" style={{ color: '#bfbfbf' }}>Chính sách đổi trả</a>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '16px' }}>Hỗ trợ</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <a href="/help" style={{ color: '#bfbfbf' }}>Trung tâm trợ giúp</a>
                      <a href="/shipping" style={{ color: '#bfbfbf' }}>Thông tin vận chuyển</a>
                      <a href="/payment" style={{ color: '#bfbfbf' }}>Phương thức thanh toán</a>
                    </div>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid #434343', marginTop: '32px', paddingTop: '24px' }}>
                  <Text style={{ color: '#bfbfbf' }}>
                    © 2025 E-Shop. Tất cả quyền được bảo lưu.
                  </Text>
                </div>
              </div>
            </Footer>
          </Layout>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
