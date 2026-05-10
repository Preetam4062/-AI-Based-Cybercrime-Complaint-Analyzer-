import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ITEMS = [
  { id: 'analyze',   icon: 'ti-brain',     label: 'Analyze' },
  { id: 'tracker',   icon: 'ti-route',     label: 'Tracker' },
  { id: 'cases',     icon: 'ti-folder',    label: 'Cases' },
  { id: 'insights',  icon: 'ti-chart-bar', label: 'Insights' },
  { id: 'awareness', icon: 'ti-book',      label: 'Learn' },
];

export default function BottomNav() {
  const { activePage, setActivePage } = useContext(AppContext);
  return (
    <nav className="bottom-nav">
      {ITEMS.map(item => (
        <button key={item.id} className={`nav-item${activePage === item.id ? ' active' : ''}`}
          onClick={() => setActivePage(item.id)}>
          <i className={`ti ${item.icon}`} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
