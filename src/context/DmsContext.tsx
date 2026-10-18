import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Brand,
  Category,
  Product,
  DeliveryRoute,
  Order,
  OrderItem,
  CartItem,
  OrderStatus
} from '../types/index.ts';
import {
  INITIAL_BRANDS,
  INITIAL_CATEGORIES,
  INITIAL_ROUTES,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS
} from '../data/mockData.ts';
import { canAccessB2BPricing, calculateOrderTotals } from '../utils/pricing.ts';
import { soundManager } from '../utils/audioAlarm.ts';

interface DmsContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  brands: Brand[];
  categories: Category[];
  routes: DeliveryRoute[];
  orders: Order[];
  cart: CartItem[];
  currency: string;
  isSoundMuted: boolean;
  unseenOrdersCount: number;
  
  // Auth & Roles
  setCurrentUser: (user: User | null) => void;
  loginByPhone: (phone: string) => boolean;
  registerClient: (data: { phone: string; ownerName: string; shopName: string; routeId: string }) => User;
  approveClient: (userId: string, expiryMonths?: number) => void;
  suspendClient: (userId: string) => void;
  updateClientValidity: (userId: string, expiresAt: string | null) => void;

  // Catalog & Inventory
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addRoute: (route: Omit<DeliveryRoute, 'id' | 'createdAt'>) => void;
  updateRoute: (id: string, updates: Partial<DeliveryRoute>) => void;
  deleteRoute: (id: string) => void;

  // Cart & Orders
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (notes?: string) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // UI & System
  setCurrency: (c: string) => void;
  toggleSoundMute: () => void;
  triggerTestAlarm: () => void;
  clearUnseenOrders: () => void;
  resetDemoData: () => void;
}

const DmsContext = createContext<DmsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'bistar_users_v1',
  PRODUCTS: 'bistar_products_v1',
  ROUTES: 'bistar_routes_v1',
  ORDERS: 'bistar_orders_v1',
  CURRENT_USER_ID: 'bistar_current_user_id_v1',
  CURRENCY: 'bistar_currency_v1',
  MUTED: 'bistar_muted_v1'
};

export const DmsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with localStorage fallbacks
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [routes, setRoutes] = useState<DeliveryRoute[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROUTES);
      return stored ? JSON.parse(stored) : INITIAL_ROUTES;
    } catch {
      return INITIAL_ROUTES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [brands] = useState<Brand[]>(INITIAL_BRANDS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'u-retailer-1';
    } catch {
      return 'u-retailer-1';
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrencyState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENCY) || '$';
    } catch {
      return '$';
    }
  });

  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
    } catch {
      return false;
    }
  });

  const [unseenOrdersCount, setUnseenOrdersCount] = useState<number>(0);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save users', e);
    }
  }, [users]);

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
      if (currentUserId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }
    } catch (e) {
      console.warn('Failed to save current user id', e);
    }
  }, [currentUserId]);

  const currentUser = users.find(u => u.id === currentUserId) || null;

  const setCurrentUser = (user: User | null) => {
    setCurrentUserId(user ? user.id : null);
  };

  const loginByPhone = (phone: string): boolean => {
    const found = users.find(u => u.phone.trim() === phone.trim());
    if (found) {
      setCurrentUserId(found.id);
      return true;
    }
    return false;
  };

  const registerClient = (data: {
    phone: string;
    ownerName: string;
    shopName: string;
    routeId: string;
  }): User => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      phone: data.phone.trim(),
      ownerName: data.ownerName.trim(),
      shopName: data.shopName.trim(),
      role: 'B2B_CLIENT',
      status: 'PENDING',
      accessExpires: null,
      routeId: data.routeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return newUser;
  };

  const approveClient = (userId: string, expiryMonths: number = 12) => {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + expiryMonths);

    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? {
              ...u,
              status: 'APPROVED',
              accessExpires: expiry.toISOString(),
              updatedAt: new Date().toISOString()
            }
          : u
      )
    );
  };

  const suspendClient = (userId: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, status: 'SUSPENDED', updatedAt: new Date().toISOString() }
          : u
      )
    );
  };

  const updateClientValidity = (userId: string, expiresAt: string | null) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, accessExpires: expiresAt, updatedAt: new Date().toISOString() }
          : u
      )
    );
  };

  // Catalog
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProd: Product = {
      ...prodData,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
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
  const addRoute = (routeData: Omit<DeliveryRoute, 'id' | 'createdAt'>) => {
    const newRoute: DeliveryRoute = {
      ...routeData,
      id: `r-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRoutes(prev => [...prev, newRoute]);
  };

  const updateRoute = (id: string, updates: Partial<DeliveryRoute>) => {
    setRoutes(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  };

  // Cart
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity: Math.max(product.minOrderQty, quantity) }];
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

  // Place Order
  const placeOrder = (notes?: string): Order | null => {
    if (!currentUser || cart.length === 0) return null;

    const access = canAccessB2BPricing(currentUser);
    const isApproved = access.allowed;
    const totals = calculateOrderTotals(cart, isApproved);

    const orderNumber = `BIS-${Math.floor(1000 + Math.random() * 9000)}`;
    const userRoute = routes.find(r => r.id === currentUser.routeId) || routes[0];

    const orderItems: OrderItem[] = cart.map((ci, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      orderId: `ord-${Date.now()}`,
      productId: ci.product.id,
      product: ci.product,
      quantity: ci.quantity,
      unitPrice: isApproved ? ci.product.b2bPrice : ci.product.mrpPrice,
      subtotal: (isApproved ? ci.product.b2bPrice : ci.product.mrpPrice) * ci.quantity
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser.id,
      user: currentUser,
      routeId: currentUser.routeId || userRoute?.id || null,
      route: userRoute,
      totalAmount: totals.totalB2B,
      totalMrpAmount: totals.totalMrp,
      status: 'RECEIVED',
      items: orderItems,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Play sounds
    soundManager.playSuccessChime();
    soundManager.playNewOrderAlarm();
    setUnseenOrdersCount(prev => prev + 1);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
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

  const clearUnseenOrders = () => {
    setUnseenOrdersCount(0);
  };

  const resetDemoData = () => {
    setUsers(INITIAL_USERS);
    setProducts(INITIAL_PRODUCTS);
    setRoutes(INITIAL_ROUTES);
    setOrders(INITIAL_ORDERS);
    setCurrentUserId('u-retailer-1');
    setCart([]);
    setUnseenOrdersCount(0);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ROUTES);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  };

  return (
    <DmsContext.Provider
      value={{
        currentUser,
        users,
        products,
        brands,
        categories,
        routes,
        orders,
        cart,
        currency,
        isSoundMuted,
        unseenOrdersCount,
        setCurrentUser,
        loginByPhone,
        registerClient,
        approveClient,
        suspendClient,
        updateClientValidity,
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
        setCurrency,
        toggleSoundMute,
        triggerTestAlarm,
        clearUnseenOrders,
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
