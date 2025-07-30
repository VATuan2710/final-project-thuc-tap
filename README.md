# E-Shop - React TypeScript E-commerce Platform

Một nền tảng thương mại điện tử hoàn chỉnh được xây dựng với React, TypeScript, Firebase và Tailwind CSS.

## 🚀 Tính năng

### ✅ Required Features
- **Authentication Module**: Đăng nhập/đăng ký với email và mật khẩu
- **Router Module**: React Router DOM với protected routes
- **State Management**: Zustand cho quản lý trạng thái toàn cục
- **Form Management**: React Hook Form với validation (Zod)
- **Side Effects**: React Query cho data fetching và caching

### 🌟 Advanced Features
- **Social Authentication**: Đăng nhập Google, Facebook
- **React Query**: Data caching và synchronization
- **Tailwind CSS**: Styling hiện đại và responsive
- **SEO Optimization**: Meta tags, structured data
- **Firebase Hosting**: Deployment tự động

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Headless UI
- **State Management**: Zustand với persistence
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **Icons**: Heroicons, Lucide React
- **Notifications**: React Hot Toast
- **SEO**: React Helmet Async

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- Firebase CLI
- Git

## 🚀 Cài đặt và chạy

### 1. Clone repository
\`\`\`bash
git clone <repository-url>
cd final-project
\`\`\`

### 2. Cài đặt dependencies
\`\`\`bash
npm install
\`\`\`

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

Tạo file \`.env.local\` trong thư mục root:

\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
\`\`\`

### 5. Chạy development server
\`\`\`bash
npm run dev
\`\`\`

Ứng dụng sẽ chạy tại \`http://localhost:5173\`

## 🏗 Cấu trúc dự án

\`\`\`
src/
├── components/          # Shared components
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── SEO.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   └── useProducts.ts
├── services/           # API services
│   ├── firebase.ts
│   ├── authService.ts
│   └── productService.ts
├── store/              # Zustand stores
│   ├── authStore.ts
│   └── cartStore.ts
├── types/              # TypeScript types
│   └── index.ts
└── utils/              # Utility functions
\`\`\`

## 🚀 Deployment

### Build cho production
\`\`\`bash
npm run build
\`\`\`

### Deploy lên Firebase Hosting

1. Cài đặt Firebase CLI:
\`\`\`bash
npm install -g firebase-tools
\`\`\`

2. Đăng nhập Firebase:
\`\`\`bash
firebase login
\`\`\`

3. Khởi tạo Firebase:
\`\`\`bash
firebase init
\`\`\`
- Chọn Hosting, Firestore, Storage
- Chọn existing project
- Public directory: \`dist\`
- Configure as SPA: Yes

4. Deploy:
\`\`\`bash
firebase deploy
\`\`\`

### Deploy Security Rules
\`\`\`bash
firebase deploy --only firestore:rules
firebase deploy --only storage
\`\`\`

## 📊 Features Implementation

### Authentication
- [x] Email/Password authentication
- [x] Google OAuth
- [x] Facebook OAuth  
- [x] Protected routes
- [x] Persistent login state

### State Management
- [x] Zustand stores
- [x] Cart persistence
- [x] User state management

### Forms & Validation
- [x] React Hook Form
- [x] Zod schema validation
- [x] Dynamic form fields
- [x] Error handling

### Data Management
- [x] React Query setup
- [x] Firebase Firestore integration
- [x] Optimistic updates
- [x] Error boundaries

### UI/UX
- [x] Responsive design
- [x] Tailwind CSS
- [x] Loading states
- [x] Toast notifications
- [x] Dark mode ready

### SEO
- [x] Meta tags
- [x] Structured data
- [x] OpenGraph tags
- [x] Canonical URLs

## 🔧 Scripts

\`\`\`bash
npm run dev          # Chạy development server
npm run build        # Build cho production  
npm run preview      # Preview production build
npm run lint         # Chạy ESLint
\`\`\`

## 📝 TODO

- [ ] Trang sản phẩm với filtering/sorting
- [ ] Trang chi tiết sản phẩm
- [ ] Giỏ hàng và checkout
- [ ] Quản lý đơn hàng
- [ ] Admin panel
- [ ] Payment integration
- [ ] Email notifications

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to branch (\`git push origin feature/AmazingFeature\`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See \`LICENSE\` for more information.

## 📞 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/final-project](https://github.com/yourusername/final-project)
