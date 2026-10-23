export type Role = 'SUPER_ADMIN' | 'B2B_CLIENT';

export type ClientStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type BusinessSector = 'FMCG' | 'PHARMA' | 'AGRO' | 'MULTI';

export type PaymentMethod = 'ROUTE_COD' | 'CREDIT_LEDGER' | 'BKASH' | 'NAGAD' | 'ROCKET';

export type OrderStatus = 'NEW_ALARM' | 'CONFIRMED' | 'PACKED' | 'ON_ROUTE' | 'DELIVERED' | 'CANCELLED';

export interface ShopProfile {
  id: string;
  userId: string;
  phone: string;
  role: Role;
  shopName: string;
  ownerName: string;
  tradeLicenseNo?: string;
  businessSector: BusinessSector;
  routeId: string;
  routeName: string;
  status: ClientStatus;
  validityExpiryEpochMs?: number | null; // Milliseconds timestamp
  creditLimitBdt: number; // e.g. ৳50,000
  currentDueBdt: number;   // e.g. ৳12,500 (বাকি খাতা)
  createdAt: string;
  updatedAt: string;
}

// User alias for backwards compatibility
export type User = ShopProfile;

export interface MarketRoute {
  id: string;
  routeCode: string; // e.g. "RTE-101"
  routeName: string; // e.g. "Chawkbazar Wholesale Hub", "Mitford Pharma Zone"
  areaCoverage: string;
  deliveryDays: string; // e.g. "Sun, Tue, Thu" or "Tuesday (Weekly)"
  cutoffTime: string;   // e.g. "10:00 AM" or "Monday 06:00 PM"
  assignedVehicle: string;
  createdAt: string;
}

export type DeliveryRoute = MarketRoute;

export interface Brand {
  id: string;
  name: string;
  sector: BusinessSector;
  logoUrl?: string;
  origin?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  sector: BusinessSector;
  description?: string;
  iconName?: string;
  createdAt: string;
}

export interface B2BProduct {
  id: string;
  skuCode: string;
  name: string;
  brand: string;
  brandId: string;
  sector: BusinessSector;
  category: string;
  categoryId: string;
  packSize: string;      // e.g. "24x250ml Carton", "10x10 Blister Box", "25kg Woven Sack"
  packUnit: string;      // short alias e.g. "Carton", "Box", "Sack"
  genericName?: string;  // e.g. "Paracetamol BP 500mg", "Organic NPK 10-26-26"
  mrpBdt: number;        // Maximum Consumer Retail Price (৳)
  baseWholesaleBdt: number; // Tier 1 wholesale price (1-9 cartons) (৳)
  tier2MinQty: number;   // e.g. 10
  tier2PriceBdt: number; // Tier 2 wholesale price (10-29 cartons) (৳)
  tier3MinQty: number;   // e.g. 30
  tier3PriceBdt: number; // Tier 3 deep wholesale price (30+ cartons) (৳)
  minOrderQty: number;   // Minimum Order Quantity
  stockQty: number;      // Available Warehouse Stock
  imageUrl?: string;
  inStock: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;

  // Compatibility aliases
  sku?: string;
  mrpPrice?: number;
  b2bPrice?: number;
  stock?: number;
}

export type Product = B2BProduct;

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: B2BProduct;
  quantity: number;
  unitPrice: number;     // Effective tiered B2B price in ৳
  mrpPrice: number;      // Retail MRP in ৳
  subtotal: number;      // quantity * unitPrice
  tierApplied: 1 | 2 | 3;
}

export interface WholesaleOrder {
  id: string;
  invoiceNumber: string; // e.g. "BIS-9021"
  userId: string;
  shopId: string;
  shopName: string;
  ownerName: string;
  shopPhone: string;
  routeId: string;
  routeName: string;
  deliveryScheduleLabel: string;
  totalCartons: number;
  subtotalMrpBdt: number;
  totalWholesaleBdt: number;
  totalSavingsBdt: number;
  paymentMethod: PaymentMethod;
  paidAmountBdt: number;
  dueAmountBdt: number;
  paymentTrxId?: string;
  paymentSenderPhone?: string;
  orderStatus: OrderStatus;
  alarmAcknowledged: boolean;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;

  // Compatibility aliases
  orderNumber?: string;
  totalAmount?: number;
  totalMrpAmount?: number;
  user?: ShopProfile;
  route?: MarketRoute;
  status?: OrderStatus;
}

export type Order = WholesaleOrder;

export interface CartItem {
  product: B2BProduct;
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
