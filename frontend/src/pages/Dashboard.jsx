import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, chartData: [] });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [incidentType, setIncidentType] = useState('Phishing');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const COLORS = ['#63c740', '#1d9e75', '#E24B4A', '#EF9F27', '#378ADD'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        api.get('/complaints/stats'),
        api.get('/complaints')
      ]);
      setStats(statsRes.data.data);
      setComplaints(complaintsRes.data.data);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) return;
    
    setSubmitting(true);
    try {
      await api.post('/complaints', { incidentType, description });
      setDescription('');
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center animate-pulse text-accent-primary">Loading CyberSense Core...</div>;

  return (
    <div className="min-h-screen bg-bg text-text-main p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-2xl font-bold flex items-center gap-2">
          <span>🛡️</span> Cyber<span className="text-accent-primary">Sense</span> AI
        </div>
        <div className="flex items-center gap-4">
          <span className="text-text-muted">Agent: <strong className="text-text-main">{user?.name}</strong></span>
          <button onClick={handleLogout} className="btn-outline text-sm">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-text-muted mb-2 font-medium tracking-wide">TOTAL SCANS</h3>
            <p className="text-5xl font-bold text-info">{stats.total}</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-text-muted mb-2 font-medium tracking-wide">THREATS NEUTRALIZED</h3>
            <p className="text-5xl font-bold text-accent-primary">{stats.resolved}</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-text-muted mb-2 font-medium tracking-wide">PENDING ANALYSIS</h3>
            <p className="text-5xl font-bold text-warning">{stats.pending}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart Section */}
          <div className="glass-card p-6 h-[400px] flex flex-col">
            <h3 className="text-xl font-bold mb-4">Threat Distribution</h3>
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111420', border: '1px solid rgba(99, 153, 34, 0.18)', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8f9fa' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Submission Form */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Submit Intelligence Report</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-text-muted text-sm mb-2">Threat Category</label>
                <select 
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-[rgba(0,0,0,0.2)] border border-border text-text-main py-3 px-4 rounded-lg focus:outline-none focus:border-accent-primary transition-colors appearance-none"
                >
                  <option className="bg-surface text-text-main">Phishing</option>
                  <option className="bg-surface text-text-main">Malware</option>
                  <option className="bg-surface text-text-main">Data Breach</option>
                  <option className="bg-surface text-text-main">Identity Theft</option>
                  <option className="bg-surface text-text-main">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-text-muted text-sm mb-2">Threat Vector Details</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Describe the malicious activity observed..."
                  className="w-full bg-[rgba(0,0,0,0.2)] border border-border text-text-main py-3 px-4 rounded-lg focus:outline-none focus:border-accent-primary transition-colors resize-none"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={submitting || !description}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Running AI Diagnostics...' : 'Submit to CyberSense Core'}
              </button>
            </form>
          </div>
        </div>

        {/* Intelligence Log */}
        <div className="glass-card p-6 overflow-hidden">
          <h3 className="text-xl font-bold mb-4">Recent Intelligence Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-text-muted text-sm">
                  <th className="pb-3 px-4 font-medium">Date</th>
                  <th className="pb-3 px-4 font-medium">Category</th>
                  <th className="pb-3 px-4 font-medium">AI Confidence</th>
                  <th className="pb-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-text-muted">No intelligence reports submitted yet.</td>
                  </tr>
                ) : (
                  complaints.map(complaint => (
                    <tr key={complaint._id} className="border-b border-[rgba(99,153,34,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="py-4 px-4">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 font-medium">{complaint.incidentType}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-surface rounded-full h-2 max-w-[100px]">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${complaint.aiConfidenceScore}%`,
                                backgroundColor: complaint.aiConfidenceScore > 85 ? '#E24B4A' : complaint.aiConfidenceScore > 75 ? '#EF9F27' : '#63c740'
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-text-muted">{complaint.aiConfidenceScore}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          complaint.status === 'Resolved' ? 'bg-[rgba(99,199,64,0.2)] text-accent-primary' : 
                          'bg-[rgba(239,159,39,0.2)] text-warning'
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
