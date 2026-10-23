import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessB2BPricing, getEffectiveTierPrice, calculateMargin, calculateOrderTotals, generatePickList } from './pricing.ts';
import type { ShopProfile, B2BProduct, WholesaleOrder } from '../types/index.ts';

test('canAccessB2BPricing requires login for guests', () => {
  const result = canAccessB2BPricing(null);
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'LOGIN_REQUIRED');
});

test('canAccessB2BPricing grants super admin access', () => {
  const admin: ShopProfile = {
    id: 'u1',
    userId: 'uid-admin',
    phone: '01700000001',
    ownerName: 'Haji Nurul Islam',
    shopName: 'BISTAR Central Wholesale Depot',
    role: 'SUPER_ADMIN',
    businessSector: 'MULTI',
    routeId: 'r-chawkbazar',
    routeName: 'Chawkbazar Wholesale Hub',
    status: 'APPROVED',
    creditLimitBdt: 1000000,
    currentDueBdt: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const result = canAccessB2BPricing(admin);
  assert.equal(result.allowed, true);
  assert.equal(result.reason, 'SUPER_ADMIN');
});

test('canAccessB2BPricing blocks pending and rejected clients', () => {
  const pendingUser: ShopProfile = {
    id: 'u2',
    userId: 'uid-pending',
    phone: '01811112233',
    ownerName: 'Shopkeeper A',
    shopName: 'Al-Madina Store',
    role: 'B2B_CLIENT',
    businessSector: 'FMCG',
    routeId: 'r-chawkbazar',
    routeName: 'Chawkbazar Wholesale Hub',
    status: 'PENDING',
    creditLimitBdt: 50000,
    currentDueBdt: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const rejectedUser: ShopProfile = { ...pendingUser, id: 'u3', status: 'REJECTED' };

  assert.equal(canAccessB2BPricing(pendingUser).allowed, false);
  assert.equal(canAccessB2BPricing(pendingUser).reason, 'PENDING_APPROVAL');

  assert.equal(canAccessB2BPricing(rejectedUser).allowed, false);
  assert.equal(canAccessB2BPricing(rejectedUser).reason, 'REJECTED');
});

test('canAccessB2BPricing checks validityExpiryEpochMs', () => {
  const now = 1761230000000;
  const expiredUser: ShopProfile = {
    id: 'u4',
    userId: 'uid-expired',
    phone: '01922223344',
    ownerName: 'Expired Shop',
    shopName: 'Expired Medicos',
    role: 'B2B_CLIENT',
    businessSector: 'PHARMA',
    routeId: 'r-mitford',
    routeName: 'Mitford Pharma Zone',
    status: 'APPROVED',
    validityExpiryEpochMs: now - 10000, // Expired
    creditLimitBdt: 50000,
    currentDueBdt: 0,
    createdAt: '',
    updatedAt: ''
  };

  const validUser: ShopProfile = {
    ...expiredUser,
    id: 'u5',
    validityExpiryEpochMs: now + 864000000 // Valid
  };

  assert.equal(canAccessB2BPricing(expiredUser, now).allowed, false);
  assert.equal(canAccessB2BPricing(expiredUser, now).reason, 'EXPIRED');

  assert.equal(canAccessB2BPricing(validUser, now).allowed, true);
  assert.equal(canAccessB2BPricing(validUser, now).reason, 'APPROVED');
});

test('getEffectiveTierPrice evaluates 3-tier bulk slabs correctly', () => {
  const prod: B2BProduct = {
    id: 'p1',
    skuCode: 'FMCG-UN-01',
    name: 'Lux Velvet Glow Soap 100g',
    brand: 'Unilever Distribution',
    brandId: 'b-uni',
    sector: 'FMCG',
    category: 'Personal Care',
    categoryId: 'c-fmcg',
    packSize: 'Carton of 48 Bars',
    packUnit: 'Carton',
    mrpBdt: 3120,
    baseWholesaleBdt: 2650, // Tier 1: 1-9
    tier2MinQty: 10,
    tier2PriceBdt: 2540,   // Tier 2: 10-29
    tier3MinQty: 30,
    tier3PriceBdt: 2420,   // Tier 3: 30+
    minOrderQty: 1,
    stockQty: 500,
    inStock: true,
    createdAt: '',
    updatedAt: ''
  };

  // 5 Cartons (Tier 1)
  const t1 = getEffectiveTierPrice(prod, 5, true);
  assert.equal(t1.tier, 1);
  assert.equal(t1.unitPrice, 2650);

  // 15 Cartons (Tier 2)
  const t2 = getEffectiveTierPrice(prod, 15, true);
  assert.equal(t2.tier, 2);
  assert.equal(t2.unitPrice, 2540);

  // 50 Cartons (Tier 3)
  const t3 = getEffectiveTierPrice(prod, 50, true);
  assert.equal(t3.tier, 3);
  assert.equal(t3.unitPrice, 2420);

  // Unapproved shop receives MRP
  const unapproved = getEffectiveTierPrice(prod, 50, false);
  assert.equal(unapproved.unitPrice, 3120);
});

test('calculateOrderTotals computes tiered bulk savings in ৳ BDT', () => {
  const prod: B2BProduct = {
    id: 'p1',
    skuCode: 'MED-SQ-01',
    name: 'Ace Plus Tablet 500mg/65mg',
    brand: 'Square Pharmaceuticals',
    brandId: 'b-sqr',
    sector: 'PHARMA',
    category: 'Prescription',
    categoryId: 'c-pharma',
    packSize: 'Box of 200 (20x10)',
    packUnit: 'Box',
    mrpBdt: 500,
    baseWholesaleBdt: 420, // 1-9
    tier2MinQty: 10,
    tier2PriceBdt: 400,   // 10-29
    tier3MinQty: 30,
    tier3PriceBdt: 380,   // 30+
    minOrderQty: 1,
    stockQty: 500,
    inStock: true,
    createdAt: '',
    updatedAt: ''
  };

  // Order 10 boxes (crosses into Tier 2 -> ৳400/box)
  // MRP: 10 * 500 = 5000. Wholesale: 10 * 400 = 4000. Savings: 1000
  const totals = calculateOrderTotals([{ product: prod, quantity: 10 }], true);
  assert.equal(totals.totalB2B, 4000);
  assert.equal(totals.totalMrp, 5000);
  assert.equal(totals.retailerSavings, 1000);
  assert.equal(totals.totalQuantity, 10);
});
