import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { ToastContext } from '../context/ToastContext';

const PAGES = [
  { id: 'analyze',   label: 'Analyze' },
  { id: 'tracker',   label: 'Tracker' },
  { id: 'cases',     label: 'Case Files' },
  { id: 'insights',  label: 'Insights' },
  { id: 'awareness', label: 'Awareness' },
];

export default function Header() {
  const { user, logout }               = useContext(AuthContext);
  const { theme, toggleTheme, glassMode, toggleGlass, activePage, setActivePage } = useContext(AppContext);
  const { showToast }                  = useContext(ToastContext);

  const handleLogout = () => {
    logout();
    showToast('Securely logged out.', 'info');
  };

  return (
    <header className={`app-header${glassMode ? ' glass' : ''}`}>
      <div className="logo">
        <span>🛡️</span>
        <div>Cyber<span className="accent">Sense</span> AI</div>
      </div>

      <div className="trust-badges hide-mobile">
        <span className="trust-badge"><i className="ti ti-lock" /> 256-bit Encrypted</span>
        <span className="trust-badge"><i className="ti ti-certificate" /> CERT-In Certified</span>
      </div>

      <nav className="nav-pills hide-mobile">
        {PAGES.map(p => (
          <button
            key={p.id}
            className={`nav-pill${activePage === p.id ? ' active' : ''}`}
            onClick={() => setActivePage(p.id)}
          >
            {p.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          <i className={`ti ti-${theme === 'dark' ? 'moon' : 'sun'}`} />
        </button>
        <button className="icon-btn" onClick={toggleGlass} title="Toggle Glass Mode"
          style={{ color: glassMode ? 'var(--accent-primary)' : undefined }}>
          <i className="ti ti-box-multiple" />
        </button>
        {user && (
          <button className="icon-btn" onClick={handleLogout} title="Logout">
            <i className="ti ti-logout" />
          </button>
        )}
        <div className="status-indicator">
          <div className="pulse-dot" />
          <span>AI ONLINE</span>
        </div>
      </div>
    </header>
  );
}
