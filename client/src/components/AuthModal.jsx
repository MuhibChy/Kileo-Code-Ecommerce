import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { api } from '../services/api';
import { X, User, Lock, Mail, CheckCircle2, Package, LogOut } from 'lucide-react';

export const AuthModal = () => {
  const { 
    activeModal, 
    setActiveModal, 
    currentUser, 
    setCurrentUser, 
    showToast 
  } = useEcommerce();

  const [tab, setTab] = useState('account'); // 'account' | 'login' | 'register'
  const [orders, setOrders] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (activeModal === 'auth') {
      api.getOrders().then(res => setOrders(res || []));
    }
  }, [activeModal]);

  if (activeModal !== 'auth') return null;

  const handleQuickLogin = (role, name, email) => {
    const userObj = { name, email, role };
    setCurrentUser(userObj);
    localStorage.setItem('kileo_user_v1', JSON.stringify(userObj));
    showToast(`Signed in as ${name} (${role.toUpperCase()})`);
    setTab('account');
  };

  const handleLogout = () => {
    const guestObj = { name: 'Demo Guest', email: 'guest@kileo.com', role: 'customer' };
    setCurrentUser(guestObj);
    localStorage.setItem('kileo_user_v1', JSON.stringify(guestObj));
    showToast('Signed out of account', 'info');
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-dialog auth-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-icon-btn" 
          onClick={() => setActiveModal(null)}
          aria-label="Close Auth Modal"
        >
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <div className="auth-icon-circle">
            <User size={28} />
          </div>
          <h3>Account & Orders</h3>
          <p>Manage your Kileo Code customer profile and order history</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs-row">
          <button 
            className={`auth-tab-pill ${tab === 'account' ? 'active' : ''}`}
            onClick={() => setTab('account')}
          >
            My Profile & Orders
          </button>
          <button 
            className={`auth-tab-pill ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Switch Account
          </button>
        </div>

        {/* Tab 1: Profile & Order History */}
        {tab === 'account' && (
          <div className="auth-account-view">
            <div className="user-profile-summary-card">
              <div className="profile-card-left">
                <div className="profile-avatar-large">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div>
                  <div className="profile-name-text">{currentUser?.name}</div>
                  <div className="profile-email-text">{currentUser?.email}</div>
                </div>
              </div>
              <div className="profile-card-right">
                <span className="role-tag-badge">{currentUser?.role?.toUpperCase()}</span>
                <button className="logout-inline-btn" onClick={handleLogout} title="Sign Out">
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            {/* Orders Section */}
            <div className="account-orders-section">
              <div className="orders-header-row">
                <div className="orders-title-with-icon">
                  <Package size={18} className="text-primary" />
                  <h4>Recent Orders ({orders.length})</h4>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="no-orders-box">
                  <p>You haven't placed any orders in this session yet.</p>
                  <p className="no-orders-sub">Complete checkout with items in your cart to see order tracking and receipts here.</p>
                </div>
              ) : (
                <div className="orders-history-list">
                  {orders.map((ord) => (
                    <div key={ord.id} className="order-history-card">
                      <div className="order-history-top">
                        <span className="order-id-badge">{ord.id}</span>
                        <span className="order-status-pill">{ord.status}</span>
                      </div>
                      <div className="order-date-row">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </div>
                      <div className="order-items-mini">
                        {ord.items?.map((it, idx) => (
                          <div key={idx} className="order-mini-item">
                            <span>{it.quantity}x {it.name}</span>
                            <span>${(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-history-total">
                        <span>Total Paid:</span>
                        <strong>${ord.pricing?.total?.toFixed(2)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Switch Account / Demo Logins */}
        {tab === 'login' && (
          <div className="auth-login-view">
            <div className="quick-roles-picker">
              <span className="quick-roles-title">1-Click Demo Profiles:</span>
              <div className="quick-role-buttons">
                <button 
                  className="role-select-btn"
                  onClick={() => handleQuickLogin('customer', 'Marcus Vance', 'marcus@example.com')}
                >
                  <span>Customer (Marcus Vance)</span>
                </button>
                <button 
                  className="role-select-btn"
                  onClick={() => handleQuickLogin('vendor', 'AudioLux Studio', 'vendor@audiolux.de')}
                >
                  <span>Vendor (AudioLux Studio)</span>
                </button>
                <button 
                  className="role-select-btn"
                  onClick={() => handleQuickLogin('admin', 'Kileo Superadmin', 'admin@kileo.com')}
                >
                  <span>Super Administrator</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
