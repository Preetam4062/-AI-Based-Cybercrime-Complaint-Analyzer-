import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AI_MAPPING = {
  'Phishing':        { score: 82, level: 'HIGH RISK',  tags: ['SMS Phishing','Social Engineering'], steps: ['Call 1930','Report on cybercrime.gov.in','Change bank PIN'] },
  'Account Hack':    { score: 75, level: 'HIGH RISK',  tags: ['Unauthorized Access'],               steps: ['Enable 2FA','Logout all sessions','Monitor emails'] },
  'Financial Fraud': { score: 91, level: 'CRITICAL',   tags: ['Banking Fraud','UPI Fraud'],          steps: ['Call 1930 immediately','Freeze bank account','Report to RBI Ombudsman'] },
  'Malware':         { score: 88, level: 'CRITICAL',   tags: ['Ransomware','Data Breach'],           steps: ['Disconnect from network','Report to CERT-In','Do not pay ransom'] },
  'Harassment':      { score: 55, level: 'MEDIUM',     tags: ['Cyberbullying'],                      steps: ['Block contacts','Save screenshots','Report to local police'] },
  'Identity Theft':  { score: 79, level: 'HIGH RISK',  tags: ['Identity Fraud'],                     steps: ['Lock Aadhaar via UIDAI','Check CIBIL score','File FIR'] },
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme]       = useState('dark');
  const [glassMode, setGlassMode] = useState(false);
  const [activePage, setActivePage] = useState('analyze');
  const [chatOpen, setChatOpen] = useState(false);
  const [stats, setStats] = useState({ today: 342, review: 89, resolved: 1204, accuracy: 98.4 });
  const [cases, setCases] = useState([
    { id: 'CY-2026-14892', type: 'Financial Fraud', severity: 'CRITICAL',   status: 'Resolved',     date: '2026-05-08', loss: 45000 },
    { id: 'CY-2026-14891', type: 'Phishing',        severity: 'HIGH RISK',  status: 'Under Review', date: '2026-05-08', loss: 0 },
    { id: 'CY-2026-14890', type: 'Account Hack',    severity: 'HIGH RISK',  status: 'Investigating',date: '2026-05-07', loss: 0 },
    { id: 'CY-2026-14889', type: 'Malware',         severity: 'CRITICAL',   status: 'Resolved',     date: '2026-05-06', loss: 1200000 },
  ]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const toggleGlass = () => setGlassMode(g => !g);

  const addCase = (c) => {
    setCases(prev => [c, ...prev]);
    setStats(s => ({ ...s, today: s.today + 1 }));
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, glassMode, toggleGlass, activePage, setActivePage, chatOpen, setChatOpen, stats, setStats, cases, addCase }}>
      {children}
    </AppContext.Provider>
  );
};
