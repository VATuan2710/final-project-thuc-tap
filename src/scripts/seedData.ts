import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// Sample categories
const categories = [
  {
    id: 'electronics',
    name: 'Điện tử',
    description: 'Thiết bị điện tử, máy tính, điện thoại',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop'
  },
  {
    id: 'fashion',
    name: 'Thời trang',
    description: 'Quần áo, giày dép, phụ kiện',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop'
  },
  {
    id: 'home',
    name: 'Gia dụng',
    description: 'Đồ gia dụng, nội thất, trang trí',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
  },
  {
    id: 'books',
    name: 'Sách',
    description: 'Sách văn học, giáo dục, tham khảo',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
  }
];

// Sample products
const products = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'Điện thoại thông minh cao cấp với chip A17 Pro, camera 48MP và màn hình Super Retina XDR.',
    price: 29990000,
    originalPrice: 32990000,
    discount: 9,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop'
    ],
    stock: 50,
    rating: 4.8,
    reviewCount: 245,
    tags: ['smartphone', 'apple', 'ios', 'camera']
  },
  {
    name: 'MacBook Pro M3',
    description: 'Laptop chuyên nghiệp với chip M3, màn hình Liquid Retina XDR và thời lượng pin 18 giờ.',
    price: 52990000,
    originalPrice: 54990000,
    discount: 4,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop'
    ],
    stock: 25,
    rating: 4.9,
    reviewCount: 156,
    tags: ['laptop', 'apple', 'macbook', 'professional']
  },
  {
    name: 'Áo Hoodie Premium',
    description: 'Áo hoodie cotton cao cấp, thiết kế trẻ trung, phù hợp cho mọi lứa tuổi.',
    price: 599000,
    originalPrice: 799000,
    discount: 25,
    category: 'fashion',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop'
    ],
    stock: 100,
    rating: 4.5,
    reviewCount: 89,
    tags: ['hoodie', 'cotton', 'casual', 'unisex']
  },
  {
    name: 'Giày Sneaker Air Max',
    description: 'Giày thể thao phong cách với công nghệ đệm khí Air Max, thoải mái cả ngày.',
    price: 2890000,
    originalPrice: 3290000,
    discount: 12,
    category: 'fashion',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop'
    ],
    stock: 75,
    rating: 4.7,
    reviewCount: 203,
    tags: ['sneaker', 'airmax', 'sport', 'comfortable']
  },
  {
    name: 'Nồi cơm điện Zojirushi',
    description: 'Nồi cơm điện cao cấp với công nghệ IH, nấu cơm ngon và tiết kiệm điện.',
    price: 4590000,
    originalPrice: 4990000,
    discount: 8,
    category: 'home',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1585515656643-d1d8b57a2586?w=500&h=500&fit=crop'
    ],
    stock: 30,
    rating: 4.6,
    reviewCount: 127,
    tags: ['rice-cooker', 'kitchen', 'appliance', 'japanese']
  },
  {
    name: 'Bộ Chăn Ga Cotton Cao Cấp',
    description: 'Bộ chăn ga cotton 100% cao cấp, mềm mại và thoáng khí cho giấc ngủ ngon.',
    price: 1290000,
    originalPrice: 1590000,
    discount: 19,
    category: 'home',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&h=500&fit=crop'
    ],
    stock: 60,
    rating: 4.4,
    reviewCount: 78,
    tags: ['bedding', 'cotton', 'bedroom', 'comfortable']
  },
  {
    name: 'Sách "Đắc Nhân Tâm"',
    description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử của Dale Carnegie.',
    price: 89000,
    originalPrice: 120000,
    discount: 26,
    category: 'books',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop'
    ],
    stock: 200,
    rating: 4.8,
    reviewCount: 342,
    tags: ['self-help', 'communication', 'classic', 'bestseller']
  },
  {
    name: 'Sách "Nhà Giả Kim"',
    description: 'Tiểu thuyết triết lý nổi tiếng của Paulo Coelho về hành trình tìm kiếm ước mơ.',
    price: 79000,
    originalPrice: 99000,
    discount: 20,
    category: 'books',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=500&h=500&fit=crop'
    ],
    stock: 150,
    rating: 4.7,
    reviewCount: 268,
    tags: ['fiction', 'philosophy', 'bestseller', 'inspiration']
  }
];

export async function seedData() {
  try {
    console.log('Starting to seed data...');

    // Add categories
    console.log('Adding categories...');
    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), {
        name: category.name,
        description: category.description,
        image: category.image
      });
      console.log(`Added category: ${category.name}`);
    }

    // Add products
    console.log('Adding products...');
    for (const product of products) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Added product: ${product.name}`);
    }

    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Export the function to be used by components 