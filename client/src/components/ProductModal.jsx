import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { api } from '../services/api';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Plus, Minus, Send, Check } from 'lucide-react';

export const ProductModal = () => {
  const { 
    selectedProduct, 
    activeModal, 
    setActiveModal, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCartOpen,
    showToast 
  } = useEcommerce();

  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'desc' | 'reviews'
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', title: '', comment: '', rating: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedImageIdx(0);
      setQuantity(1);
      api.getProductReviews(selectedProduct.id).then(res => setReviews(res || []));
    }
  }, [selectedProduct]);

  if (activeModal !== 'product' || !selectedProduct) return null;

  const isFav = isInWishlist(selectedProduct.id);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      showToast('Please fill out your name and review comment', 'error');
      return;
    }
    setSubmittingReview(true);
    const saved = await api.addReview(selectedProduct.id, newReview);
    if (saved) {
      setReviews(prev => [saved, ...prev]);
      setNewReview({ name: '', title: '', comment: '', rating: 5 });
      showToast('Your review has been published!');
    }
    setSubmittingReview(false);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setActiveModal(null);
    setIsCartOpen(true);
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-dialog product-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          className="modal-close-icon-btn" 
          onClick={() => setActiveModal(null)}
          aria-label="Close Modal"
        >
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Left Column: Image Gallery */}
          <div className="modal-gallery-col">
            <div className="modal-main-img-frame">
              <img 
                src={selectedProduct.images[selectedImageIdx] || selectedProduct.images[0]} 
                alt={selectedProduct.name}
                className="modal-main-img" 
              />
            </div>
            {selectedProduct.images.length > 1 && (
              <div className="modal-thumbnails-row">
                {selectedProduct.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    className={`modal-thumb-btn ${idx === selectedImageIdx ? 'active' : ''}`}
                    onClick={() => setSelectedImageIdx(idx)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Perks */}
            <div className="modal-perks-box">
              <div className="perk-row">
                <Truck size={17} className="perk-icon" />
                <span>Free Express Delivery on orders over $75</span>
              </div>
              <div className="perk-row">
                <ShieldCheck size={17} className="perk-icon" />
                <span>2-Year Official Manufacturer Warranty</span>
              </div>
              <div className="perk-row">
                <RotateCcw size={17} className="perk-icon" />
                <span>30-Day Hassle-Free Return Policy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="modal-info-col">
            <div className="modal-header-meta">
              <span className="vendor-pill">
                <ShieldCheck size={14} />
                {selectedProduct.vendorName} (Verified)
              </span>
              <span className="sku-pill">SKU: {selectedProduct.sku}</span>
            </div>

            <h2 className="modal-product-title">{selectedProduct.name}</h2>

            {/* Ratings Overview */}
            <div className="modal-ratings-bar">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(selectedProduct.rating) ? 'star-filled' : 'star-empty'}
                  />
                ))}
              </div>
              <span className="rating-score-num">{selectedProduct.rating} / 5.0</span>
              <span className="rating-total-reviews">({selectedProduct.numReviews} customer reviews)</span>
            </div>

            {/* Price Row */}
            <div className="modal-price-row">
              <span className="modal-current-price">${selectedProduct.price.toFixed(2)}</span>
              {selectedProduct.compareAtPrice && (
                <span className="modal-compare-price">${selectedProduct.compareAtPrice.toFixed(2)}</span>
              )}
              {selectedProduct.compareAtPrice && (
                <span className="modal-save-pill">
                  Save ${(selectedProduct.compareAtPrice - selectedProduct.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity Selector and CTA Buttons */}
            <div className="modal-purchase-controls">
              <div className="qty-control-wrapper">
                <span className="qty-label">Quantity:</span>
                <div className="qty-selector">
                  <button 
                    className="qty-btn"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={15} />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => setQuantity(prev => Math.min(selectedProduct.quantity, prev + 1))}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="modal-action-buttons">
                <button
                  className="modal-add-cart-btn"
                  onClick={() => addToCart(selectedProduct, quantity)}
                >
                  <ShoppingBag size={18} />
                  <span>Add To Cart (${(selectedProduct.price * quantity).toFixed(2)})</span>
                </button>

                <button
                  className="modal-buy-now-btn"
                  onClick={handleBuyNow}
                >
                  <span>Buy Now</span>
                </button>

                <button
                  className={`modal-wishlist-btn ${isFav ? 'active' : ''}`}
                  onClick={() => toggleWishlist(selectedProduct)}
                  title="Toggle Wishlist"
                >
                  <Heart size={20} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : '#64748b'} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs (Specifications, Description, Reviews) */}
            <div className="modal-tabs-nav">
              <button 
                className={`modal-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Specifications
              </button>
              <button 
                className={`modal-tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
                onClick={() => setActiveTab('desc')}
              >
                Overview
              </button>
              <button 
                className={`modal-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="modal-tab-body">
              {activeTab === 'specs' && selectedProduct.specs && (
                <div className="specs-table-container">
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(selectedProduct.specs).map(([key, val]) => (
                        <tr key={key}>
                          <td className="spec-label">{key}</td>
                          <td className="spec-value">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'desc' && (
                <div className="desc-content-container">
                  <p className="product-full-desc">{selectedProduct.description}</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-tab-container">
                  {/* Reviews List */}
                  <div className="reviews-list">
                    {reviews.length === 0 ? (
                      <p className="no-reviews-text">No reviews yet for this product. Be the first to leave one!</p>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev.id} className="review-card-item">
                          <div className="review-card-top">
                            <div className="review-author">
                              <strong>{rev.user}</strong>
                              {rev.verified && <span className="verified-badge">Verified Purchase</span>}
                            </div>
                            <span className="review-date">{rev.date}</span>
                          </div>
                          <div className="review-stars-row">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                className={i < rev.rating ? 'star-filled' : 'star-empty'}
                              />
                            ))}
                          </div>
                          {rev.title && <h4 className="review-title">{rev.title}</h4>}
                          <p className="review-comment-text">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form className="add-review-form" onSubmit={handleAddReview}>
                    <h4 className="form-heading">Write a Customer Review</h4>
                    <div className="form-group-row">
                      <div className="form-col">
                        <label>Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex M."
                          value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        />
                      </div>
                      <div className="form-col">
                        <label>Rating (1-5)</label>
                        <select
                          value={newReview.rating}
                          onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        >
                          <option value="5">★★★★★ 5 Stars - Exceptional</option>
                          <option value="4">★★★★☆ 4 Stars - Very Good</option>
                          <option value="3">★★★☆☆ 3 Stars - Average</option>
                          <option value="2">★★☆☆☆ 2 Stars - Fair</option>
                          <option value="1">★☆☆☆☆ 1 Star - Poor</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group-row">
                      <div className="form-col-full">
                        <label>Review Title</label>
                        <input
                          type="text"
                          placeholder="Brief headline..."
                          value={newReview.title}
                          onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group-row">
                      <div className="form-col-full">
                        <label>Your Review *</label>
                        <textarea
                          required
                          rows="3"
                          placeholder="Share your experience with this item..."
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        />
                      </div>
                    </div>
                    <button type="submit" className="submit-review-btn" disabled={submittingReview}>
                      <Send size={15} />
                      <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
