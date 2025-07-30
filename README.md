# E-Shop - React TypeScript E-commerce Platform

Một nền tảng thương mại điện tử hoàn chỉnh được xây dựng với React, TypeScript, Firebase và Ant Design.

## 🚀 Tính năng

### ✅ Core Features
- **Authentication Module**: Đăng nhập/đăng ký với email và mật khẩu
- **Social Authentication**: Đăng nhập Google, Facebook
- **Router Module**: React Router DOM với protected routes
- **State Management**: Zustand cho quản lý trạng thái toàn cục
- **Form Management**: Ant Design Form với validation
- **Data Fetching**: TanStack Query cho data fetching và caching

### 🌟 Advanced Features
- **Smart Cart System**: 
  - Guest cart (tạm thời) khi chưa đăng nhập
  - User cart (vĩnh viễn) lưu trong Firebase khi đã đăng nhập
  - Tự động sync cart khi đăng nhập/đăng xuất
- **Product Management**: 
  - Hiển thị danh sách sản phẩm với filtering
  - Trang chi tiết sản phẩm
  - Thêm vào giỏ hàng
- **Cart & Checkout**: 
  - Quản lý giỏ hàng với số lượng
  - Trang checkout
- **Responsive Design**: Giao diện responsive với Ant Design
- **SEO Optimization**: Meta tags, structured data
- **Firebase Integration**: Auth, Firestore, Storage, Hosting

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Framework**: Ant Design
- **State Management**: Zustand với persistence
- **Forms**: Ant Design Form
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **Icons**: Ant Design Icons
- **Notifications**: Ant Design message/notification
- **SEO**: React Helmet Async

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- Firebase CLI
- Git

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd final-project
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Firebase

#### Bước 1: Tạo Firebase project
1. Truy cập [Firebase Console](https://console.firebase.google.com)
2. Tạo project mới
3. Kích hoạt Authentication, Firestore Database, và Storage

#### Bước 2: Cấu hình Authentication
1. Vào Authentication > Sign-in method
2. Kích hoạt Email/Password
3. Kích hoạt Google (optional)
4. Kích hoạt Facebook (optional)

#### Bước 3: Cấu hình Firestore
1. Tạo Firestore Database
2. Chọn "Start in test mode" (rules sẽ được cập nhật sau)

#### Bước 4: Lấy config keys
1. Vào Project Settings > General
2. Scroll xuống "Your apps" 
3. Tạo web app mới
4. Copy config object

### 4. Cấu hình environment variables

Tạo file `.env.local` trong thư mục root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 🏗 Cấu trúc dự án

```
src/
├── components/          # Shared components
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── SEO.tsx
│   └── CartStatus.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   └── CheckoutPage.tsx
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useProducts.ts
│   └── useCartSync.ts
├── services/           # API services
│   ├── firebase.ts
│   ├── authService.ts
│   ├── productService.ts
│   └── cartService.ts
├── store/              # Zustand stores
│   ├── authStore.ts
│   └── cartStore.ts
├── types/              # TypeScript types
│   └── index.ts
└── utils/              # Utility functions
```

## 🚀 Deployment

### Build cho production
```bash
npm run build
```

### Deploy lên Firebase Hosting

1. Cài đặt Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Đăng nhập Firebase:
```bash
firebase login
```

3. Khởi tạo Firebase:
```bash
firebase init
```
- Chọn Hosting, Firestore, Storage
- Chọn existing project
- Public directory: `dist`
- Configure as SPA: Yes

4. Deploy:
```bash
firebase deploy
```

### Deploy Security Rules
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 📊 Features Implementation

### Authentication
- [x] Email/Password authentication
- [x] Google OAuth
- [x] Facebook OAuth  
- [x] Protected routes
- [x] Persistent login state

### Smart Cart System
- [x] Guest cart (tạm thời) khi chưa đăng nhập
- [x] User cart (vĩnh viễn) lưu trong Firebase
- [x] Tự động sync cart khi đăng nhập/đăng xuất
- [x] Cart persistence trong Firebase collection `carts`
- [x] Merge logic thông minh (không merge nếu user đã có cart)

### Product Management
- [x] Hiển thị danh sách sản phẩm
- [x] Trang chi tiết sản phẩm
- [x] Thêm vào giỏ hàng
- [x] Product filtering và search

### Cart & Checkout
- [x] Quản lý giỏ hàng với số lượng
- [x] Thêm/xóa/cập nhật sản phẩm
- [x] Tính tổng tiền
- [x] Trang checkout

### State Management
- [x] Zustand stores
- [x] Cart persistence trong Firebase
- [x] User state management
- [x] Real-time cart sync

### UI/UX
- [x] Responsive design với Ant Design
- [x] Loading states
- [x] Toast notifications
- [x] Modern UI components

### SEO
- [x] Meta tags
- [x] Structured data
- [x] OpenGraph tags
- [x] Canonical URLs

## 🔧 Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build cho production  
npm run preview      # Preview production build
npm run lint         # Chạy ESLint
```

## 📝 TODO

- [ ] Admin panel
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Order management
- [ ] User profile management
- [ ] Product reviews và ratings
- [ ] Wishlist functionality
- [ ] Advanced search và filtering
- [ ] Inventory management

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Your Name - vatbgct@gmail.com

