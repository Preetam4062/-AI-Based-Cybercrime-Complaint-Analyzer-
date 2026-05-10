import React, { useState, useContext, useRef } from 'react';
import { AppContext, AI_MAPPING } from '../context/AppContext';
import { ToastContext } from '../context/ToastContext';

const CRIME_TYPES = [
  { type: 'Phishing',        icon: 'ti-fish-hook' },
  { type: 'Account Hack',    icon: 'ti-user-x' },
  { type: 'Financial Fraud', icon: 'ti-cash-off' },
  { type: 'Malware',         icon: 'ti-bug' },
  { type: 'Harassment',      icon: 'ti-message-2-exclamation' },
  { type: 'Identity Theft',  icon: 'ti-id' },
];

const PREDICTIVE = {
  'Phishing':        'Tip: Mention the exact email or SMS sender details and the fake link.',
  'Account Hack':    'Tip: Mention when you lost access and if 2FA was enabled.',
  'Financial Fraud': 'Tip: Include the exact transaction amount, date, and destination account.',
  'Malware':         'Tip: Note any ransom demands or strange file extensions.',
  'Harassment':      'Tip: Mention the platform and frequency of messages.',
  'Identity Theft':  'Tip: List what documents were compromised.',
};

const LEVEL_COLORS = { 'CRITICAL': 'var(--danger)', 'HIGH RISK': 'var(--warning)', 'MEDIUM': 'var(--accent-primary)' };

function typewriterTexts(el, texts, cb) {
  if (!el) return;
  let i = 0, j = 0;
  el.textContent = '';
  function type() {
    if (!el) return;
    if (j < texts[i].length) { el.textContent += texts[i][j++]; setTimeout(type, 28); }
    else {
      setTimeout(() => {
        el.textContent = ''; j = 0; i++;
        if (i < texts.length) type();
        else cb && cb();
      }, 700);
    }
  }
  type();
}

