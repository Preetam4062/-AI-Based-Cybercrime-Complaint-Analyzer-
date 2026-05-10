import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ToastContext } from '../context/ToastContext';

const STEPS = [
  { icon: 'ti-file-check',    label: 'Filed',         meta: '' },
  { icon: 'ti-eye',           label: 'Under Review',  meta: 'Pending assignment' },
  { icon: 'ti-shield-search', label: 'Investigating', meta: '—' },
  { icon: 'ti-circle-check',  label: 'Resolved',      meta: '—' },
];

function getActiveStep(status) {
  if (status === 'Resolved')      return 4;
  if (status === 'Investigating') return 3;
  if (status === 'Under Review')  return 2;
  return 1;
}

export default function TrackerPage() {
  const { cases } = useContext(AppContext);
  const { showToast } = useContext(ToastContext);
  const [trackId, setTrackId] = useState('');
  const [found, setFound]     = useState(null);

  const track = () => {
    if (!trackId.trim()) { showToast('Please enter a Case ID', 'error'); return; }
    const c = cases.find(x => x.id.toLowerCase() === trackId.trim().toLowerCase());
    if (!c) { showToast('Case not found. Try a different ID.', 'error'); setFound(null); return; }
    setFound(c);
  };

  const active = found ? getActiveStep(found.status) : 0;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="ti ti-route" /> Case Tracker</div>
      </div>

      <div className="form-group" style={{ maxWidth: 400, marginBottom: '2rem' }}>
        <label className="field-label">Case ID</label>
        <input
          type="text"
          value={trackId}
          onChange={e => setTrackId(e.target.value)}
          placeholder="e.g. CY-2026-12345"
          onKeyDown={e => e.key === 'Enter' && track()}
        />
        <button className="btn" style={{ marginTop: '1rem' }} onClick={track}>
          <i className="ti ti-search" /> Track
        </button>
      </div>

      {found && (
        <div className="tracker-result">
          <h3 style={{ marginBottom: '1.5rem' }}>Status for <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{found.id}</span></h3>
          <div className="timeline">
            {STEPS.map((step, i) => {
              const stepNum = i + 1;
              const isComplete = stepNum < active;
              const isCurrent  = stepNum === active;
              return (
                <div key={i} className={`timeline-step${isComplete ? ' completed' : isCurrent ? ' current' : ''}`}>
                  <div className="timeline-dot">
                    {isComplete
                      ? <i className="ti ti-check" />
                      : <i className={`ti ${step.icon}`} />
                    }
                  </div>
                  <div>
                    <div className="timeline-label">{step.label}</div>
                    <div className="timeline-meta">{stepNum === 1 ? found.date : step.meta}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem' }}>
            <div className="review-box" style={{ padding: '1rem', borderRadius: '8px' }}>
              <div className="result-meta-label">Crime Type</div>
              <div style={{ fontWeight: 700, marginTop: '0.25rem' }}>{found.type}</div>
            </div>
            <div className="review-box" style={{ padding: '1rem', borderRadius: '8px' }}>
              <div className="result-meta-label">Severity</div>
              <span className={`badge ${found.severity === 'CRITICAL' ? 'red' : found.severity === 'HIGH RISK' ? 'yellow' : 'blue'}`} style={{ marginTop: '0.25rem', display: 'inline-block' }}>{found.severity}</span>
            </div>
            <div className="review-box" style={{ padding: '1rem', borderRadius: '8px' }}>
              <div className="result-meta-label">Financial Loss</div>
              <div style={{ fontWeight: 700, marginTop: '0.25rem' }}>₹{Number(found.loss).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
