import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart
  } = useEcommerce();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  const handleAddAllToCart = () => {
    wishlist.forEach(item => addToCart(item, 1));
  };

  return (
    <div className="drawer-backdrop" onClick={() => setIsWishlistOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-group">
            <Heart size={22} className="text-danger" fill="#ef4444" />
            <h3 className="drawer-heading">Your Wishlist ({wishlist.length})</h3>
          </div>
          <button 
            className="drawer-close-btn"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close Wishlist"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {wishlist.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-icon-circle">
                <Heart size={44} />
              </div>
              <h4>Your Wishlist is Empty</h4>
              <p>Save items you love by tapping the heart icon on any product.</p>
              <button 
                className="start-shopping-btn"
                onClick={() => setIsWishlistOpen(false)}
              >
                Discover Items
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {wishlist.map((product) => (
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
                      <button 
                        className="move-cart-btn"
                        onClick={() => handleMoveToCart(product)}
                      >
                        <ShoppingBag size={14} />
                        <span>Move to Cart</span>
                      </button>

                      <button 
                        className="cart-item-delete-btn"
                        onClick={() => toggleWishlist(product)}
                        title="Remove from wishlist"
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

        {wishlist.length > 0 && (
          <div className="drawer-footer">
            <button className="checkout-cta-btn" onClick={handleAddAllToCart}>
              <ShoppingBag size={18} />
              <span>Add All Items To Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