export default function AnalyzePage() {
  const { addCase, setChatOpen }     = useContext(AppContext);
  const { showToast }                = useContext(ToastContext);

  const [step, setStep]             = useState(1);
  const [crimeType, setCrimeType]   = useState('Phishing');
  const [isAnon, setIsAnon]         = useState(false);
  const [fullName, setFullName]     = useState('');
  const [email, setEmail]           = useState('');
  const [platform, setPlatform]     = useState('');
  const [desc, setDesc]             = useState('');
  const [loss, setLoss]             = useState('');
  const [files, setFiles]           = useState([]);
  const [consent, setConsent]       = useState(false);
  const [errors, setErrors]         = useState({});
  const [analyzeState, setAnalyze]  = useState('idle'); // idle | loading | result
  const [result, setResult]         = useState(null);
  const [statusBadge, setStatusBadge] = useState('AWAITING');
  const twRef = useRef(null);

  const validate = (s) => {
    const e = {};
    if (s === 2) {
      if (!isAnon && !fullName) e.fullName = 'Please enter your full name.';
      if (!isAnon && (!email || !/\S+@\S+\.\S+/.test(email))) e.email = 'Please enter a valid email.';
      if (!platform) e.platform = 'Please specify the platform.';
      if (desc.length < 50) e.desc = 'Minimum 50 characters required.';
    }
    if (s === 4 && !consent) e.consent = 'You must consent to submit.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => Math.min(s + 1, 4)); };
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleFiles = (fl) => {
    Array.from(fl).forEach(f => {
      if (files.length >= 5) { showToast('Max 5 files allowed', 'error'); return; }
      if (f.size > 10 * 1024 * 1024) { showToast('File too large (max 10MB)', 'error'); return; }
      setFiles(prev => [...prev, f]);
    });
  };

  const submit = () => {
    if (!validate(4)) return;
    setAnalyze('loading');
    setStatusBadge('ANALYZING');

    const messages = [
      'Analyzing complaint patterns...',
      'Cross-referencing 2.4M case database...',
      'Identifying threat vectors...',
    ];

    // Use setTimeout to let React render the loading state (and mount twRef) before typewriting
    setTimeout(() => {
      typewriterTexts(twRef.current, messages, () => {
        const data = AI_MAPPING[crimeType];
        const caseId = 'CY-2026-' + Math.floor(10000 + Math.random() * 90000);
        addCase({ id: caseId, type: crimeType, severity: data.level, status: 'Under Review', date: new Date().toISOString().split('T')[0], loss: loss || 0 });
        setResult({ ...data, caseId, filesCount: files.length });
        setAnalyze('result');
        setStatusBadge('COMPLETE');
        showToast('Complaint analyzed successfully!', 'success');
      });
    }, 80);
  };

  const badgeColor = { 'CRITICAL': 'red', 'HIGH RISK': 'yellow', 'MEDIUM': 'green', 'AWAITING': 'gray', 'ANALYZING': 'yellow', 'COMPLETE': result ? (result.level === 'CRITICAL' ? 'red' : result.level === 'HIGH RISK' ? 'yellow' : 'green') : 'gray' };

  return (
    <div className="analyze-layout">
      {/* LEFT: WIZARD */}
      <div className="card form-card">
        <div className="card-header">
          <div className="card-title">File a Complaint</div>
          <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label className="anon-toggle-label">
              <input type="checkbox" checked={isAnon} onChange={e => setIsAnon(e.target.checked)} /> Anonymous
            </label>
            <span className="badge green">AI-POWERED</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="wizard-progress">
          <div className="wizard-progress-bar" style={{ width: `${((step - 1) / 3) * 100}%` }} />
          {[1,2,3,4].map(n => (
            <div key={n} className={`step-indicator${step === n ? ' active' : step > n ? ' completed' : ''}`}>{step > n ? <i className="ti ti-check" /> : n}</div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="wizard-step">
            <label className="field-label">Select Crime Type</label>
            <div className="crime-chips">
              {CRIME_TYPES.map(c => (
                <div key={c.type} className={`chip${crimeType === c.type ? ' selected' : ''}`} onClick={() => setCrimeType(c.type)}>
                  <i className={`ti ${c.icon}`} />
                  <span>{c.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="wizard-step">
            {!isAnon && (
              <div className="grid-2">
                <div className={`form-group${errors.fullName ? ' has-error' : ''}`}>
                  <label className="field-label">Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
                  <span className="error-msg">{errors.fullName}</span>
                </div>
                <div className={`form-group${errors.email ? ' has-error' : ''}`}>
                  <label className="field-label">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
                  <span className="error-msg">{errors.email}</span>
                </div>
              </div>
            )}
            <div className={`form-group${errors.platform ? ' has-error' : ''}`}>
              <label className="field-label">Platform / Website Involved</label>
              <input type="text" value={platform} onChange={e => setPlatform(e.target.value)} placeholder="e.g. facebook.com" />
              <span className="error-msg">{errors.platform}</span>
            </div>
            <div className={`form-group${errors.desc ? ' has-error' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="field-label" style={{ margin: 0 }}>Incident Description</label>
                <span className={`char-counter${desc.length > 400 ? ' amber' : ''}`}>{desc.length} / 500</span>
              </div>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} maxLength={500} rows={4} placeholder="Describe the incident in detail..." />
              <span className="error-msg">{errors.desc}</span>
              <div className="predictive-text">{PREDICTIVE[crimeType]}</div>
            </div>
            <div className="form-group">
              <label className="field-label">Financial Loss (₹)</label>
              <input type="number" value={loss} onChange={e => setLoss(e.target.value)} placeholder="Amount in ₹" />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="wizard-step">
            <label className="field-label">Upload Evidence (Max 5 files)</label>
            <div
              className="dropzone"
              onClick={() => document.getElementById('file-input-hidden').click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
              onDragLeave={e => e.currentTarget.classList.remove('dragover')}
              onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('dragover'); handleFiles(e.dataTransfer.files); }}
            >
              <i className="ti ti-cloud-upload" style={{ fontSize: '2rem', color: 'var(--accent-primary)' }} />
              <p>Drag & drop screenshots, PDFs</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or click to browse</p>
            </div>
            <input id="file-input-hidden" type="file" multiple accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
            {files.length > 0 && (
              <div className="file-list">
                {files.map((f, i) => (
                  <div key={i} className="file-item">
                    <span><i className="ti ti-file" /> {f.name}</span>
                    <button className="icon-btn-sm" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}><i className="ti ti-x" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="wizard-step">
            <h3>Review & Submit</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Review details before AI analysis.</p>
            <div className="review-box">
              <div><strong>Crime Type:</strong> {crimeType}</div>
              <div><strong>Reporter:</strong> {isAnon ? 'Anonymous' : fullName || '—'}</div>
              <div><strong>Platform:</strong> {platform}</div>
              <div><strong>Loss:</strong> ₹{loss || '0'}</div>
              <div><strong>Description:</strong> {desc}</div>
              <div><strong>Evidence:</strong> {files.length} file(s)</div>
            </div>
            <div className={`form-group${errors.consent ? ' has-error' : ''}`} style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none', cursor: 'pointer' }}>
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ width: 'auto' }} />
                I confirm the details are accurate.
              </label>
              {errors.consent && <span className="error-msg">{errors.consent}</span>}
            </div>
          </div>
        )}

        <div className="wizard-actions">
          {step > 1 && <button className="btn btn-outline" style={{ width: 'auto' }} onClick={prev}>Back</button>}
          {step < 4 && <button className="btn" style={{ flex: 1 }} onClick={next}>Next Step <i className="ti ti-arrow-right" /></button>}
          {step === 4 && (
            <button
              className="btn"
              style={{ flex: 1 }}
              type="button"
              onClick={(e) => { e.preventDefault(); submit(); }}
            >
              <i className="ti ti-brain" /> Analyze
            </button>
          )}
        </div>
      </div>

      {/* RIGHT: AI ANALYSIS PANEL */}
      <div className="card analysis-card">
        <div className="card-header">
          <div className="card-title"><i className="ti ti-cpu" /> AI Analysis</div>
          <span className={`badge ${badgeColor[statusBadge] || 'gray'}`}>{statusBadge}</span>
        </div>
        <div className="analysis-content">
          {analyzeState === 'idle' && (
            <div className="state-placeholder">
              <i className="ti ti-search" style={{ fontSize: '3rem', color: 'rgba(122,127,153,0.2)' }} />
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Submit complaint for AI threat assessment.</p>
            </div>
          )}
          {analyzeState === 'loading' && (
            <div className="state-loading">
              <div className="spinner-large" style={{ margin: '0 auto 1.5rem auto' }} />
              <div ref={twRef} className="typewriter" />
            </div>
          )}
          {analyzeState === 'result' && result && (
            <div className="state-result">
              <div className="result-section">
                <div className="result-meta-label">THREAT ASSESSMENT</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: LEVEL_COLORS[result.level] }}>{result.level}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700 }}>{result.score}/100</div>
                </div>
                <ThreatBar score={result.score} level={result.level} />
              </div>

              <div className="result-section">
                <div className="result-meta-label">AI CONFIDENCE</div>
                <div style={{ fontSize: '0.85rem', display: 'grid', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pattern Match</span><span style={{ color: 'var(--accent-primary)' }}>92%</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Evidence Quality</span><span style={{ color: 'var(--accent-primary)' }}>{result.filesCount > 0 ? '85%' : '30%'}</span></div>
                </div>
              </div>

              <div className="result-section">
                <div className="result-meta-label">RECOMMENDED ACTIONS</div>
                <ul className="action-list">
                  {result.steps.map((s, i) => (
                    <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div className="step-num">{i + 1}</div>
                      <span style={{ fontSize: '0.9rem' }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Case ID: {result.caseId}</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Track this ID in the Tracker page.</p>
              </div>

              <button className="btn btn-outline" style={{ marginTop: '1rem', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
                onClick={() => setChatOpen(true)}>
                <i className="ti ti-messages" /> Ask Follow-up Questions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThreatBar({ score, level }) {
  const color = LEVEL_COLORS[level];
  const [w, setW] = React.useState(0);
  React.useEffect(() => { setTimeout(() => setW(score), 100); }, [score]);
  return (
    <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, margin: '0.5rem 0', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 4, transition: 'width 1s ease' }} />
    </div>
  );
}
