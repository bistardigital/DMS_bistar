import {
  ShopProfile,
  Brand,
  Category,
  B2BProduct,
  MarketRoute,
  WholesaleOrder
} from '../types/index.ts';

export const INITIAL_BRANDS: Brand[] = [
  { id: 'b-sqr', name: 'Square Pharmaceuticals', sector: 'PHARMA', origin: 'Dhaka', createdAt: '2026-01-01' },
  { id: 'b-bex', name: 'Beximco Health', sector: 'PHARMA', origin: 'Dhaka', createdAt: '2026-01-01' },
  { id: 'b-uni', name: 'Unilever Bangladesh', sector: 'FMCG', origin: 'Chattogram', createdAt: '2026-01-01' },
  { id: 'b-pran', name: 'Pran Foods Wholesale', sector: 'FMCG', origin: 'Narsingdi', createdAt: '2026-01-01' },
  { id: 'b-aci', name: 'ACI Crop Care & Agro', sector: 'AGRO', origin: 'Tejgaon', createdAt: '2026-01-01' },
  { id: 'b-nes', name: 'Nestle Professional', sector: 'FMCG', origin: 'Sreepur', createdAt: '2026-01-01' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c-pharma', name: 'Prescription & Antibiotics', sector: 'PHARMA', description: 'Essential prescription medicines, tablets & capsules', iconName: 'Pill', createdAt: '2026-01-01' },
  { id: 'c-otc', name: 'OTC & First Aid', sector: 'PHARMA', description: 'Over-the-counter syrups, pain relief & balms', iconName: 'Cross', createdAt: '2026-01-01' },
  { id: 'c-fmcg', name: 'Personal Care & Hygiene', sector: 'FMCG', description: 'Soaps, detergents, shampoos & oral care', iconName: 'Sparkles', createdAt: '2026-01-01' },
  { id: 'c-food', name: 'Packaged Food & Dairy', sector: 'FMCG', description: 'Bulk cartons of tea, biscuits & juice', iconName: 'ShoppingBag', createdAt: '2026-01-01' },
  { id: 'c-agro', name: 'Agro & Crop Nutrition', sector: 'AGRO', description: 'Fertilizers, pest protection & foliar sprays', iconName: 'Sprout', createdAt: '2026-01-01' },
];

export const INITIAL_ROUTES: MarketRoute[] = [
  {
    id: 'r-chawkbazar',
    routeCode: 'RTE-DH-101',
    routeName: 'Chawkbazar Wholesale Hub',
    areaCoverage: 'Old Dhaka, Chawkbazar, Begumbazar, Moulvibazar',
    deliveryDays: 'Sun, Tue, Thu',
    cutoffTime: '04:00 PM',
    assignedVehicle: 'Covered Van DHAKA-METRO-U-11-2034',
    createdAt: '2026-01-01'
  },
  {
    id: 'r-mitford',
    routeCode: 'RTE-DH-102',
    routeName: 'Mitford Pharma Zone',
    areaCoverage: 'Babubazar, Mitford Road, Armanitola Medicine Market',
    deliveryDays: 'Daily Morning (09:00 AM)',
    cutoffTime: '08:00 PM (Previous Day)',
    assignedVehicle: 'Express Pickup DHAKA-METRO-N-14-5590',
    createdAt: '2026-01-01'
  },
  {
    id: 'r-mirpur',
    routeCode: 'RTE-DH-103',
    routeName: 'Mirpur-10 Market Route',
    areaCoverage: 'Mirpur 1, 2, 10, Pallabi, Kazipara Wholesale Outlets',
    deliveryDays: 'Mon, Wed, Sat',
    cutoffTime: '06:00 PM',
    assignedVehicle: 'Covered Van DHAKA-METRO-U-12-8841',
    createdAt: '2026-01-01'
  },
  {
    id: 'r-bogura',
    routeCode: 'RTE-NB-201',
    routeName: 'Bogura Agro Bazar',
    areaCoverage: 'Bogura Sadar, Sherpur, Dupchanchia Agro Hubs',
    deliveryDays: 'Tue, Fri',
    cutoffTime: '05:00 PM',
    assignedVehicle: '7-Ton Truck BOGURA-U-11-0922',
    createdAt: '2026-01-01'
  },
  {
    id: 'r-sylhet',
    routeCode: 'RTE-SY-301',
    routeName: 'Sylhet Bondor Bazar Route',
    areaCoverage: 'Bondor Bazar, Zindabazar, Kadamtali Depot',
    deliveryDays: 'Weekly Wednesday',
    cutoffTime: 'Tuesday 10:00 AM',
    assignedVehicle: 'Covered Van SYLHET-M-11-4410',
    createdAt: '2026-01-01'
  }
];

export const INITIAL_SHOPS: ShopProfile[] = [
  {
    id: 'u-admin',
    userId: 'uid-admin-01',
    phone: '01700000001',
    ownerName: 'Haji Nurul Islam',
    shopName: 'BISTAR Central Wholesale Depot',
    role: 'SUPER_ADMIN',
    businessSector: 'MULTI',
    routeId: 'r-chawkbazar',
    routeName: 'Chawkbazar Wholesale Hub',
    status: 'APPROVED',
    validityExpiryEpochMs: 1924905600000, // 2030
    creditLimitBdt: 2000000,
    currentDueBdt: 0,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'u-retailer-1',
    userId: 'uid-ret-01',
    phone: '01811112233',
    ownerName: 'Tariqul Alam',
    shopName: 'Madina Pharma & Departmental',
    role: 'B2B_CLIENT',
    tradeLicenseNo: 'TRAD/DSCC/019284/2025',
    businessSector: 'PHARMA',
    routeId: 'r-mitford',
    routeName: 'Mitford Pharma Zone',
    status: 'APPROVED',
    validityExpiryEpochMs: Date.now() + 1000 * 60 * 60 * 24 * 365, // 1 Year from now
    creditLimitBdt: 100000,
    currentDueBdt: 24500, // ৳24,500 due in ledger
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'u-retailer-2',
    userId: 'uid-ret-02',
    phone: '01922223344',
    ownerName: 'Kamal Hossain',
    shopName: 'Bismillah General Store',
    role: 'B2B_CLIENT',
    tradeLicenseNo: 'TRAD/DNCC/082190/2026',
    businessSector: 'FMCG',
    routeId: 'r-chawkbazar',
    routeName: 'Chawkbazar Wholesale Hub',
    status: 'PENDING',
    validityExpiryEpochMs: null,
    creditLimitBdt: 50000,
    currentDueBdt: 0,
    createdAt: '2026-10-17T09:15:00Z',
    updatedAt: '2026-10-17T09:15:00Z'
  },
  {
    id: 'u-retailer-3',
    userId: 'uid-ret-03',
    phone: '01633334455',
    ownerName: 'Rafiqul Khan',
    shopName: 'Khan Agro Seeds & Chem',
    role: 'B2B_CLIENT',
    tradeLicenseNo: 'AGRO/BGR/2024/771',
    businessSector: 'AGRO',
    routeId: 'r-bogura',
    routeName: 'Bogura Agro Bazar',
    status: 'REJECTED',
    validityExpiryEpochMs: Date.now() - 1000 * 60 * 60 * 24 * 10, // Expired
    creditLimitBdt: 30000,
    currentDueBdt: 8200,
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-09-02T00:00:00Z'
  },
  {
    id: 'u-retailer-4',
    userId: 'uid-ret-04',
    phone: '01755556677',
    ownerName: 'Dr. Shahabuddin',
    shopName: 'Popular Model Pharmacy',
    role: 'B2B_CLIENT',
    tradeLicenseNo: 'DGDA/RET/2023/1029',
    businessSector: 'PHARMA',
    routeId: 'r-mirpur',
    routeName: 'Mirpur-10 Market Route',
    status: 'APPROVED',
    validityExpiryEpochMs: Date.now() + 1000 * 60 * 60 * 24 * 180, // 6 Months
    creditLimitBdt: 150000,
    currentDueBdt: 42000,
    createdAt: '2026-04-12T14:30:00Z',
    updatedAt: '2026-04-12T14:30:00Z'
  }
];

export const INITIAL_PRODUCTS: B2BProduct[] = [
  {
    id: 'p-ace-plus',
    skuCode: 'MED-SQ-01',
    name: 'Ace Plus Tablet 500mg/65mg',
    brand: 'Square Pharmaceuticals',
    brandId: 'b-sqr',
    sector: 'PHARMA',
    category: 'Prescription',
    categoryId: 'c-pharma',
    packSize: 'Box of 200 (20x10)',
    packUnit: 'Box',
    genericName: 'Paracetamol 500mg + Caffeine 65mg',
    mrpBdt: 500.00,
    baseWholesaleBdt: 420.00,  // Tier 1 (1-9)
    tier2MinQty: 10,
    tier2PriceBdt: 400.00,    // Tier 2 (10-29)
    tier3MinQty: 30,
    tier3PriceBdt: 380.00,    // Tier 3 (30+)
    stockQty: 450,
    minOrderQty: 1,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10'
  },
  {
    id: 'p-seclo-20',
    skuCode: 'MED-SQ-02',
    name: 'Seclo 20mg Capsule',
    brand: 'Square Pharmaceuticals',
    brandId: 'b-sqr',
    sector: 'PHARMA',
    category: 'Prescription',
    categoryId: 'c-pharma',
    packSize: 'Box of 100',
    packUnit: 'Box',
    genericName: 'Omeprazole BP 20mg',
    mrpBdt: 600.00,
    baseWholesaleBdt: 504.00,  // Tier 1
    tier2MinQty: 10,
    tier2PriceBdt: 480.00,    // Tier 2
    tier3MinQty: 30,
    tier3PriceBdt: 455.00,    // Tier 3
    stockQty: 620,
    minOrderQty: 2,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10'
  },
  {
    id: 'p-napa-extra',
    skuCode: 'MED-BX-01',
    name: 'Napa Extra 500mg Pot',
    brand: 'Beximco Health',
    brandId: 'b-bex',
    sector: 'PHARMA',
    category: 'OTC & First Aid',
    categoryId: 'c-otc',
    packSize: '50s Pot Container',
    packUnit: 'Pot',
    genericName: 'Paracetamol BP 500mg',
    mrpBdt: 150.00,
    baseWholesaleBdt: 124.50, // Tier 1
    tier2MinQty: 15,
    tier2PriceBdt: 118.00,   // Tier 2
    tier3MinQty: 40,
    tier3PriceBdt: 112.00,   // Tier 3
    stockQty: 900,
    minOrderQty: 5,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10'
  },
  {
    id: 'p-telfast-120',
    skuCode: 'MED-BX-02',
    name: 'Telfast 120mg Allergy Relief',
    brand: 'Beximco Health',
    brandId: 'b-bex',
    sector: 'PHARMA',
    category: 'Prescription',
    categoryId: 'c-pharma',
    packSize: 'Box of 50',
    packUnit: 'Box',
    genericName: 'Fexofenadine Hydrochloride 120mg',
    mrpBdt: 450.00,
    baseWholesaleBdt: 382.50, // Tier 1
    tier2MinQty: 10,
    tier2PriceBdt: 365.00,   // Tier 2
    tier3MinQty: 25,
    tier3PriceBdt: 345.00,   // Tier 3
    stockQty: 310,
    minOrderQty: 1,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
    isFeatured: false,
    createdAt: '2026-01-12',
    updatedAt: '2026-01-12'
  },
  {
    id: 'p-lux-soap',
    skuCode: 'FMCG-UN-01',
    name: 'Lux Velvet Glow Soap 100g',
    brand: 'Unilever Bangladesh',
    brandId: 'b-uni',
    sector: 'FMCG',
    category: 'Personal Care',
    categoryId: 'c-fmcg',
    packSize: 'Carton of 48 Bars',
    packUnit: 'Carton',
    genericName: 'Rose & Vitamin E Beauty Bar',
    mrpBdt: 3120.00,
    baseWholesaleBdt: 2650.00, // Tier 1 (1-9)
    tier2MinQty: 10,
    tier2PriceBdt: 2520.00,   // Tier 2 (10-29)
    tier3MinQty: 30,
    tier3PriceBdt: 2400.00,   // Tier 3 (30+)
    stockQty: 120,
    minOrderQty: 1,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15'
  },
  {
    id: 'p-wheel-detergent',
    skuCode: 'FMCG-UN-02',
    name: 'Wheel 2-in-1 Clean Washing Powder 500g',
    brand: 'Unilever Bangladesh',
    brandId: 'b-uni',
    sector: 'FMCG',
    category: 'Personal Care',
    categoryId: 'c-fmcg',
    packSize: 'Master Sack of 24 Packs',
    packUnit: 'Sack',
    genericName: 'Lemon & Active Enzyme Fabric Wash',
    mrpBdt: 1920.00,
    baseWholesaleBdt: 1670.00, // Tier 1
    tier2MinQty: 10,
    tier2PriceBdt: 1590.00,   // Tier 2
    tier3MinQty: 25,
    tier3PriceBdt: 1510.00,   // Tier 3
    stockQty: 85,
    minOrderQty: 2,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?w=600&auto=format&fit=crop&q=80',
    isFeatured: false,
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15'
  },
  {
    id: 'p-pran-mango',
    skuCode: 'FOOD-PR-01',
    name: 'Pran Frooto Mango Drink 250ml',
    brand: 'Pran Foods Wholesale',
    brandId: 'b-pran',
    sector: 'FMCG',
    category: 'Food & Dairy',
    categoryId: 'c-food',
    packSize: 'Shrink Tray of 24 Bottles',
    packUnit: 'Tray',
    genericName: 'Real Pulp Alphonso Mango Drink',
    mrpBdt: 720.00,
    baseWholesaleBdt: 612.00, // Tier 1
    tier2MinQty: 10,
    tier2PriceBdt: 585.00,   // Tier 2
    tier3MinQty: 30,
    tier3PriceBdt: 560.00,   // Tier 3
    stockQty: 240,
    minOrderQty: 2,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-18',
    updatedAt: '2026-01-18'
  },
  {
    id: 'p-aci-fertilizer',
    skuCode: 'AGRO-AC-01',
    name: 'ACI Bio-Green Organic NPK Booster 25kg',
    brand: 'ACI Crop Care & Agro',
    brandId: 'b-aci',
    sector: 'AGRO',
    category: 'Agro & Crop Nutrition',
    categoryId: 'c-agro',
    packSize: 'Bag of 25kg Woven Sack',
    packUnit: 'Bag',
    genericName: 'Granulated Micro-Nutrient Plant Food 10-26-26',
    mrpBdt: 1450.00,
    baseWholesaleBdt: 1230.00, // Tier 1
    tier2MinQty: 10,
    tier2PriceBdt: 1170.00,   // Tier 2
    tier3MinQty: 25,
    tier3PriceBdt: 1110.00,   // Tier 3
    stockQty: 350,
    minOrderQty: 2,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20'
  },
  {
    id: 'p-nescafe-classic',
    skuCode: 'FOOD-NS-01',
    name: 'Nescafe Classic Instant Coffee Jar 200g',
    brand: 'Nestle Professional',
    brandId: 'b-nes',
    sector: 'FMCG',
    category: 'Food & Dairy',
    categoryId: 'c-food',
    packSize: 'Case of 12 Glass Jars',
    packUnit: 'Case',
    genericName: '100% Pure Dark Roasted Coffee',
    mrpBdt: 6600.00,
    baseWholesaleBdt: 5610.00, // Tier 1
    tier2MinQty: 5,
    tier2PriceBdt: 5350.00,   // Tier 2
    tier3MinQty: 15,
    tier3PriceBdt: 5100.00,   // Tier 3
    stockQty: 65,
    minOrderQty: 1,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-22',
    updatedAt: '2026-01-22'
  }
];

export const INITIAL_ORDERS: WholesaleOrder[] = [
  {
    id: 'ord-1001',
    invoiceNumber: 'BIS-8891',
    userId: 'uid-ret-01',
    shopId: 'u-retailer-1',
    shopName: 'Madina Pharma & Departmental',
    ownerName: 'Tariqul Alam',
    shopPhone: '01811112233',
    routeId: 'r-mitford',
    routeName: 'Mitford Pharma Zone',
    deliveryScheduleLabel: 'Daily Morning (09:00 AM)',
    totalCartons: 6,
    subtotalMrpBdt: 2200.00,
    totalWholesaleBdt: 1848.00,
    totalSavingsBdt: 352.00,
    paymentMethod: 'ROUTE_COD',
    paidAmountBdt: 0,
    dueAmountBdt: 1848.00,
    orderStatus: 'NEW_ALARM',
    alarmAcknowledged: false,
    notes: 'Please pack in heavy cartons, rainy weather expected.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    items: [
      {
        id: 'oi-1',
        orderId: 'ord-1001',
        productId: 'p-ace-plus',
        product: INITIAL_PRODUCTS[0],
        quantity: 3,
        unitPrice: 420.00,
        mrpPrice: 500.00,
        subtotal: 1260.00,
        tierApplied: 1
      },
      {
        id: 'oi-2',
        orderId: 'ord-1001',
        productId: 'p-telfast-120',
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        unitPrice: 382.50,
        mrpPrice: 450.00,
        subtotal: 382.50,
        tierApplied: 1
      },
      {
        id: 'oi-3',
        orderId: 'ord-1001',
        productId: 'p-napa-extra',
        product: INITIAL_PRODUCTS[2],
        quantity: 2,
        unitPrice: 124.50,
        mrpPrice: 150.00,
        subtotal: 249.00,
        tierApplied: 1
      }
    ]
  },
  {
    id: 'ord-1002',
    invoiceNumber: 'BIS-8890',
    userId: 'uid-ret-04',
    shopId: 'u-retailer-4',
    shopName: 'Popular Model Pharmacy',
    ownerName: 'Dr. Shahabuddin',
    shopPhone: '01755556677',
    routeId: 'r-mirpur',
    routeName: 'Mirpur-10 Market Route',
    deliveryScheduleLabel: 'Mon, Wed, Sat',
    totalCartons: 15,
    subtotalMrpBdt: 8700.00,
    totalWholesaleBdt: 7320.00,
    totalSavingsBdt: 1380.00,
    paymentMethod: 'CREDIT_LEDGER',
    paidAmountBdt: 0,
    dueAmountBdt: 7320.00,
    orderStatus: 'CONFIRMED',
    alarmAcknowledged: true,
    notes: 'Billed to credit ledger (বাকি হিসাব).',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    items: [
      {
        id: 'oi-4',
        orderId: 'ord-1002',
        productId: 'p-seclo-20',
        product: INITIAL_PRODUCTS[1],
        quantity: 10,
        unitPrice: 480.00, // Tier 2 applied
        mrpPrice: 600.00,
        subtotal: 4800.00,
        tierApplied: 2
      },
      {
        id: 'oi-5',
        orderId: 'ord-1002',
        productId: 'p-ace-plus',
        product: INITIAL_PRODUCTS[0],
        quantity: 5,
        unitPrice: 420.00,
        mrpPrice: 500.00,
        subtotal: 2100.00,
        tierApplied: 1
      }
    ]
  },
  {
    id: 'ord-1003',
    invoiceNumber: 'BIS-8889',
    userId: 'uid-ret-01',
    shopId: 'u-retailer-1',
    shopName: 'Madina Pharma & Departmental',
    ownerName: 'Tariqul Alam',
    shopPhone: '01811112233',
    routeId: 'r-mitford',
    routeName: 'Mitford Pharma Zone',
    deliveryScheduleLabel: 'Daily Morning',
    totalCartons: 10,
    subtotalMrpBdt: 31200.00,
    totalWholesaleBdt: 25200.00,
    totalSavingsBdt: 6000.00,
    paymentMethod: 'BKASH',
    paidAmountBdt: 25200.00,
    dueAmountBdt: 0,
    paymentTrxId: '9K8L2M7N',
    paymentSenderPhone: '01811112233',
    orderStatus: 'ON_ROUTE',
    alarmAcknowledged: true,
    notes: 'Paid via bKash Merchant TrxID: 9K8L2M7N',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    items: [
      {
        id: 'oi-6',
        orderId: 'ord-1003',
        productId: 'p-lux-soap',
        product: INITIAL_PRODUCTS[4],
        quantity: 10,
        unitPrice: 2520.00, // Tier 2 bulk discount applied!
        mrpPrice: 3120.00,
        subtotal: 25200.00,
        tierApplied: 2
      }
    ]
  }
];

// Compatibility aliases
export const INITIAL_USERS = INITIAL_SHOPS;
