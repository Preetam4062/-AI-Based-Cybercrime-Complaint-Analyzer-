import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email || !password || (!isLoginMode && !name)) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-main flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-text-main mb-2">
          <span>🛡️</span> Cyber<span className="text-accent-primary">Sense</span> AI
        </h1>
        <p className="text-text-muted">Enterprise Threat Intelligence</p>
      </div>
      
      <div className="glass-card p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLoginMode ? 'Agent Login' : 'Agent Registration'}</h2>
        
        {error && <div className="mb-4 p-3 bg-[rgba(226,75,74,0.1)] border border-danger text-danger rounded-lg text-sm text-center">{error}</div>}
        
        {!isLoginMode && (
          <div className="mb-4">
            <label className="block text-text-muted text-sm mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent Smith" 
              className="w-full bg-[rgba(0,0,0,0.2)] border border-border text-text-main py-3 px-4 rounded-lg focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-text-muted text-sm mb-2">Agent ID / Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="agent@cybersense.gov.in" 
            className="w-full bg-[rgba(0,0,0,0.2)] border border-border text-text-main py-3 px-4 rounded-lg focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-text-muted text-sm mb-2">Security Clearance (Password)</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full bg-[rgba(0,0,0,0.2)] border border-border text-text-main py-3 px-4 rounded-lg focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>
        
        <button 
          onClick={handleAuth}
          disabled={loading}
          className="btn-primary w-full flex justify-center items-center gap-2 mb-4"
        >
          {loading ? (
            <span className="animate-pulse">{isLoginMode ? 'Authenticating...' : 'Registering...'}</span>
          ) : (
            isLoginMode ? 'Authenticate' : 'Register'
          )}
        </button>

        <p className="text-center text-text-muted text-sm">
          {isLoginMode ? "Don't have an agent account?" : "Already registered?"}{' '}
          <button 
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
            className="text-accent-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            {isLoginMode ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
