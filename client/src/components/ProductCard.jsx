import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProduct, 
    setActiveModal, 
    cart 
  } = useEcommerce();

  const isFavorite = isInWishlist(product.id);
  const cartItem = cart.find(item => item.product.id === product.id);
  const inCartCount = cartItem ? cartItem.quantity : 0;

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      {/* Product Image Box */}
      <div className="product-card-media">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="product-card-img"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="product-badges-group">
          {product.tag && (
            <span className="badge-pill badge-primary-pill">{product.tag}</span>
          )}
          {discountPercent > 0 && (
            <span className="badge-pill badge-discount-pill">-{discountPercent}%</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`wishlist-heart-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#64748b'} />
        </button>

        {/* Quick View Overlay Button */}
        <div className="media-overlay-actions">
          <button 
            className="quick-view-overlay-btn"
            onClick={() => {
              setSelectedProduct(product);
              setActiveModal('product');
            }}
          >
            <Eye size={16} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="product-card-body">
        <div className="product-vendor-meta">
          <span className="vendor-name-badge">by {product.vendorName}</span>
          <span className="stock-status-badge">In Stock ({product.quantity})</span>
        </div>

        <h3 
          className="product-title-link"
          onClick={() => {
            setSelectedProduct(product);
            setActiveModal('product');
          }}
        >
          {product.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="product-ratings-row">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
              />
            ))}
          </div>
          <span className="rating-score">{product.rating}</span>
          <span className="review-count">({product.numReviews})</span>
        </div>

        {/* Price & Action Footer */}
        <div className="product-card-footer">
          <div className="price-stack">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="old-price">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            className={`add-cart-btn ${inCartCount > 0 ? 'in-cart' : ''}`}
            onClick={() => addToCart(product, 1)}
            title="Add to Cart"
          >
            {inCartCount > 0 ? (
              <>
                <Check size={16} />
                <span>Added ({inCartCount})</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
