import React, { useMemo } from 'react';
import { useEcommerce } from './context/EcommerceContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthModal } from './components/AuthModal';
import { VendorDirectoryModal } from './components/VendorDirectoryModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { DocsModal } from './components/DocsModal';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  ArrowUpDown, 
  ShieldCheck, 
  PackageSearch 
} from 'lucide-react';

export const App = () => {
  const {
    products,
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
    categories,
    vendors
  } = useEcommerce();

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        // Vendor Filter
        if (selectedVendor !== 'all' && p.vendorId !== selectedVendor) return false;
        // Price Filter
        if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchVendor = p.vendorName.toLowerCase().includes(q);
          const matchTag = p.tag?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchVendor && !matchTag) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.numReviews - a.numReviews;
        // 'featured'
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedVendor, priceRange, searchQuery, sortBy]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);
  const activeVendorObj = vendors.find(v => v.id === selectedVendor);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedVendor('all');
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedVendor !== 'all' || searchQuery !== '' || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <div className="ecommerce-app-root">
      <Header />
      <HeroSlider />
      <CategoryBar />

      {/* Main Products Storefront Section */}
      <main className="main-catalog-section" id="products-section">
        <div className="container">
          {/* Catalog Controls Header */}
          <div className="catalog-toolbar">
            <div className="toolbar-left">
              <h2 className="catalog-title">
                {activeCategoryObj ? activeCategoryObj.name : 'All Products'}
                {activeVendorObj && <span className="vendor-filter-tag"> • {activeVendorObj.name}</span>}
              </h2>
              <span className="results-count-badge">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="toolbar-right">
              {/* Vendor Selector */}
              <div className="filter-select-wrapper desktop-only">
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="toolbar-select"
                >
                  <option value="all">All Vendors</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort By Selector */}
              <div className="filter-select-wrapper">
                <ArrowUpDown size={15} className="select-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="toolbar-select"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="active-filter-chips-row">
              <span className="filter-chips-label">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="filter-chip">
                  Category: {activeCategoryObj?.name}
                  <button onClick={() => setSelectedCategory('all')}><X size={12} /></button>
                </span>
              )}
              {selectedVendor !== 'all' && (
                <span className="filter-chip">
                  Vendor: {activeVendorObj?.name}
                  <button onClick={() => setSelectedVendor('all')}><X size={12} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="filter-chip">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X size={12} /></button>
                </span>
              )}
              <button className="clear-all-chips-btn" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="loading-state-wrapper">
              <div className="spinner-ring" />
              <p>Loading Kileo Code marketplace catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-results-box">
              <PackageSearch size={48} className="empty-search-icon" />
              <h3>No products found</h3>
              <p>No products match your current search and filter combination.</p>
              <button className="reset-filters-btn" onClick={clearAllFilters}>
                Reset Filter Settings
              </button>
            </div>
          ) : (
            <div className="products-responsive-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals and Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <WishlistDrawer />
      <AuthModal />
      <VendorDirectoryModal />
      <ApiSettingsModal />
      <DocsModal />
      <Toast />

      <Footer />
    </div>
  );
};
