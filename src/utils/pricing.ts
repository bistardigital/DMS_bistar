import type { ShopProfile, B2BProduct, WholesaleOrder, PickListItem } from '../types/index.ts';

/**
 * Validates if a B2B shop/client is authorized to view wholesale tiered pricing and place orders.
 */
export function canAccessB2BPricing(
  shop?: ShopProfile | null,
  currentEpochMs: number = Date.now()
): {
  allowed: boolean;
  reason: 'LOGIN_REQUIRED' | 'PENDING_APPROVAL' | 'REJECTED' | 'EXPIRED' | 'APPROVED' | 'SUPER_ADMIN';
} {
  if (!shop) {
    return { allowed: false, reason: 'LOGIN_REQUIRED' };
  }

  if (shop.role === 'SUPER_ADMIN') {
    return { allowed: true, reason: 'SUPER_ADMIN' };
  }

  if (shop.status === 'PENDING') {
    return { allowed: false, reason: 'PENDING_APPROVAL' };
  }

  if (shop.status === 'REJECTED' || shop.status === 'SUSPENDED') {
    return { allowed: false, reason: 'REJECTED' };
  }

  if (shop.validityExpiryEpochMs && shop.validityExpiryEpochMs > 0) {
    if (shop.validityExpiryEpochMs < currentEpochMs) {
      return { allowed: false, reason: 'EXPIRED' };
    }
  }

  if (shop.status === 'APPROVED') {
    return { allowed: true, reason: 'APPROVED' };
  }

  return { allowed: false, reason: 'PENDING_APPROVAL' };
}

/**
 * Computes dynamic 3-Tier bulk pricing based on carton order quantity
 * Tier 1: 1-9 Cartons (Base Wholesale)
 * Tier 2: 10-29 Cartons (Volume Wholesale)
 * Tier 3: 30+ Cartons (Super Dealer Deep Discount)
 */
export function getEffectiveTierPrice(
  product: B2BProduct,
  quantity: number,
  isApproved: boolean
): {
  unitPrice: number;
  tier: 1 | 2 | 3;
  unitSavings: number;
  nextTier?: { minQty: number; price: number; savingsDelta: number };
} {
  const mrp = product.mrpBdt || product.mrpPrice || 0;
  const baseB2b = product.baseWholesaleBdt || product.b2bPrice || mrp;
  const tier2Min = product.tier2MinQty || 10;
  const tier2Price = product.tier2PriceBdt || Math.round(baseB2b * 0.96);
  const tier3Min = product.tier3MinQty || 30;
  const tier3Price = product.tier3PriceBdt || Math.round(baseB2b * 0.92);

  if (!isApproved) {
    return {
      unitPrice: mrp,
      tier: 1,
      unitSavings: 0
    };
  }

  if (quantity >= tier3Min) {
    return {
      unitPrice: tier3Price,
      tier: 3,
      unitSavings: mrp - tier3Price
    };
  }

  if (quantity >= tier2Min) {
    return {
      unitPrice: tier2Price,
      tier: 2,
      unitSavings: mrp - tier2Price,
      nextTier: {
        minQty: tier3Min,
        price: tier3Price,
        savingsDelta: tier2Price - tier3Price
      }
    };
  }

  return {
    unitPrice: baseB2b,
    tier: 1,
    unitSavings: mrp - baseB2b,
    nextTier: {
      minQty: tier2Min,
      price: tier2Price,
      savingsDelta: baseB2b - tier2Price
    }
  };
}

/**
 * Calculates profit margin between Consumer MRP and Wholesale B2B price in ৳ BDT.
 */
export function calculateMargin(mrp: number, b2b: number): {
  profitAmount: number;
  marginPercent: number;
} {
  if (mrp <= 0) {
    return { profitAmount: 0, marginPercent: 0 };
  }
  const profitAmount = Math.max(0, mrp - b2b);
  const marginPercent = Math.round(((mrp - b2b) / mrp) * 1000) / 10;
  return {
    profitAmount: Math.round(profitAmount * 100) / 100,
    marginPercent: Math.max(0, marginPercent)
  };
}

/**
 * Calculates totals for cart items with multi-tier bulk pricing
 */
export function calculateOrderTotals(
  items: { product: B2BProduct; quantity: number }[],
  isApprovedB2B: boolean
) {
  let totalB2B = 0;
  let totalMrp = 0;
  let totalQuantity = 0;

  for (const item of items) {
    const qty = Math.max(0, item.quantity);
    const mrp = item.product.mrpBdt || item.product.mrpPrice || 0;
    const tierResult = getEffectiveTierPrice(item.product, qty, isApprovedB2B);

    totalQuantity += qty;
    totalMrp += mrp * qty;
    totalB2B += tierResult.unitPrice * qty;
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
  orders: WholesaleOrder[],
  products: B2BProduct[],
  routeId?: string
): PickListItem[] {
  const filteredOrders = orders.filter(o => {
    if (o.orderStatus === 'CANCELLED') return false;
    if (routeId && routeId !== 'ALL' && o.routeId !== routeId) return false;
    return true;
  });

  const productMap = new Map<string, B2BProduct>();
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
          sku: product.skuCode || product.sku || 'SKU',
          productName: product.name,
          genericName: product.genericName,
          packUnit: product.packSize || product.packUnit || 'Carton',
          totalQuantity: 0,
          ordersCount: 0,
          destinations: []
        };
        pickMap.set(product.id, entry);
      }

      entry.totalQuantity += item.quantity;
      entry.ordersCount += 1;
      entry.destinations.push({
        shopName: order.shopName || 'Retail Client',
        orderNumber: order.invoiceNumber || order.orderNumber || order.id,
        quantity: item.quantity
      });
    }
  }

  return Array.from(pickMap.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);
}

/**
 * Standard currency formatting with Bangladeshi Taka (৳ BDT)
 */
export function formatCurrency(amount: number, symbol: string = '৳'): string {
  const rounded = Math.round(amount * 100) / 100;
  return `${symbol}${rounded.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}
