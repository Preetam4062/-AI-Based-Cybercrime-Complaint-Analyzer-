import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { ToastContext } from '../context/ToastContext';

export default function LoginPage() {
  const { login, register }       = useContext(AuthContext);
  const { setActivePage }         = useContext(AppContext);
  const { showToast }             = useContext(ToastContext);
  const [mode, setMode]           = useState('login'); // login | register
  const [loading, setLoading]     = useState(false);
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true); setError('');
    try {
      if (mode === 'login') await login(email, password);
      else await register(name, email, password);
      setActivePage('analyze');
      showToast('Authentication successful. Welcome, Agent.', 'success');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-bg">
      {/* Animated grid bg */}
      <div className="login-grid-overlay" />

      <div className="login-card card">
        <div className="login-logo">
          <span>🛡️</span> Cyber<span className="accent">Sense</span> AI
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {mode === 'login' ? 'Secure Intelligence Platform' : 'Create your Agent Account'}
        </p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="field-label">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Agent Smith" autoFocus />
            </div>
          )}
          <div className="form-group">
            <label className="field-label">Agent ID / Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="agent@cybersense.gov.in" />
          </div>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="field-label">Security Clearance (Password)</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading
              ? <><i className="ti ti-loader ti-spin" /> Authenticating...</>
              : <><i className="ti ti-fingerprint" /> {mode === 'login' ? 'Authenticate' : 'Register'}</>
            }
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {mode === 'login' ? "Don't have an agent account? " : 'Already registered? '}
          <button
            className="link-btn"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </div>

        <div className="trust-badges" style={{ justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <span className="trust-badge"><i className="ti ti-lock" /> 256-bit Encrypted</span>
          <span className="trust-badge"><i className="ti ti-certificate" /> CERT-In Certified</span>
          <span className="trust-badge"><i className="ti ti-shield-check" /> SOC 2 Compliant</span>
        </div>
      </div>
    </div>
  );
}
