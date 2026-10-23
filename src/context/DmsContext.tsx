import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ShopProfile,
  Brand,
  Category,
  B2BProduct,
  MarketRoute,
  WholesaleOrder,
  OrderItem,
  CartItem,
  OrderStatus,
  PaymentMethod,
  BusinessSector
} from '../types/index.ts';
import {
  INITIAL_BRANDS,
  INITIAL_CATEGORIES,
  INITIAL_ROUTES,
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS
} from '../data/mockData.ts';
import { canAccessB2BPricing, calculateOrderTotals, getEffectiveTierPrice } from '../utils/pricing.ts';
import { soundManager } from '../utils/audioAlarm.ts';

interface DmsContextType {
  currentUser: ShopProfile | null;
  currentShop: ShopProfile | null;
  users: ShopProfile[];
  shops: ShopProfile[];
  products: B2BProduct[];
  brands: Brand[];
  categories: Category[];
  routes: MarketRoute[];
  orders: WholesaleOrder[];
  cart: CartItem[];
  currency: string;
  isSoundMuted: boolean;
  unacknowledgedOrdersCount: number;
  unseenOrdersCount: number;
  
  // Role & Admin Access
  activeRole: 'CLIENT' | 'ADMIN';
  isAdminAuthenticated: boolean;
  setActiveRole: (role: 'CLIENT' | 'ADMIN') => void;
  adminLogin: (pinOrPass: string) => boolean;
  adminLogout: () => void;
  setCurrentUser: (shop: ShopProfile | null) => void;
  setCurrentShop: (shop: ShopProfile | null) => void;

  // Shop Onboarding & Approval Gating
  registerShop: (data: {
    shopName: string;
    ownerName: string;
    phone: string;
    businessSector: BusinessSector;
    routeId: string;
    tradeLicenseNo?: string;
  }) => ShopProfile;
  approveShop: (shopId: string, validityDays?: number) => void;
  rejectShop: (shopId: string) => void;
  setShopExpiry: (shopId: string, expiryEpochMs: number | null) => void;
  adjustCreditLimit: (shopId: string, newLimitBdt: number) => void;
  recordCreditPayment: (shopId: string, amountPaidBdt: number) => void;

  // Catalog & Inventory
  addProduct: (product: Omit<B2BProduct, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<B2BProduct>) => void;
  deleteProduct: (id: string) => void;

  // Routes
  addRoute: (route: Omit<MarketRoute, 'id' | 'createdAt'>) => void;
  updateRoute: (id: string, updates: Partial<MarketRoute>) => void;
  deleteRoute: (id: string) => void;

