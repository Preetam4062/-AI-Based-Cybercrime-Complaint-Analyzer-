import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';

function animateValue(el, end, duration) {
  if (!el) return;
  let start = 0, startTs = null;
  const step = (ts) => {
    if (!startTs) startTs = ts;
    const progress = Math.min((ts - startTs) / duration, 1);
    el.textContent = (Math.floor(progress * end)).toLocaleString('en-IN') + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const STAT_CARDS = [
  { key: 'today',    label: 'Cases Today',   accent: 'var(--accent-primary)', suffix: '' },
  { key: 'review',   label: 'Under Review',  accent: 'var(--warning)',        suffix: '' },
  { key: 'resolved', label: 'Resolved',      accent: 'var(--info)',           suffix: '' },
  { key: 'accuracy', label: 'AI Accuracy',   accent: 'var(--accent-secondary)', suffix: '%' },
];

export default function StatsGrid() {
  const { stats } = useContext(AppContext);
  const refs = useRef([]);

  useEffect(() => {
    STAT_CARDS.forEach((card, i) => {
      if (refs.current[i]) {
        refs.current[i].dataset.suffix = card.suffix;
        animateValue(refs.current[i], parseFloat(stats[card.key]), 1500);
      }
    });
  }, [stats]);

  return (
    <section className="stats-grid">
      {STAT_CARDS.map((card, i) => (
        <div key={card.key} className="stat-card" style={{ '--accent-color': card.accent }}>
          <div className="stat-label">{card.label}</div>
          <div className="stat-value" ref={el => refs.current[i] = el} data-suffix={card.suffix}>0</div>
        </div>
      ))}
    </section>
  );
}
