import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { api } from '../services/api';
import { X, Server, CheckCircle2, AlertTriangle, RefreshCw, Globe, Database, Terminal } from 'lucide-react';

export const ApiSettingsModal = () => {
  const { activeModal, setActiveModal, apiConfig, updateApiConfig, showToast } = useEcommerce();
  const [mode, setMode] = useState(apiConfig.mode);
  const [baseUrl, setBaseUrl] = useState(apiConfig.baseUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (activeModal !== 'api') return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await api.testBackendConnection(baseUrl);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = () => {
    updateApiConfig({
      mode,
      baseUrl: baseUrl.trim().replace(/\/$/, '')
    });
    setActiveModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-dialog api-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-icon-btn" 
          onClick={() => setActiveModal(null)}
          aria-label="Close API Modal"
        >
          <X size={20} />
        </button>

        <div className="api-modal-header">
          <div className="auth-icon-circle">
            <Server size={28} />
          </div>
          <h3>API & Deployment Configuration</h3>
          <p>Configure backend connectivity between GitHub Pages and the Node.js Express server</p>
        </div>

        {/* Mode Selector */}
        <div className="api-mode-selector-grid">
          <label className={`api-mode-card ${mode === 'static' ? 'active' : ''}`}>
            <input
              type="radio"
              name="apiMode"
              value="static"
              checked={mode === 'static'}
              onChange={() => setMode('static')}
            />
            <div className="api-mode-card-body">
              <div className="mode-card-top">
                <Globe size={18} className="text-primary" />
                <strong>Static Demo Mode (Recommended for GitHub Pages)</strong>
              </div>
              <p>
                Runs 100% client-side with rich local mock data, full cart persistence, promo coupons, review submissions, and order checkout tracking without needing a live backend server.
              </p>
            </div>
          </label>

          <label className={`api-mode-card ${mode === 'live' ? 'active' : ''}`}>
            <input
              type="radio"
              name="apiMode"
              value="live"
              checked={mode === 'live'}
              onChange={() => setMode('live')}
            />
            <div className="api-mode-card-body">
              <div className="mode-card-top">
                <Database size={18} className="text-warning" />
                <strong>Live MERN Backend Mode</strong>
              </div>
              <p>
                Directs product fetching, authentication, and order storage to an external Node.js/Express server (e.g., local development at <code>http://localhost:5000</code> or deployed on Render/Railway/Heroku).
              </p>
            </div>
          </label>
        </div>

        {/* Live URL Input */}
        {mode === 'live' && (
          <div className="live-api-config-box">
            <label className="input-label">Backend Base URL (Node.js Express Server)</label>
            <div className="url-input-row">
              <input
                type="text"
                placeholder="http://localhost:5000"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
              <button 
                type="button" 
                className="test-conn-btn"
                onClick={handleTest}
                disabled={testing}
              >
                {testing ? <RefreshCw size={15} className="spin" /> : 'Ping API'}
              </button>
            </div>

            {testResult && (
              <div className={`test-result-banner ${testResult.ok ? 'success' : 'error'}`}>
                {testResult.ok ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Connection successful! Backend returned status {testResult.status}.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} />
                    <span>Unable to reach backend at this URL ({testResult.error}). Please ensure `npm run server` is running.</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Architecture Note */}
        <div className="architecture-note-box">
          <Terminal size={16} className="note-icon" />
          <div className="note-text">
            <strong>Deployment Note:</strong> GitHub Pages provides static website hosting only. The Node.js Express + MongoDB backend (defined in <code>server.js</code>) can be run locally using <code>npm run dev</code> or deployed separately to cloud container platforms like Docker, Render, or Railway.
          </div>
        </div>

        <div className="modal-actions-bar">
          <button className="secondary-btn" onClick={() => setActiveModal(null)}>Cancel</button>
          <button className="primary-btn" onClick={handleSave}>Save Configuration</button>
        </div>
      </div>
    </div>
  );
};
