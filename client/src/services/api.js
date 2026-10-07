import { mockProducts, mockCategories, mockVendors, mockBanners, mockCoupons, mockReviews } from '../data/mockData';

const STORAGE_KEYS = {
  CART: 'kileo_cart_v1',
  WISHLIST: 'kileo_wishlist_v1',
  ORDERS: 'kileo_orders_v1',
  USER: 'kileo_user_v1',
  REVIEWS: 'kileo_reviews_v1',
  API_CONFIG: 'kileo_api_config_v1'
};

// Default API Config
export const getApiConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.API_CONFIG);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to parse API config', e);
  }
  return {
    mode: 'static', // 'static' (default for GitHub Pages) or 'live'
    baseUrl: 'http://localhost:5000',
    status: 'online'
  };
};

export const saveApiConfig = (config) => {
  localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(config));
};

export const api = {
  // Products
  getProducts: async () => {
    const config = getApiConfig();
    if (config.mode === 'live') {
      try {
        const res = await fetch(`${config.baseUrl}/api/products`);
        if (res.ok) {
          const json = await res.json();
          return json.data || json;
        }
      } catch (err) {
        console.warn('Live API request failed, falling back to static demo mode:', err.message);
      }
    }
    return mockProducts;
  },

  getProductById: async (id) => {
    const config = getApiConfig();
    if (config.mode === 'live') {
      try {
        const res = await fetch(`${config.baseUrl}/api/products/${id}`);
        if (res.ok) {
          const json = await res.json();
          return json.data || json;
        }
      } catch (err) {
        console.warn('Live API request failed for product:', err.message);
      }
    }
    return mockProducts.find(p => p.id === id || p.slug === id) || null;
  },

  // Categories
  getCategories: async () => mockCategories,

  // Vendors
  getVendors: async () => mockVendors,

  // Banners
  getBanners: async () => mockBanners,

  // Reviews
  getProductReviews: async (productId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const allReviews = stored ? JSON.parse(stored) : mockReviews;
      return allReviews[productId] || [];
    } catch (e) {
      return mockReviews[productId] || [];
    }
  },

  addReview: async (productId, reviewData) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const allReviews = stored ? JSON.parse(stored) : { ...mockReviews };
      if (!allReviews[productId]) allReviews[productId] = [];
      const newReview = {
        id: 'rev_' + Date.now(),
        date: 'Just now',
        verified: true,
        ...reviewData
      };
      allReviews[productId].unshift(newReview);
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));
      return newReview;
    } catch (e) {
      console.error('Failed to save review', e);
      return null;
    }
  },

  // Coupons
  validateCoupon: async (code) => {
    const upper = code.trim().toUpperCase();
    const found = mockCoupons.find(c => c.code === upper);
    if (!found) {
      throw new Error(`Promo code "${upper}" is not valid or has expired.`);
    }
    return found;
  },

  // Orders
  createOrder: async (orderData) => {
    const config = getApiConfig();
    const newOrder = {
      id: 'KIL-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'Processing',
      ...orderData
    };

    if (config.mode === 'live') {
      try {
        const res = await fetch(`${config.baseUrl}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        });
        if (res.ok) {
          const json = await res.json();
          return json.data || json;
        }
      } catch (err) {
        console.warn('Live API order creation failed, persisting locally:', err.message);
      }
    }

    // Persist in localStorage
    try {
      const savedOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      savedOrders.unshift(newOrder);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(savedOrders));
    } catch (e) {
      console.warn('Could not persist order to local storage', e);
    }
    return newOrder;
  },

  getOrders: async () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    } catch (e) {
      return [];
    }
  },

  // Ping Backend Server
  testBackendConnection: async (url) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${url}/api/products`, { signal: controller.signal });
      clearTimeout(timeoutId);
      return { ok: res.ok, status: res.status };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }
};
