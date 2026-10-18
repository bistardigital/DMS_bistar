export type Role = 'SUPER_ADMIN' | 'B2B_CLIENT';

export type ClientStatus = 'PENDING' | 'APPROVED' | 'SUSPENDED';

export type OrderStatus = 'RECEIVED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: string;
  phone: string;
  role: Role;
  shopName?: string;
  ownerName: string;
  status: ClientStatus;
  accessExpires?: string | null; // ISO string
  routeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryRoute {
  id: string;
  routeName: string;
  orderCutoffDay: string; // e.g. "Monday 6:00 PM"
  deliveryDay: string;    // e.g. "Tuesday"
  areaCode?: string;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  origin?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  brandId: string;
  categoryId: string;
  packUnit: string;      // e.g. "50s Pot", "Box of 100", "Carton of 24", "Strips of 10"
  genericName?: string;  // e.g. "Paracetamol BP 500mg", "Organic NPK 10-26-26"
  mrpPrice: number;      // Maximum Retail Price
  b2bPrice: number;      // Wholesale Price for approved B2B clients
  stock: number;
  minOrderQty: number;   // Minimum Order Quantity
  imageUrl?: string;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  routeId?: string | null;
  route?: DeliveryRoute;
  totalAmount: number;
  totalMrpAmount?: number;
  status: OrderStatus;
  items: OrderItem[];
  notes?: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PickListItem {
  productId: string;
  sku: string;
  productName: string;
  genericName?: string;
  packUnit: string;
  totalQuantity: number;
  ordersCount: number;
  destinations: {
    shopName: string;
    orderNumber: string;
    quantity: number;
  }[];
}
