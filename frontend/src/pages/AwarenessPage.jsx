import React, { useState } from 'react';

const FAQS = [
  {
    q: 'How to spot phishing',
    a: 'Check the sender\'s email address carefully. Look for spelling errors, unexpected attachments, and urgent requests for personal info. Hover over links to preview the actual destination URL before clicking.',
  },
  {
    q: 'What to do if hacked',
    a: 'Immediately change passwords, enable 2FA on all critical accounts, contact your bank to freeze accounts if necessary, and report the incident on cybercrime.gov.in within 24 hours.',
  },
  {
    q: 'Identifying UPI Fraud',
    a: 'Remember: You only need to enter your UPI PIN to SEND money, never to RECEIVE it. If someone asks you to scan a QR code to receive a payment, it is a scam. Never share OTPs.',
  },
  {
    q: 'How to report online harassment',
    a: 'Document all evidence (screenshots), block the harasser, and file a complaint at cybercrime.gov.in under the "Women/Child Related" category. You can also call the national helpline at 1930.',
  },
  {
    q: 'Protecting against malware',
    a: 'Keep your OS and software updated, use a reputable antivirus, never download files from unknown sources, and ensure your firewall is active. Backup your data regularly.',
  },
];

export default function AwarenessPage() {
  const [open, setOpen] = useState(0);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="ti ti-book" /> Awareness & Prevention</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: 'ti-phone', label: 'Cybercrime Helpline', value: '1930', color: 'var(--accent-primary)' },
          { icon: 'ti-world', label: 'Report Online',        value: 'cybercrime.gov.in', color: 'var(--info)' },
          { icon: 'ti-shield', label: 'CERT-In',             value: 'cert-in.org.in',    color: 'var(--warning)' },
        ].map(card => (
          <div key={card.label} className="stat-card" style={{ textAlign: 'center', '--accent-color': card.color }}>
            <i className={`ti ${card.icon}`} style={{ fontSize: '2rem', color: card.color, marginBottom: '0.5rem', display: 'block' }} />
            <div className="stat-label">{card.label}</div>
            <div style={{ fontWeight: 800, color: card.color, marginTop: '0.25rem', fontSize: '0.95rem' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div>
        {FAQS.map((faq, i) => (
          <div key={i} className={`accordion-item${open === i ? ' active' : ''}`}>
            <div className="accordion-header" onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{faq.q}</span>
              <i className={`ti ti-chevron-down`} style={{ transition: '0.3s', transform: open === i ? 'rotate(180deg)' : 'none' }} />
            </div>
            <div className="accordion-content" style={{ maxHeight: open === i ? '300px' : 0 }}>
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
