import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { X, ShieldCheck, Star, MapPin, Package, ArrowRight } from 'lucide-react';

export const VendorDirectoryModal = () => {
  const {
    activeModal,
    setActiveModal,
    vendors,
    setSelectedVendor,
    setSelectedCategory
  } = useEcommerce();

  if (activeModal !== 'vendors') return null;

  const handleBrowseVendor = (vendorId) => {
    setSelectedVendor(vendorId);
    setSelectedCategory('all');
    setActiveModal(null);
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-dialog vendors-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-icon-btn" 
          onClick={() => setActiveModal(null)}
          aria-label="Close Vendors Modal"
        >
          <X size={20} />
        </button>

        <div className="vendors-modal-header">
          <div className="auth-icon-circle">
            <ShieldCheck size={28} />
          </div>
          <h3>Verified Multivendor Directory</h3>
          <p>Explore independent hardware engineers, acoustic labs, and premium merchants on Kileo Code</p>
        </div>

        <div className="vendors-grid">
          {vendors.map((ven) => (
            <div key={ven.id} className="vendor-showcase-card">
              <div className="vendor-card-header">
                <div>
                  <h4 className="vendor-card-name">{ven.name}</h4>
                  <div className="vendor-card-location">
                    <MapPin size={13} />
                    <span>{ven.location}</span>
                  </div>
                </div>
                {ven.isVerified && (
                  <span className="vendor-verified-tag">
                    <ShieldCheck size={13} />
                    Verified
                  </span>
                )}
              </div>

              <p className="vendor-card-desc">{ven.description}</p>

              <div className="vendor-stats-row">
                <div className="vendor-stat-item">
                  <Star size={14} className="star-filled" />
                  <strong>{ven.rating}</strong>
                  <span>({ven.reviews} ratings)</span>
                </div>
                <div className="vendor-stat-item">
                  <Package size={14} />
                  <strong>{ven.productsCount}</strong>
                  <span>Active Products</span>
                </div>
              </div>

              <button
                className="vendor-browse-btn"
                onClick={() => handleBrowseVendor(ven.id)}
              >
                <span>Browse {ven.name} Store</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
