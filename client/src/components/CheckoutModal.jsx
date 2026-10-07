import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  CreditCard, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  ShoppingBag,
  ExternalLink,
  PackageCheck
} from 'lucide-react';

export const CheckoutModal = () => {
  const {
    activeModal,
    setActiveModal,
    cart,
    cartSubtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    cartTotal,
    clearCart,
    showToast,
    lastOrder,
    setLastOrder,
    currentUser
  } = useEcommerce();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Method, 3: Payment, 4: Success
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || 'Marcus Miller',
    email: currentUser?.email || 'marcus@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zip: '97477',
    country: 'United States',
    shippingSpeed: 'standard', // 'standard' | 'express'
    paymentMethod: 'stripe', // 'stripe' | 'paypal' | 'razorpay' | 'cod'
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (activeModal !== 'checkout') return null;

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinalizeOrder();
    }
  };

  const handleFinalizeOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`
        },
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          vendor: item.product.vendorName,
          image: item.product.images[0]
        })),
        pricing: {
          subtotal: cartSubtotal,
          discount: discountAmount,
          shipping: shippingCost,
          tax: taxAmount,
          total: cartTotal
        },
        shippingSpeed: formData.shippingSpeed,
        paymentMethod: formData.paymentMethod.toUpperCase()
      };

      const completedOrder = await api.createOrder(orderData);
      setLastOrder(completedOrder);
      clearCart();
      setStep(4);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }
      showToast('Order placed successfully!');
    } catch (err) {
      showToast('Order processing failed: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-dialog checkout-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button 
          className="modal-close-icon-btn" 
          onClick={() => setActiveModal(null)}
          aria-label="Close Checkout"
        >
          <X size={20} />
        </button>

        {step < 4 && (
          <div className="checkout-steps-nav">
            <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <span className="step-num">{step > 1 ? <Check size={14} /> : '1'}</span>
              <span className="step-label">Shipping</span>
            </div>
            <div className="step-connector" />
            <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <span className="step-num">{step > 2 ? <Check size={14} /> : '2'}</span>
              <span className="step-label">Delivery</span>
            </div>
            <div className="step-connector" />
            <div className={`step-node ${step >= 3 ? 'active' : ''}`}>
              <span className="step-num">3</span>
              <span className="step-label">Payment</span>
            </div>
          </div>
        )}

        {/* Step 1: Shipping Address */}
        {step === 1 && (
          <form className="checkout-form-step" onSubmit={handleNextStep}>
            <div className="step-header">
              <MapPin className="text-primary" size={24} />
              <div>
                <h3>Delivery Address</h3>
                <p>Where should we deliver your order?</p>
              </div>
            </div>

            <div className="form-fields-grid">
              <div className="field-group span-2">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="field-group span-2">
                <label>Street Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>State / Province *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>ZIP / Postal Code *</label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>Country *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>

            <div className="step-actions-footer">
              <span className="summary-total-preview">Total: <strong>${cartTotal.toFixed(2)}</strong></span>
              <button type="submit" className="step-next-btn">
                <span>Continue to Delivery</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Shipping Method */}
        {step === 2 && (
          <form className="checkout-form-step" onSubmit={handleNextStep}>
            <div className="step-header">
              <Truck className="text-primary" size={24} />
              <div>
                <h3>Select Delivery Method</h3>
                <p>Choose your preferred courier shipping speed</p>
              </div>
            </div>

            <div className="shipping-options-list">
              <label className={`option-card ${formData.shippingSpeed === 'standard' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="shippingSpeed"
                  value="standard"
                  checked={formData.shippingSpeed === 'standard'}
                  onChange={() => setFormData({ ...formData, shippingSpeed: 'standard' })}
                />
                <div className="option-info">
                  <span className="option-title">Standard Courier Delivery (3 - 5 Business Days)</span>
                  <span className="option-sub">Tracked delivery by DHL Express / FedEx</span>
                </div>
                <span className="option-price font-semibold">{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </label>

              <label className={`option-card ${formData.shippingSpeed === 'express' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="shippingSpeed"
                  value="express"
                  checked={formData.shippingSpeed === 'express'}
                  onChange={() => setFormData({ ...formData, shippingSpeed: 'express' })}
                />
                <div className="option-info">
                  <span className="option-title">Priority Air Courier (1 - 2 Business Days)</span>
                  <span className="option-sub">Direct temperature-controlled next-day flight routing</span>
                </div>
                <span className="option-price font-semibold">$14.99</span>
              </label>
            </div>

            <div className="step-actions-footer">
              <button type="button" className="step-back-btn" onClick={() => setStep(1)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button type="submit" className="step-next-btn">
                <span>Continue to Payment</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Payment Method */}
        {step === 3 && (
          <form className="checkout-form-step" onSubmit={handleNextStep}>
            <div className="step-header">
              <CreditCard className="text-primary" size={24} />
              <div>
                <h3>Select Payment Gateway</h3>
                <p>Choose how you would like to pay</p>
              </div>
            </div>

            <div className="payment-options-grid">
              <label className={`payment-pill ${formData.paymentMethod === 'stripe' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={formData.paymentMethod === 'stripe'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'stripe' })}
                />
                <span>Credit / Debit Card (Stripe)</span>
              </label>

              <label className={`payment-pill ${formData.paymentMethod === 'paypal' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                />
                <span>PayPal Express</span>
              </label>

              <label className={`payment-pill ${formData.paymentMethod === 'razorpay' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={formData.paymentMethod === 'razorpay'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'razorpay' })}
                />
                <span>Razorpay / UPI</span>
              </label>

              <label className={`payment-pill ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                />
                <span>Cash on Delivery (COD)</span>
              </label>
            </div>

            {/* Mock Credit Card Fields if Stripe selected */}
            {formData.paymentMethod === 'stripe' && (
              <div className="credit-card-fields-box">
                <div className="field-group span-2">
                  <label>Card Number</label>
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    placeholder="16-digit card number"
                  />
                </div>
                <div className="card-sub-fields">
                  <div className="field-group">
                    <label>Expires</label>
                    <input type="text" defaultValue="08/29" placeholder="MM/YY" />
                  </div>
                  <div className="field-group">
                    <label>CVC / CVV</label>
                    <input type="text" defaultValue="888" placeholder="CVC" />
                  </div>
                </div>
                <div className="card-security-badge">
                  <ShieldCheck size={16} />
                  <span>256-bit TLS End-to-End Encryption</span>
                </div>
              </div>
            )}

            {/* Order Final Summary */}
            <div className="checkout-final-summary-card">
              <div className="summary-line">
                <span>Items Subtotal:</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-line discount">
                  <span>Promo Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="summary-line grand-total">
                <span>Total Due:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="step-actions-footer">
              <button type="button" className="step-back-btn" onClick={() => setStep(2)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button type="submit" className="step-pay-btn" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Processing Payment...' : `Authorize & Pay $${cartTotal.toFixed(2)}`}</span>
                <Check size={17} />
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Success Confirmation */}
        {step === 4 && lastOrder && (
          <div className="order-success-view">
            <div className="success-icon-badge">
              <PackageCheck size={56} className="text-success" />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p className="order-id-highlight">Order ID: <strong>{lastOrder.id}</strong></p>
            <p className="success-subtext">
              Thank you for shopping with <strong>Kileo Code Ecommerce</strong>. We have sent a confirmation email to <strong>{lastOrder.customer?.email}</strong>.
            </p>

            <div className="success-order-summary">
              <h4>Order Breakdown</h4>
              <div className="success-items-list">
                {lastOrder.items?.map((item, idx) => (
                  <div key={idx} className="success-item-row">
                    <img src={item.image} alt={item.name} className="success-thumb" />
                    <div className="success-item-details">
                      <div className="success-item-title">{item.name}</div>
                      <div className="success-item-meta">
                        Qty: {item.quantity} × ${item.price.toFixed(2)} • {item.vendor}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="success-price-bar">
                <span>Total Paid:</span>
                <span className="success-total-val">${lastOrder.pricing?.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="success-actions">
              <button 
                className="continue-shopping-btn"
                onClick={() => {
                  setActiveModal(null);
                  setStep(1);
                }}
              >
                <span>Continue Exploring Products</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
