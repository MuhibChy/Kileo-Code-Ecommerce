import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    cartTotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    setActiveModal
  } = useEcommerce();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCouponCode(couponInput);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setActiveModal('checkout');
  };

  const freeShippingThreshold = 75;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={22} className="text-primary" />
            <h3 className="drawer-heading">Your Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>
          </div>
          <button 
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="shipping-progress-box">
          <div className="shipping-progress-text">
            <Truck size={16} />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-success font-semibold">You unlocked FREE Express Shipping! 🎉</span>
            ) : (
              <span>
                Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more for <strong>FREE Shipping</strong>
              </span>
            )}
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${progressToFreeShipping}%` }} 
            />
          </div>
        </div>

        {/* Cart Items or Empty View */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-icon-circle">
                <ShoppingBag size={48} />
              </div>
              <h4>Your Cart is Empty</h4>
              <p>Looks like you haven't added any products to your cart yet.</p>
              <button 
                className="start-shopping-btn"
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item-row">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="cart-item-thumb" 
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-vendor">by {product.vendorName}</div>
                    <div className="cart-item-title">{product.name}</div>
                    <div className="cart-item-price">${product.price.toFixed(2)}</div>
                    
                    <div className="cart-item-actions">
                      <div className="cart-qty-pill">
                        <button 
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="cart-qty-number">{quantity}</span>
                        <button 
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button 
                        className="cart-item-delete-btn"
                        onClick={() => removeFromCart(product.id)}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations and Checkout */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Coupon Code Section */}
            <div className="cart-coupon-block">
              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <div className="coupon-pill-left">
                    <Tag size={15} />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong> ({appliedCoupon.description})</span>
                  </div>
                  <button className="remove-coupon-btn" onClick={removeCoupon}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form className="coupon-form" onSubmit={handleApplyCoupon}>
                  <input
                    type="text"
                    placeholder="Enter promo code (e.g. KILEO20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  />
                  <button type="submit" className="apply-coupon-btn">Apply</button>
                </form>
              )}
              {/* Quick coupons suggestions */}
              {!appliedCoupon && (
                <div className="quick-coupon-tags">
                  <span className="quick-coupon-label">Try:</span>
                  <button type="button" onClick={() => applyCouponCode('KILEO20')}>KILEO20 (-20%)</button>
                  <button type="button" onClick={() => applyCouponCode('WELCOME10')}>WELCOME10 (-10%)</button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="cart-totals-summary">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="total-row discount-row">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row">
                <span>Estimated Shipping</span>
                <span>{shippingCost === 0 ? <strong className="text-success">FREE</strong> : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="total-row">
                <span>Sales Tax (8%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="total-row final-total-row">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button 
              className="checkout-cta-btn"
              onClick={handleProceedCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
