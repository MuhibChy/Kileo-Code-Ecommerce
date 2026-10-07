import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { X, BookOpen, Code2, Terminal, Layers, FileText } from 'lucide-react';

export const DocsModal = () => {
  const { activeModal, setActiveModal } = useEcommerce();
  const [docTab, setDocTab] = useState('setup'); // 'setup' | 'api'

  if (activeModal !== 'docs') return null;

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-dialog docs-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-icon-btn" 
          onClick={() => setActiveModal(null)}
          aria-label="Close Docs Modal"
        >
          <X size={20} />
        </button>

        <div className="docs-modal-header">
          <div className="auth-icon-circle">
            <BookOpen size={28} />
          </div>
          <h3>Developer Documentation & Architecture</h3>
          <p>Technical reference for the Kileo Code E-Commerce MERN stack platform</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs-row">
          <button 
            className={`auth-tab-pill ${docTab === 'setup' ? 'active' : ''}`}
            onClick={() => setDocTab === 'setup' ? null : setDocTab('setup')}
          >
            <Terminal size={15} />
            <span>Setup & Architecture Guide</span>
          </button>
          <button 
            className={`auth-tab-pill ${docTab === 'api' ? 'active' : ''}`}
            onClick={() => setDocTab === 'api' ? null : setDocTab('api')}
          >
            <Code2 size={15} />
            <span>REST API Endpoints</span>
          </button>
        </div>

        <div className="docs-content-scroll">
          {docTab === 'setup' ? (
            <div className="markdown-prose">
              <h4>Kileo E-Commerce Architecture</h4>
              <p>
                Kileo Code is a full multivendor e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) and Vite.
              </p>

              <h5>Prerequisites</h5>
              <ul>
                <li>Node.js v18+</li>
                <li>MongoDB v5.0+</li>
                <li>Redis (Optional for response caching)</li>
                <li>Cloudinary (For product asset uploads)</li>
                <li>Payment Gateways: Stripe, PayPal, Razorpay</li>
              </ul>

              <h5>Local Backend Startup</h5>
              <pre>
{`# 1. Install root dependencies
npm install

# 2. Configure .env with MongoDB URI
MONGO_URI=mongodb://localhost:27017/kileo_ecommerce
PORT=5000
JWT_SECRET=your_jwt_secret

# 3. Start Node.js API server
npm run server`}
              </pre>

              <h5>Frontend Client Startup</h5>
              <pre>
{`# 1. Navigate to client
cd client

# 2. Install dependencies & launch Vite
npm install
npm run dev

# 3. Build for Production (GitHub Pages)
npm run build`}
              </pre>
            </div>
          ) : (
            <div className="markdown-prose">
              <h4>REST API Reference</h4>
              <p>Base URL for production backend: <code>https://api.kileo.com/v1</code> or <code>http://localhost:5000</code></p>

              <h5>Authentication Endpoints</h5>
              <ul>
                <li><code>POST /api/auth/register</code> - Register customer or vendor</li>
                <li><code>POST /api/auth/login</code> - Generate JWT session token</li>
                <li><code>GET /api/auth/me</code> - Retrieve current authenticated profile</li>
              </ul>

              <h5>Product & Catalog Endpoints</h5>
              <ul>
                <li><code>GET /api/products</code> - List products with pagination & filters</li>
                <li><code>GET /api/products/:id</code> - Get single product specifications</li>
                <li><code>POST /api/products</code> - Create new product (Vendor/Admin)</li>
                <li><code>GET /api/products/featured</code> - Get featured marketplace items</li>
              </ul>

              <h5>Order & Payment Endpoints</h5>
              <ul>
                <li><code>POST /api/orders</code> - Create order with shipping address</li>
                <li><code>GET /api/orders/mine</code> - Get authenticated customer orders</li>
                <li><code>POST /api/payments/stripe</code> - Process Stripe charge</li>
                <li><code>POST /api/payments/paypal</code> - Create PayPal checkout session</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
