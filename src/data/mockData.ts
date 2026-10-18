import { User, Brand, Category, Product, DeliveryRoute, Order } from '../types/index.ts';

export const INITIAL_BRANDS: Brand[] = [
  { id: 'b-sqr', name: 'Square Pharmaceuticals', origin: 'Pharma Division', createdAt: '2026-01-01' },
  { id: 'b-bex', name: 'Beximco Health', origin: 'Specialty Pharma', createdAt: '2026-01-01' },
  { id: 'b-uni', name: 'Unilever Distribution', origin: 'Consumer FMCG', createdAt: '2026-01-01' },
  { id: 'b-pran', name: 'Pran Foods Wholesale', origin: 'Food & Beverage', createdAt: '2026-01-01' },
  { id: 'b-aci', name: 'ACI Agro Solutions', origin: 'Agro & Seed Care', createdAt: '2026-01-01' },
  { id: 'b-nes', name: 'Nestle Professional', origin: 'Nutrition', createdAt: '2026-01-01' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c-pharma', name: 'Pharma & Prescription', description: 'Essential prescription medicines and tablets', iconName: 'Pill', createdAt: '2026-01-01' },
  { id: 'c-otc', name: 'OTC & First Aid', description: 'Over-the-counter syrups, pain relief & balms', iconName: 'Cross', createdAt: '2026-01-01' },
  { id: 'c-fmcg', name: 'Personal Care & Hygiene', description: 'Soaps, detergents, shampoos & oral care', iconName: 'Sparkles', createdAt: '2026-01-01' },
  { id: 'c-food', name: 'Packaged Food & Dairy', description: 'Bulk cartons of tea, biscuits & juice', iconName: 'ShoppingBag', createdAt: '2026-01-01' },
  { id: 'c-agro', name: 'Agro & Crop Nutrition', description: 'Fertilizers, pest protection & foliar sprays', iconName: 'Sprout', createdAt: '2026-01-01' },
];

export const INITIAL_ROUTES: DeliveryRoute[] = [
  {
    id: 'r-shibchar',
    routeName: 'Shibchar Sadar Route',
    orderCutoffDay: 'Monday 06:00 PM',
    deliveryDay: 'Tuesday (Weekly)',
    areaCode: 'RTE-101',
    createdAt: '2026-01-01'
  },
  {
    id: 'r-kutubpur',
    routeName: 'Kutubpur Bazar Market',
    orderCutoffDay: 'Wednesday 05:00 PM',
    deliveryDay: 'Thursday (Weekly)',
    areaCode: 'RTE-102',
    createdAt: '2026-01-01'
  },
  {
    id: 'r-zajira',
    routeName: 'Zajira 1 Commercial Route',
    orderCutoffDay: 'Friday 04:00 PM',
    deliveryDay: 'Saturday (Weekly)',
    areaCode: 'RTE-103',
    createdAt: '2026-01-01'
  },
  {
    id: 'r-express',
    routeName: 'Highway Hub Express Dispatch',
    orderCutoffDay: 'Daily 08:00 PM',
    deliveryDay: 'Next Morning 09:00 AM',
    areaCode: 'RTE-999',
    createdAt: '2026-01-01'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    phone: '01700000001',
    ownerName: 'Haji Nurul Islam',
    shopName: 'BISTAR Central Wholesale Depot',
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    accessExpires: '2030-12-31T23:59:59Z',
    routeId: 'r-express',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'u-retailer-1',
    phone: '01811112233',
    ownerName: 'Tariqul Alam',
    shopName: 'Madina Pharma & Departmental',
    role: 'B2B_CLIENT',
    status: 'APPROVED',
    accessExpires: '2027-10-30T23:59:59Z',
    routeId: 'r-shibchar',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'u-retailer-2',
    phone: '01922223344',
    ownerName: 'Kamal Hossain',
    shopName: 'Bismillah General Store',
    role: 'B2B_CLIENT',
    status: 'PENDING',
    accessExpires: null,
    routeId: 'r-kutubpur',
    createdAt: '2026-10-17T09:15:00Z',
    updatedAt: '2026-10-17T09:15:00Z'
  },
  {
    id: 'u-retailer-3',
    phone: '01633334455',
    ownerName: 'Rafiqul Khan',
    shopName: 'Khan Agro Seeds & Chem',
    role: 'B2B_CLIENT',
    status: 'SUSPENDED',
    accessExpires: '2026-09-01T00:00:00Z',
    routeId: 'r-zajira',
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-09-02T00:00:00Z'
  },
  {
    id: 'u-retailer-4',
    phone: '01755556677',
    ownerName: 'Dr. Shahabuddin',
    shopName: 'Green Life Model Pharmacy',
    role: 'B2B_CLIENT',
    status: 'APPROVED',
    accessExpires: '2027-05-15T23:59:59Z',
    routeId: 'r-shibchar',
    createdAt: '2026-04-12T14:30:00Z',
    updatedAt: '2026-04-12T14:30:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-ace-plus',
    name: 'Ace Plus Tablet 500mg/65mg',
    sku: 'MED-SQ-01',
    brandId: 'b-sqr',
    categoryId: 'c-pharma',
    packUnit: 'Box of 200 (20x10)',
    genericName: 'Paracetamol + Caffeine',
    mrpPrice: 500.00,
    b2bPrice: 420.00,
    stock: 450,
    minOrderQty: 2,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10'
  },
  {
    id: 'p-seclo-20',
    name: 'Seclo 20mg Capsule',
    sku: 'MED-SQ-02',
    brandId: 'b-sqr',
    categoryId: 'c-pharma',
    packUnit: 'Box of 100',
    genericName: 'Omeprazole BP 20mg',
    mrpPrice: 600.00,
    b2bPrice: 504.00,
    stock: 620,
    minOrderQty: 2,
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10'
  },
  {
    id: 'p-napa-extra',
    name: 'Napa Extra 500mg Pot',
    sku: 'MED-BX-01',
    brandId: 'b-bex',
    categoryId: 'c-otc',
    packUnit: '50s Pot',
    genericName: 'Paracetamol 500mg',
    mrpPrice: 150.00,
    b2bPrice: 124.50,
    stock: 900,
    minOrderQty: 5,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10'
  },
  {
    id: 'p-telfast-120',
    name: 'Telfast 120mg Allergy',
    sku: 'MED-BX-02',
    brandId: 'b-bex',
    categoryId: 'c-pharma',
    packUnit: 'Box of 50',
    genericName: 'Fexofenadine HCl',
    mrpPrice: 450.00,
    b2bPrice: 382.50,
    stock: 310,
    minOrderQty: 1,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
    isFeatured: false,
    createdAt: '2026-01-12',
    updatedAt: '2026-01-12'
  },
  {
    id: 'p-lux-soap',
    name: 'Lux Velvet Glow Soap 100g',
    sku: 'FMCG-UN-01',
    brandId: 'b-uni',
    categoryId: 'c-fmcg',
    packUnit: 'Carton of 48 Bars',
    genericName: 'Moisturizing Beauty Bar',
    mrpPrice: 3120.00,
    b2bPrice: 2652.00,
    stock: 120,
    minOrderQty: 1,
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15'
  },
  {
    id: 'p-wheel-detergent',
    name: 'Wheel 2-in-1 Washing Powder 500g',
    sku: 'FMCG-UN-02',
    brandId: 'b-uni',
    categoryId: 'c-fmcg',
    packUnit: 'Master Sack of 24 Packs',
    genericName: 'Enzyme Washing Formula',
    mrpPrice: 1920.00,
    b2bPrice: 1670.00,
    stock: 85,
    minOrderQty: 2,
    imageUrl: 'https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?w=600&auto=format&fit=crop&q=80',
    isFeatured: false,
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15'
  },
  {
    id: 'p-pran-mango',
    name: 'Pran Frooto Mango Drink 250ml',
    sku: 'FOOD-PR-01',
    brandId: 'b-pran',
    categoryId: 'c-food',
    packUnit: 'Shrink Tray of 24 Bottles',
    genericName: 'Real Pulp Mango Drink',
    mrpPrice: 720.00,
    b2bPrice: 612.00,
    stock: 240,
    minOrderQty: 3,
    imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-18',
    updatedAt: '2026-01-18'
  },
  {
    id: 'p-pran-toast',
    name: 'Pran Special Crispy Toast Biscuit',
    sku: 'FOOD-PR-02',
    brandId: 'b-pran',
    categoryId: 'c-food',
    packUnit: 'Carton of 36 Packets',
    genericName: 'Cardamom Oven Baked Toast',
    mrpPrice: 1080.00,
    b2bPrice: 918.00,
    stock: 190,
    minOrderQty: 2,
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',
    isFeatured: false,
    createdAt: '2026-01-18',
    updatedAt: '2026-01-18'
  },
  {
    id: 'p-aci-fertilizer',
    name: 'ACI Bio-Green Organic NPK Booster',
    sku: 'AGRO-AC-01',
    brandId: 'b-aci',
    categoryId: 'c-agro',
    packUnit: 'Bag of 25kg',
    genericName: 'Granulated Micro-Nutrient Plant Food',
    mrpPrice: 1450.00,
    b2bPrice: 1232.50,
    stock: 350,
    minOrderQty: 4,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20'
  },
  {
    id: 'p-nescafe-classic',
    name: 'Nescafe Classic Instant Coffee Jar 200g',
    sku: 'FOOD-NS-01',
    brandId: 'b-nes',
    categoryId: 'c-food',
    packUnit: 'Case of 12 Glass Jars',
    genericName: '100% Pure Dark Roasted Coffee',
    mrpPrice: 6600.00,
    b2bPrice: 5610.00,
    stock: 65,
    minOrderQty: 1,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    createdAt: '2026-01-22',
    updatedAt: '2026-01-22'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'BIS-8891',
    userId: 'u-retailer-1',
    user: INITIAL_USERS[1],
    routeId: 'r-shibchar',
    route: INITIAL_ROUTES[0],
    totalAmount: 1848.00,
    totalMrpAmount: 2200.00,
    status: 'RECEIVED',
    notes: 'Please pack in heavy cartons, rainy weather expected.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    items: [
      {
        id: 'oi-1',
        orderId: 'ord-1001',
        productId: 'p-ace-plus',
        product: INITIAL_PRODUCTS[0],
        quantity: 3,
        unitPrice: 420.00,
        subtotal: 1260.00
      },
      {
        id: 'oi-2',
        orderId: 'ord-1001',
        productId: 'p-telfast-120',
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        unitPrice: 382.50,
        subtotal: 382.50
      },
      {
        id: 'oi-3',
        orderId: 'ord-1001',
        productId: 'p-napa-extra',
        product: INITIAL_PRODUCTS[2],
        quantity: 2,
        unitPrice: 124.50,
        subtotal: 249.00
      }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'BIS-8890',
    userId: 'u-retailer-4',
    user: INITIAL_USERS[4],
    routeId: 'r-shibchar',
    route: INITIAL_ROUTES[0],
    totalAmount: 3660.00,
    totalMrpAmount: 4320.00,
    status: 'PROCESSING',
    notes: 'Urgent stock needed for clinic pharmacy.',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    items: [
      {
        id: 'oi-4',
        orderId: 'ord-1002',
        productId: 'p-seclo-20',
        product: INITIAL_PRODUCTS[1],
        quantity: 5,
        unitPrice: 504.00,
        subtotal: 2520.00
      },
      {
        id: 'oi-5',
        orderId: 'ord-1002',
        productId: 'p-pran-frooto',
        product: INITIAL_PRODUCTS[6],
        quantity: 2,
        unitPrice: 612.00,
        subtotal: 1224.00
      }
    ]
  },
  {
    id: 'ord-1003',
    orderNumber: 'BIS-8889',
    userId: 'u-retailer-1',
    user: INITIAL_USERS[1],
    routeId: 'r-shibchar',
    route: INITIAL_ROUTES[0],
    totalAmount: 2652.00,
    totalMrpAmount: 3120.00,
    status: 'DISPATCHED',
    notes: 'Gate delivery near Sonali Bank booth.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    items: [
      {
        id: 'oi-6',
        orderId: 'ord-1003',
        productId: 'p-lux-soap',
        product: INITIAL_PRODUCTS[4],
        quantity: 1,
        unitPrice: 2652.00,
        subtotal: 2652.00
      }
    ]
  }
];
