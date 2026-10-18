import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessB2BPricing, calculateMargin, calculateOrderTotals, generatePickList } from './pricing.ts';
import type { User, Product, Order } from '../types/index.ts';

test('canAccessB2BPricing requires login for guests', () => {
  const result = canAccessB2BPricing(null);
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'LOGIN_REQUIRED');
});

test('canAccessB2BPricing grants super admin access', () => {
  const admin: User = {
    id: 'u1',
    phone: '1234567890',
    ownerName: 'Admin Boss',
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const result = canAccessB2BPricing(admin);
  assert.equal(result.allowed, true);
  assert.equal(result.reason, 'SUPER_ADMIN');
});

test('canAccessB2BPricing blocks pending and suspended clients', () => {
  const pendingUser: User = {
    id: 'u2',
    phone: '1234567891',
    ownerName: 'Shopkeeper A',
    role: 'B2B_CLIENT',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const suspendedUser: User = { ...pendingUser, id: 'u3', status: 'SUSPENDED' };

  assert.equal(canAccessB2BPricing(pendingUser).allowed, false);
  assert.equal(canAccessB2BPricing(pendingUser).reason, 'PENDING_APPROVAL');

  assert.equal(canAccessB2BPricing(suspendedUser).allowed, false);
  assert.equal(canAccessB2BPricing(suspendedUser).reason, 'SUSPENDED');
});

test('canAccessB2BPricing checks expiry validity date', () => {
  const now = new Date('2026-10-18T12:00:00Z');
  const expiredUser: User = {
    id: 'u4',
    phone: '1234567892',
    ownerName: 'Expired Shop',
    role: 'B2B_CLIENT',
    status: 'APPROVED',
    accessExpires: '2026-10-01T00:00:00Z',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  };

  const validUser: User = {
    id: 'u5',
    phone: '1234567893',
    ownerName: 'Active Shop',
    role: 'B2B_CLIENT',
    status: 'APPROVED',
    accessExpires: '2026-12-31T23:59:59Z',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  };

  assert.equal(canAccessB2BPricing(expiredUser, now).allowed, false);
  assert.equal(canAccessB2BPricing(expiredUser, now).reason, 'EXPIRED');

  assert.equal(canAccessB2BPricing(validUser, now).allowed, true);
  assert.equal(canAccessB2BPricing(validUser, now).reason, 'APPROVED');
});

test('calculateMargin accurately calculates dealer profit and margin percent', () => {
  // MRP: 100, B2B: 70 -> profit 30, margin 30%
  const res = calculateMargin(100, 70);
  assert.equal(res.profitAmount, 30);
  assert.equal(res.marginPercent, 30);

  // MRP: 250, B2B: 200 -> profit 50, margin 20%
  const res2 = calculateMargin(250, 200);
  assert.equal(res2.profitAmount, 50);
  assert.equal(res2.marginPercent, 20);
});

test('calculateOrderTotals applies wholesale B2B pricing for approved clients', () => {
  const mockProduct: Product = {
    id: 'p1',
    name: 'Napa Extra 500mg',
    sku: 'MED-001',
    brandId: 'b1',
    categoryId: 'c1',
    packUnit: 'Box of 100',
    mrpPrice: 200,
    b2bPrice: 160,
    stock: 500,
    minOrderQty: 2,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  };

  // 5 boxes
  const items = [{ product: mockProduct, quantity: 5 }];

  // When client is approved: total B2B is 160 * 5 = 800, MRP is 200 * 5 = 1000, savings = 200
  const approvedTotals = calculateOrderTotals(items, true);
  assert.equal(approvedTotals.totalB2B, 800);
  assert.equal(approvedTotals.totalMrp, 1000);
  assert.equal(approvedTotals.retailerSavings, 200);
  assert.equal(approvedTotals.totalQuantity, 5);

  // When client is unapproved: charges MRP
  const unapprovedTotals = calculateOrderTotals(items, false);
  assert.equal(unapprovedTotals.totalB2B, 1000);
  assert.equal(approvedTotals.totalQuantity, 5);
});

test('generatePickList aggregates quantities across multiple orders by route', () => {
  const p1: Product = {
    id: 'prod1',
    name: 'Paracetamol 500',
    sku: 'SKU-01',
    brandId: 'b1',
    categoryId: 'c1',
    packUnit: 'Box of 50',
    mrpPrice: 50,
    b2bPrice: 40,
    stock: 200,
    minOrderQty: 1,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  };

  const orders: Order[] = [
    {
      id: 'o1',
      orderNumber: 'ORD-101',
      userId: 'u1',
      routeId: 'route-north',
      totalAmount: 120,
      status: 'RECEIVED',
      user: {
        id: 'u1',
        phone: '111',
        ownerName: 'Ali',
        shopName: 'Ali Medicos',
        role: 'B2B_CLIENT',
        status: 'APPROVED',
        createdAt: '',
        updatedAt: ''
      },
      items: [{ id: 'item1', orderId: 'o1', productId: 'prod1', product: p1, quantity: 3, unitPrice: 40, subtotal: 120 }],
      createdAt: '2026-10-18',
      updatedAt: '2026-10-18'
    },
    {
      id: 'o2',
      orderNumber: 'ORD-102',
      userId: 'u2',
      routeId: 'route-north',
      totalAmount: 80,
      status: 'PROCESSING',
      user: {
        id: 'u2',
        phone: '222',
        ownerName: 'Babu',
        shopName: 'Babu Pharmacy',
        role: 'B2B_CLIENT',
        status: 'APPROVED',
        createdAt: '',
        updatedAt: ''
      },
      items: [{ id: 'item2', orderId: 'o2', productId: 'prod1', product: p1, quantity: 2, unitPrice: 40, subtotal: 80 }],
      createdAt: '2026-10-18',
      updatedAt: '2026-10-18'
    },
    {
      id: 'o3',
      orderNumber: 'ORD-103',
      userId: 'u3',
      routeId: 'route-south', // Different route
      totalAmount: 40,
      status: 'RECEIVED',
      items: [{ id: 'item3', orderId: 'o3', productId: 'prod1', product: p1, quantity: 1, unitPrice: 40, subtotal: 40 }],
      createdAt: '2026-10-18',
      updatedAt: '2026-10-18'
    }
  ];

  const pickListNorth = generatePickList(orders, [p1], 'route-north');
  assert.equal(pickListNorth.length, 1);
  assert.equal(pickListNorth[0].totalQuantity, 5); // 3 + 2
  assert.equal(pickListNorth[0].destinations.length, 2);
  assert.equal(pickListNorth[0].destinations[0].shopName, 'Ali Medicos');
});
