import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Order, OrderItem, Address, PaymentMethod } from '../types';

export interface CreateOrderData {
  userId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  customerInfo: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
}

// Create a new order
export async function createOrder(data: CreateOrderData): Promise<Order> {
  try {
    const orderData = {
      userId: data.userId,
      items: data.items,
      total: data.total,
      status: 'pending' as const,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'pending' as const,
      customerInfo: data.customerInfo,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'orders'), orderData);
    
    // Get the created order
    const orderDoc = await getDoc(docRef);
    const orderDataWithId = { 
      id: docRef.id, 
      ...orderDoc.data(),
      createdAt: orderDoc.data()?.createdAt?.toDate() || new Date(),
      updatedAt: orderDoc.data()?.updatedAt?.toDate() || new Date(),
    } as Order;

    return orderDataWithId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Không thể tạo đơn hàng');
  }
}

// Get orders for a specific user
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw new Error('Không thể lấy danh sách đơn hàng');
  }
}

// Get a specific order by ID
export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    
    if (!orderDoc.exists()) {
      return null;
    }
    
    const data = orderDoc.data();
    return {
      id: orderDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Order;
  } catch (error) {
    console.error('Error getting order:', error);
    throw new Error('Không thể lấy thông tin đơn hàng');
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Không thể cập nhật trạng thái đơn hàng');
  }
}

// Update payment status
export async function updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      paymentStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw new Error('Không thể cập nhật trạng thái thanh toán');
  }
}

// Simulate payment processing (for demo purposes)
export async function processPayment(orderId: string, _paymentMethod: PaymentMethod): Promise<{ success: boolean; transactionId?: string }> {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, randomly simulate success/failure
  const success = Math.random() > 0.1; // 90% success rate
  
  if (success) {
    // Update payment status to completed
    await updatePaymentStatus(orderId, 'completed');
    await updateOrderStatus(orderId, 'confirmed');
    
    return {
      success: true,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } else {
    // Update payment status to failed
    await updatePaymentStatus(orderId, 'failed');
    
    return {
      success: false
    };
  }
}
