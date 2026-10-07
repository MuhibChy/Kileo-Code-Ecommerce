import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getApiConfig, saveApiConfig } from '../services/api';

const EcommerceContext = createContext(null);

export const EcommerceProvider = ({ children }) => {
  // Products & Categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Cart & Wishlist with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kileo_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('kileo_wishlist_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'product' | 'checkout' | 'auth' | 'vendors' | 'api' | 'docs' | 'order-success'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kileo_user_v1');
      return saved ? JSON.parse(saved) : { name: 'Demo Guest', email: 'guest@kileo.com', role: 'customer' };
    } catch {
      return { name: 'Demo Guest', email: 'guest@kileo.com', role: 'customer' };
    }
  });

  // API Config
  const [apiConfig, setApiConfigState] = useState(getApiConfig());

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kileo_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart', e);
    }
  }, [cart]);

  // Sync Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kileo_wishlist_v1', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist', e);
    }
  }, [wishlist]);

  // Load initial data
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [prodList, catList, venList, banList] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getVendors(),
          api.getBanners()
        ]);
        setProducts(prodList);
        setCategories(catList);
        setVendors(venList);
        setBanners(banList);
      } catch (err) {
        console.error('Failed to initialize store data', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [apiConfig.mode]);

  // Cart Operations
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to your cart!`);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.fixedDiscount) {
      discountAmount = appliedCoupon.fixedDiscount;
    }
  }

  const shippingCost =
    appliedCoupon?.freeShipping || cartSubtotal > 75 || cartSubtotal === 0 ? 0 : 9.99;
  const taxAmount = (cartSubtotal - discountAmount) > 0 ? (cartSubtotal - discountAmount) * 0.08 : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost + taxAmount);

  // Coupon Application
  const applyCouponCode = async (code) => {
    try {
      const coupon = await api.validateCoupon(code);
      if (coupon.minSpend && cartSubtotal < coupon.minSpend) {
        throw new Error(`This coupon requires a minimum subtotal of $${coupon.minSpend}`);
      }
      setAppliedCoupon(coupon);
      showToast(`Coupon "${coupon.code}" applied successfully!`);
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist Operations
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Added "${product.name}" to wishlist!`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  // API Config Update
  const updateApiConfig = (newConfig) => {
    saveApiConfig(newConfig);
    setApiConfigState(newConfig);
    showToast(`Switched API mode to ${newConfig.mode.toUpperCase()}`);
  };

  return (
    <EcommerceContext.Provider
      value={{
        products,
        categories,
        vendors,
        banners,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedVendor,
        setSelectedVendor,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        discountAmount,
        shippingCost,
        taxAmount,
        cartTotal,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        activeModal,
        setActiveModal,
        selectedProduct,
        setSelectedProduct,
        lastOrder,
        setLastOrder,
        currentUser,
        setCurrentUser,
        apiConfig,
        updateApiConfig,
        toast,
        showToast
      }}
    >
      {children}
    </EcommerceContext.Provider>
  );
};

export const useEcommerce = () => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};
