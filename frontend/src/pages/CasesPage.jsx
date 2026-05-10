import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ToastContext } from '../context/ToastContext';

const SEV_COLOR = { 'CRITICAL': 'red', 'HIGH RISK': 'yellow', 'MEDIUM': 'blue' };

export default function CasesPage() {
  const { cases } = useContext(AppContext);
  const { showToast } = useContext(ToastContext);
  const [search, setSearch]         = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortCol, setSortCol]       = useState('date');
  const [sortAsc, setSortAsc]       = useState(false);

  const filtered = cases
    .filter(c => {
      const q = search.toLowerCase();
      return (
        (c.id.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)) &&
        (!filterType   || c.type   === filterType) &&
        (!filterStatus || c.status === filterStatus)
      );
    })
    .sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (sortCol === 'loss') { va = Number(va); vb = Number(vb); }
      return sortAsc ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
    });

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(a => !a);
    else { setSortCol(col); setSortAsc(true); }
  };

  const exportCSV = () => {
    const header = ['Case ID', 'Type', 'Severity', 'Status', 'Date', 'Loss (₹)'];
    const rows = cases.map(c => [c.id, c.type, c.severity, c.status, c.date, c.loss]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'cybersense_cases.csv'; a.click();
    showToast('Export downloaded successfully', 'success');
  };

  const SortIcon = ({ col }) => (
    <i className={`ti ti-arrows-sort`} style={{ opacity: sortCol === col ? 1 : 0.4 }} />
  );

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="ti ti-folder" /> Case Files Database</div>
        <button className="btn btn-outline" style={{ width: 'auto' }} onClick={exportCSV}>
          <i className="ti ti-download" /> Export CSV
        </button>
      </div>

      <div className="cases-filters">
        <input type="text" placeholder="Search keyword..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Crime Types</option>
          {['Phishing','Account Hack','Financial Fraud','Malware','Harassment','Identity Theft'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {['Under Review','Investigating','Resolved'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {[['id','Case ID'],['type','Type'],['severity','Severity'],['status','Status'],['date','Date Filed'],['loss','Loss']].map(([col, label]) => (
                <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                  {label} <SortIcon col={col} />
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No cases found.</td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>{c.id}</td>
                <td>{c.type}</td>
                <td><span className={`badge ${SEV_COLOR[c.severity] || 'gray'}`}>{c.severity}</span></td>
                <td>{c.status}</td>
                <td>{c.date}</td>
                <td>₹{Number(c.loss).toLocaleString('en-IN')}</td>
                <td><button className="icon-btn" title="View"><i className="ti ti-eye" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
