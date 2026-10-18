import type { User, Product, Order, PickListItem } from '../types/index.ts';

/**
 * Validates if a user is authorized to view B2B wholesale pricing and place orders.
 */
export function canAccessB2BPricing(user?: User | null, currentDate: Date = new Date()): {
  allowed: boolean;
  reason: 'LOGIN_REQUIRED' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'EXPIRED' | 'APPROVED' | 'SUPER_ADMIN';
} {
  if (!user) {
    return { allowed: false, reason: 'LOGIN_REQUIRED' };
  }

  if (user.role === 'SUPER_ADMIN') {
    return { allowed: true, reason: 'SUPER_ADMIN' };
  }

  if (user.status === 'PENDING') {
    return { allowed: false, reason: 'PENDING_APPROVAL' };
  }

  if (user.status === 'SUSPENDED') {
    return { allowed: false, reason: 'SUSPENDED' };
  }

  if (user.accessExpires) {
    const expiry = new Date(user.accessExpires);
    if (!isNaN(expiry.getTime()) && expiry.getTime() < currentDate.getTime()) {
      return { allowed: false, reason: 'EXPIRED' };
    }
  }

  if (user.status === 'APPROVED') {
    return { allowed: true, reason: 'APPROVED' };
  }

  return { allowed: false, reason: 'PENDING_APPROVAL' };
}

/**
 * Calculates profit margin between Consumer MRP and Wholesale B2B price.
 */
export function calculateMargin(mrp: number, b2b: number): {
  profitAmount: number;
  marginPercent: number;
} {
  if (mrp <= 0) {
    return { profitAmount: 0, marginPercent: 0 };
  }
  const profitAmount = Math.max(0, mrp - b2b);
  const marginPercent = Math.round(((mrp - b2b) / mrp) * 1000) / 10; // 1 decimal place
  return {
    profitAmount: Math.round(profitAmount * 100) / 100,
    marginPercent: Math.max(0, marginPercent)
  };
}

/**
 * Calculates totals for cart items
 */
export function calculateOrderTotals(
  items: { product: Product; quantity: number }[],
  isApprovedB2B: boolean
) {
  let totalB2B = 0;
  let totalMrp = 0;
  let totalQuantity = 0;

  for (const item of items) {
    const qty = Math.max(0, item.quantity);
    totalQuantity += qty;
    totalMrp += item.product.mrpPrice * qty;
    totalB2B += (isApprovedB2B ? item.product.b2bPrice : item.product.mrpPrice) * qty;
  }

  const retailerSavings = Math.max(0, totalMrp - totalB2B);

  return {
    totalB2B: Math.round(totalB2B * 100) / 100,
    totalMrp: Math.round(totalMrp * 100) / 100,
    retailerSavings: Math.round(retailerSavings * 100) / 100,
    totalQuantity,
  };
}

/**
 * Aggregates Route-wise Pick-Lists for warehouse dispatch.
 */
export function generatePickList(
  orders: Order[],
  products: Product[],
  routeId?: string
): PickListItem[] {
  const filteredOrders = orders.filter(o => {
    if (o.status === 'CANCELLED') return false;
    if (routeId && routeId !== 'ALL' && o.routeId !== routeId) return false;
    return true;
  });

  const productMap = new Map<string, Product>();
  products.forEach(p => productMap.set(p.id, p));

  const pickMap = new Map<string, PickListItem>();

  for (const order of filteredOrders) {
    for (const item of order.items) {
      const product = item.product || productMap.get(item.productId);
      if (!product) continue;

      let entry = pickMap.get(product.id);
      if (!entry) {
        entry = {
          productId: product.id,
          sku: product.sku,
          productName: product.name,
          genericName: product.genericName,
          packUnit: product.packUnit,
          totalQuantity: 0,
          ordersCount: 0,
          destinations: []
        };
        pickMap.set(product.id, entry);
      }

      entry.totalQuantity += item.quantity;
      entry.ordersCount += 1;
      entry.destinations.push({
        shopName: order.user?.shopName || order.user?.ownerName || 'Direct Client',
        orderNumber: order.orderNumber,
        quantity: item.quantity
      });
    }
  }

  return Array.from(pickMap.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);
}

/**
 * Standard currency formatting with currency symbol
 */
export function formatCurrency(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
