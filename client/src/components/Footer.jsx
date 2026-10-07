import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Headphones, 
  BookOpen, 
  Server, 
  Github, 
  Heart,
  Send
} from 'lucide-react';

export const Footer = () => {
  const { setActiveModal, setSelectedCategory } = useEcommerce();

  return (
    <footer className="footer-section">
      {/* Trust Badges Bar */}
      <div className="trust-badges-bar">
        <div className="container trust-badges-grid">
          <div className="trust-item">
            <div className="trust-icon-box">
              <Truck size={22} />
            </div>
            <div className="trust-text">
              <strong>Free Global Shipping</strong>
              <span>On all orders over $75</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <ShieldCheck size={22} />
            </div>
            <div className="trust-text">
              <strong>Verified Vendors Only</strong>
              <span>Strict hardware authenticity guarantee</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <RotateCcw size={22} />
            </div>
            <div className="trust-text">
              <strong>30-Day Safe Returns</strong>
              <span>No questions asked replacement policy</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <Headphones size={22} />
            </div>
            <div className="trust-text">
              <strong>24/7 Dedicated Support</strong>
              <span>Live engineering and customer help</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container main-footer-body">
        <div className="footer-cols-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="logo-icon-wrapper">
                <ShoppingBag size={20} className="logo-svg" />
              </div>
              <span className="logo-title">KILEO<span className="logo-accent">CODE</span></span>
            </div>
            <p className="footer-tagline">
              The next-generation multivendor commerce platform. Built for performance, speed, and seamless digital shopping worldwide.
            </p>
            <div className="footer-social-links">
              <a 
                href="https://github.com/MuhibChy/Kileo-Code-Ecommerce" 
                target="_blank" 
                rel="noreferrer"
                className="social-btn" 
                title="GitHub Repository"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="footer-links-col">
            <h5 className="footer-col-title">Product Catalog</h5>
            <ul className="footer-nav-list">
              <li><button onClick={() => setSelectedCategory('electronics')}>Electronics & Audio</button></li>
              <li><button onClick={() => setSelectedCategory('wearables')}>Smart Wearables</button></li>
              <li><button onClick={() => setSelectedCategory('computing')}>Computers & Gaming</button></li>
              <li><button onClick={() => setSelectedCategory('accessories')}>Premium Accessories</button></li>
              <li><button onClick={() => setSelectedCategory('all')}>All Collections</button></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="footer-links-col">
            <h5 className="footer-col-title">Platform & Resources</h5>
            <ul className="footer-nav-list">
              <li><button onClick={() => setActiveModal('vendors')}>Verified Vendor Directory</button></li>
              <li><button onClick={() => setActiveModal('docs')}>Setup & MERN Architecture</button></li>
              <li><button onClick={() => setActiveModal('api')}>API & Backend Switcher</button></li>
              <li><button onClick={() => setActiveModal('auth')}>Customer Profile</button></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="footer-newsletter-col">
            <h5 className="footer-col-title">Stay Connected</h5>
            <p className="newsletter-desc">Subscribe to receive exclusive drops, flash sale voucher codes, and hardware releases.</p>
            <form className="footer-newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Kileo Code E-Commerce. Open source multivendor commerce platform.</p>
          <div className="footer-bottom-links">
            <button onClick={() => setActiveModal('docs')}>Docs</button>
            <span>•</span>
            <button onClick={() => setActiveModal('api')}>API Mode</button>
            <span>•</span>
            <a href="https://github.com/MuhibChy/Kileo-Code-Ecommerce" target="_blank" rel="noreferrer">
              Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