  // Cart & Wholesale Checkout
  addToCart: (product: B2BProduct, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (options: {
    notes?: string;
    paymentMethod: PaymentMethod;
    paidAmountBdt?: number;
    paymentTrxId?: string;
    paymentSenderPhone?: string;
  }) => { success: boolean; order?: WholesaleOrder; error?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  acknowledgeOrderAlarm: (orderId?: string) => void;
  clearUnseenOrders: () => void;
  
  // UI & System
  toggleSoundMute: () => void;
  triggerTestAlarm: () => void;
  resetDemoData: () => void;
}

const DmsContext = createContext<DmsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SHOPS: 'bistar_shops_v2',
  PRODUCTS: 'bistar_products_v2',
  ROUTES: 'bistar_routes_v2',
  ORDERS: 'bistar_orders_v2',
  CURRENT_SHOP_ID: 'bistar_current_shop_id_v2',
  ACTIVE_ROLE: 'bistar_active_role_v2',
  ADMIN_AUTH: 'bistar_admin_auth_v2',
  MUTED: 'bistar_muted_v2'
};

export const DmsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shops, setShops] = useState<ShopProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SHOPS);
      return stored ? JSON.parse(stored) : INITIAL_SHOPS;
    } catch {
      return INITIAL_SHOPS;
    }
  });

  const [products, setProducts] = useState<B2BProduct[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [routes, setRoutes] = useState<MarketRoute[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROUTES);
      return stored ? JSON.parse(stored) : INITIAL_ROUTES;
    } catch {
      return INITIAL_ROUTES;
    }
  });

  const [orders, setOrders] = useState<WholesaleOrder[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [brands] = useState<Brand[]>(INITIAL_BRANDS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [currentShopId, setCurrentShopId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_SHOP_ID) || 'u-retailer-1';
    } catch {
      return 'u-retailer-1';
    }
  });

  const [activeRole, setActiveRoleState] = useState<'CLIENT' | 'ADMIN'>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as 'CLIENT' | 'ADMIN') || 'CLIENT';
    } catch {
      return 'CLIENT';
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const currency = '৳'; // 100% Bangladeshi Taka (৳ BDT)

  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
    } catch {
      return false;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
    } catch (e) {
      console.warn('Failed to save shops', e);
    }
  }, [shops]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
    } catch (e) {
      console.warn('Failed to save routes', e);
    }
  }, [routes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (currentShopId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SHOP_ID, currentShopId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SHOP_ID);
      }
    } catch (e) {
      console.warn('Failed to save current shop id', e);
    }
  }, [currentShopId]);

  const currentShop = shops.find(s => s.id === currentShopId) || null;
  const currentUser = currentShop;

  // Unacknowledged orders count (triggers loud alarm)
  const unacknowledgedOrders = orders.filter(
    o => o.orderStatus === 'NEW_ALARM' && !o.alarmAcknowledged
  );
  const unacknowledgedOrdersCount = unacknowledgedOrders.length;
  const unseenOrdersCount = unacknowledgedOrdersCount;

  // Auto sound alarm when unacknowledged order exists in Admin mode
  useEffect(() => {
    if (activeRole === 'ADMIN' && unacknowledgedOrdersCount > 0 && !isSoundMuted) {
      soundManager.playNewOrderAlarm();
    }
  }, [activeRole, unacknowledgedOrdersCount, isSoundMuted]);

  const setActiveRole = (role: 'CLIENT' | 'ADMIN') => {
    setActiveRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  };

  const adminLogin = (pinOrPass: string): boolean => {
    const clean = pinOrPass.trim().toLowerCase();
    // Valid admin credentials: PIN 1234, admin123, admin
    if (clean === '1234' || clean === 'admin' || clean === 'admin123' || clean === 'bistar') {
      setIsAdminAuthenticated(true);
      setActiveRole('ADMIN');
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'ADMIN');
      const adminShop = shops.find(s => s.role === 'SUPER_ADMIN');
      if (adminShop) {
        setCurrentShopId(adminShop.id);
      }
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setActiveRole('CLIENT');
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'CLIENT');
    // Switch to first approved retailer
    const approvedShop = shops.find(s => s.role === 'B2B_CLIENT' && s.status === 'APPROVED');
    setCurrentShopId(approvedShop ? approvedShop.id : null);
  };

  const setCurrentShop = (shop: ShopProfile | null) => {
    setCurrentShopId(shop ? shop.id : null);
  };

  const setCurrentUser = setCurrentShop;

  // Shop Onboarding
  const registerShop = (data: {
    shopName: string;
    ownerName: string;
    phone: string;
    businessSector: BusinessSector;
    routeId: string;
    tradeLicenseNo?: string;
  }): ShopProfile => {
    const route = routes.find(r => r.id === data.routeId) || routes[0];
    const newShop: ShopProfile = {
      id: `u-${Date.now()}`,
      userId: `uid-${Date.now()}`,
      shopName: data.shopName.trim(),
      ownerName: data.ownerName.trim(),
      phone: data.phone.trim(),
      businessSector: data.businessSector,
      tradeLicenseNo: data.tradeLicenseNo?.trim() || undefined,
      routeId: route.id,
      routeName: route.routeName,
      role: 'B2B_CLIENT',
      status: 'PENDING',
      validityExpiryEpochMs: null,
      creditLimitBdt: 30000, // Initial default credit limit ৳30,000
      currentDueBdt: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setShops(prev => [newShop, ...prev]);
    setCurrentShopId(newShop.id);
    return newShop;
  };

  const approveShop = (shopId: string, validityDays: number = 365) => {
    const expiryEpochMs = Date.now() + validityDays * 24 * 60 * 60 * 1000;
    setShops(prev =>
      prev.map(s =>
        s.id === shopId
          ? {
              ...s,
              status: 'APPROVED',
              validityExpiryEpochMs: expiryEpochMs,
              updatedAt: new Date().toISOString()
            }
          : s
      )
    );
  };

  const rejectShop = (shopId: string) => {
    setShops(prev =>
      prev.map(s =>
        s.id === shopId
          ? { ...s, status: 'REJECTED', updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  const setShopExpiry = (shopId: string, expiryEpochMs: number | null) => {
    setShops(prev =>
      prev.map(s =>
        s.id === shopId
          ? { ...s, validityExpiryEpochMs: expiryEpochMs, updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  const adjustCreditLimit = (shopId: string, newLimitBdt: number) => {
    setShops(prev =>
      prev.map(s =>
        s.id === shopId
          ? { ...s, creditLimitBdt: Math.max(0, newLimitBdt), updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  const recordCreditPayment = (shopId: string, amountPaidBdt: number) => {
    setShops(prev =>
      prev.map(s =>
        s.id === shopId
          ? { ...s, currentDueBdt: Math.max(0, s.currentDueBdt - amountPaidBdt), updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  // Catalog
  const addProduct = (prodData: Omit<B2BProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProd: B2BProduct = {
      ...prodData,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<B2BProduct>) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Routes
  const addRoute = (routeData: Omit<MarketRoute, 'id' | 'createdAt'>) => {
    const newRoute: MarketRoute = {
      ...routeData,
      id: `r-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRoutes(prev => [...prev, newRoute]);
  };

  const updateRoute = (id: string, updates: Partial<MarketRoute>) => {
    setRoutes(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  };

  // Cart
  const addToCart = (product: B2BProduct, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity: Math.max(product.minOrderQty || 1, quantity) }];
    });
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Place Order with Payment Method, Credit Ledger Validation & Mobile Banking
  const placeOrder = (options: {
    notes?: string;
    paymentMethod: PaymentMethod;
    paidAmountBdt?: number;
    paymentTrxId?: string;
    paymentSenderPhone?: string;
  }): { success: boolean; order?: WholesaleOrder; error?: string } => {
    if (!currentShop || cart.length === 0) {
      return { success: false, error: 'কার্ট খালি অথবা দোকান প্রোফাইল অনুপস্থিত।' };
    }

    const access = canAccessB2BPricing(currentShop);
    const isApproved = access.allowed;
    const totals = calculateOrderTotals(cart, isApproved);

    // Credit Ledger (বাকি খাতা) validation
    if (options.paymentMethod === 'CREDIT_LEDGER') {
      const newPotentialDue = currentShop.currentDueBdt + totals.totalB2B;
      if (newPotentialDue > currentShop.creditLimitBdt) {
        const availableCredit = Math.max(0, currentShop.creditLimitBdt - currentShop.currentDueBdt);
        return {
          success: false,
          error: `ক্রেডিট সীমা অতিক্রম করেছে! অনুমোদিত বাকি সীমা: ৳${currentShop.creditLimitBdt.toLocaleString()} | বর্তমান বাকি: ৳${currentShop.currentDueBdt.toLocaleString()} | উপলব্ধ ক্রেডিট: ৳${availableCredit.toLocaleString()}`
        };
      }
    }

    const invoiceNumber = `BIS-${Math.floor(1000 + Math.random() * 9000)}`;
    const shopRoute = routes.find(r => r.id === currentShop.routeId) || routes[0];

    const orderItems: OrderItem[] = cart.map((ci, idx) => {
      const tierResult = getEffectiveTierPrice(ci.product, ci.quantity, isApproved);
      return {
        id: `oi-${Date.now()}-${idx}`,
        orderId: `ord-${Date.now()}`,
        productId: ci.product.id,
        product: ci.product,
        quantity: ci.quantity,
        unitPrice: tierResult.unitPrice,
        mrpPrice: ci.product.mrpBdt || ci.product.mrpPrice || 0,
        subtotal: tierResult.unitPrice * ci.quantity,
        tierApplied: tierResult.tier
      };
    });

    const isFullPaid = options.paymentMethod === 'BKASH' || options.paymentMethod === 'NAGAD' || options.paymentMethod === 'ROCKET';
    const paidAmount = options.paidAmountBdt !== undefined ? options.paidAmountBdt : (isFullPaid ? totals.totalB2B : 0);
    const dueAmount = Math.max(0, totals.totalB2B - paidAmount);

    const newOrder: WholesaleOrder = {
      id: `ord-${Date.now()}`,
      invoiceNumber,
      userId: currentShop.userId,
      shopId: currentShop.id,
      shopName: currentShop.shopName,
      ownerName: currentShop.ownerName,
      shopPhone: currentShop.phone,
      routeId: currentShop.routeId || shopRoute.id,
      routeName: shopRoute.routeName,
      deliveryScheduleLabel: `${shopRoute.deliveryDays} (Cutoff: ${shopRoute.cutoffTime})`,
      totalCartons: totals.totalQuantity,
      subtotalMrpBdt: totals.totalMrp,
      totalWholesaleBdt: totals.totalB2B,
      totalSavingsBdt: totals.retailerSavings,
      paymentMethod: options.paymentMethod,
      paidAmountBdt: paidAmount,
      dueAmountBdt: dueAmount,
      paymentTrxId: options.paymentTrxId,
      paymentSenderPhone: options.paymentSenderPhone,
      orderStatus: 'NEW_ALARM', // Triggers loud order alarm
      alarmAcknowledged: false,
      notes: options.notes,
      items: orderItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // If Credit Ledger or partial COD with due, update shop's current due in ledger
    if (options.paymentMethod === 'CREDIT_LEDGER' || dueAmount > 0) {
      setShops(prev =>
        prev.map(s =>
          s.id === currentShop.id
            ? { ...s, currentDueBdt: s.currentDueBdt + dueAmount }
            : s
        )
      );
    }

    clearCart();

    // Trigger audible alarm and success sounds
    soundManager.playSuccessChime();
    soundManager.playNewOrderAlarm();

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  const acknowledgeOrderAlarm = (orderId?: string) => {
    setOrders(prev =>
      prev.map(o =>
        !orderId || o.id === orderId
          ? { ...o, alarmAcknowledged: true, orderStatus: o.orderStatus === 'NEW_ALARM' ? 'CONFIRMED' : o.orderStatus }
          : o
      )
    );
  };

  const toggleSoundMute = () => {
    setIsSoundMuted(prev => {
      const next = !prev;
      soundManager.setMuted(next);
      localStorage.setItem(STORAGE_KEYS.MUTED, String(next));
      return next;
    });
  };

  const triggerTestAlarm = () => {
    soundManager.playNewOrderAlarm();
  };

  const resetDemoData = () => {
    setShops(INITIAL_SHOPS);
    setProducts(INITIAL_PRODUCTS);
    setRoutes(INITIAL_ROUTES);
    setOrders(INITIAL_ORDERS);
    setCurrentShopId('u-retailer-1');
    setActiveRole('CLIENT');
    setIsAdminAuthenticated(false);
    setCart([]);
    localStorage.clear();
  };

  return (
    <DmsContext.Provider
      value={{
        currentUser,
        currentShop,
        users: shops,
        shops,
        products,
        brands,
        categories,
        routes,
        orders,
        cart,
        currency,
        isSoundMuted,
        unacknowledgedOrdersCount,
        unseenOrdersCount,
        activeRole,
        isAdminAuthenticated,
        setActiveRole,
        adminLogin,
        adminLogout,
        setCurrentUser,
        setCurrentShop,
        registerShop,
        approveShop,
        rejectShop,
        setShopExpiry,
        adjustCreditLimit,
        recordCreditPayment,
        addProduct,
        updateProduct,
        deleteProduct,
        addRoute,
        updateRoute,
        deleteRoute,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        placeOrder,
        updateOrderStatus,
        acknowledgeOrderAlarm,
        clearUnseenOrders: () => acknowledgeOrderAlarm(),
        toggleSoundMute,
        triggerTestAlarm,
        resetDemoData
      }}
    >
      {children}
    </DmsContext.Provider>
  );
};

export const useDms = () => {
  const context = useContext(DmsContext);
  if (!context) {
    throw new Error('useDms must be used within a DmsProvider');
  }
  return context;
};
