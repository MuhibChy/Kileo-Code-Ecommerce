import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  SlidersHorizontal, 
  ShieldCheck, 
  BookOpen, 
  Server, 
  Tag
} from 'lucide-react';

export const Header = () => {
  const {
    cartCount,
    cartTotal,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setActiveModal,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct,
    currentUser,
    apiConfig
  } = useEcommerce();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="header-sticky">
      {/* Top Banner Announcement */}
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <div className="announcement-badge">
            <Tag size={13} />
            <span>FLASH DEAL: Use code <strong>KILEO20</strong> for 20% off all flagship gear!</span>
          </div>
          <div className="announcement-actions">
            <button 
              className="top-link-btn"
              onClick={() => setActiveModal('docs')}
              title="View Setup & API Docs"
            >
              <BookOpen size={13} />
              <span>Developer Docs</span>
            </button>
            <button 
              className={`top-link-btn ${apiConfig.mode === 'live' ? 'live-active' : ''}`}
              onClick={() => setActiveModal('api')}
              title="Configure API Mode"
            >
              <Server size={13} />
              <span>API: {apiConfig.mode === 'live' ? 'Live Server' : 'Static Demo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="main-header">
        <div className="container header-container">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="logo-icon-wrapper">
              <ShoppingBag className="logo-svg" size={24} />
            </div>
            <div className="logo-text">
              <span className="logo-title">KILEO<span className="logo-accent">CODE</span></span>
              <span className="logo-subtitle">MULTIVENDOR ECOMMERCE</span>
            </div>
          </div>

          {/* Search Bar with Autocomplete */}
          <div className="search-wrapper">
            <div className={`search-input-group ${searchFocused ? 'focused' : ''}`}>
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search products, brands, acoustics, keyboards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Live Search Autocomplete Popup */}
            {searchFocused && searchResults.length > 0 && (
              <div className="search-dropdown-menu">
                <div className="search-dropdown-header">Matching Products ({searchResults.length})</div>
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="search-dropdown-item"
                    onClick={() => {
                      setSelectedProduct(product);
                      setActiveModal('product');
                      setSearchQuery('');
                    }}
                  >
                    <img src={product.images[0]} alt={product.name} className="search-item-thumb" />
                    <div className="search-item-info">
                      <div className="search-item-name">{product.name}</div>
                      <div className="search-item-meta">
                        <span className="search-item-price">${product.price.toFixed(2)}</span>
                        <span className="search-item-vendor">by {product.vendorName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="header-actions">
            {/* Vendors Modal Trigger */}
            <button 
              className="action-btn desktop-only"
              onClick={() => setActiveModal('vendors')}
              title="Verified Vendors"
            >
              <ShieldCheck size={20} />
              <span className="action-btn-label">Vendors</span>
            </button>

            {/* Wishlist Button */}
            <button 
              className="action-btn relative"
              onClick={() => setIsWishlistOpen(true)}
              title="Your Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="badge-counter badge-heart">{wishlist.length}</span>
              )}
              <span className="action-btn-label desktop-only">Wishlist</span>
            </button>

            {/* Cart Button */}
            <button 
              className="action-btn cart-trigger relative"
              onClick={() => setIsCartOpen(true)}
              title="Your Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="badge-counter badge-cart">{cartCount}</span>
              )}
              <div className="cart-total-preview desktop-only">
                <span className="cart-total-label">Cart</span>
                <span className="cart-total-value">${cartTotal.toFixed(2)}</span>
              </div>
            </button>

            {/* Auth / Profile Button */}
            <button 
              className="action-btn user-btn"
              onClick={() => setActiveModal('auth')}
              title="My Account"
            >
              <div className="user-avatar-circle">
                <User size={18} />
              </div>
              <span className="action-btn-label desktop-only">
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Account'}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              className="action-btn mobile-menu-toggle mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-menu animate-fade-in">
          <div className="mobile-menu-links">
            <button 
              className="mobile-link-row"
              onClick={() => {
                setActiveModal('vendors');
                setMobileMenuOpen(false);
              }}
            >
              <ShieldCheck size={18} />
              <span>Multivendor Directory</span>
            </button>
            <button 
              className="mobile-link-row"
              onClick={() => {
                setActiveModal('docs');
                setMobileMenuOpen(false);
              }}
            >
              <BookOpen size={18} />
              <span>Developer & API Setup Guide</span>
            </button>
            <button 
              className="mobile-link-row"
              onClick={() => {
                setActiveModal('api');
                setMobileMenuOpen(false);
              }}
            >
              <Server size={18} />
              <span>API Mode ({apiConfig.mode.toUpperCase()})</span>
            </button>
            <button 
              className="mobile-link-row"
              onClick={() => {
                setActiveModal('auth');
                setMobileMenuOpen(false);
              }}
            >
              <User size={18} />
              <span>Account & Orders ({currentUser?.name})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
