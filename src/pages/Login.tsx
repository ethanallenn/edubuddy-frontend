import React, { useState } from 'react';
import { login } from '../api/authService.js';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.status === 'success') {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email/password combination or server offline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#fff' }}>
      
      {/* LEFT COLUMN: BRAND SOLID TEAL SPLASH */}
      <div style={{ flex: '1', background: '#0d7c71', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#fff', color: '#0d7c71', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>E</div>
            <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>EduBuddy<span style={{ color: '#fff' }}>.</span></span>
          </div>
          
          <div style={{ marginTop: '60px', maxWidth: '460px' }}>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#99f6e4', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Staff Access Portal</span>
            <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '52px', margin: '16px 0 20px 0', letterSpacing: '-1px' }}>Welcome back to your workspace cockpit.</h1>
            <p style={{ color: '#ccfbf1', fontSize: '17px', lineHeight: '26px', opacity: 0.9 }}>Review live class metrics, aggregate STEM performance indices, and log student diagnostic insights securely.</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '24px', display: 'flex', gap: '40px' }}>
          <div>
            <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#99f6e4' }}>System Status</h5>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>Secure Encrypted Connection Pipeline</p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SIGN IN FORM */}
      <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
          
          <h2 style={{ margin: '0 0 8px 0', color: '#1a202c', fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Sign In</h2>
          <p style={{ margin: '0 0 36px 0', color: '#718096', fontSize: '15px', lineHeight: '22px' }}>Enter your configuration keys below to unlock your active workspace.</p>

          {error && (
            <div style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '14px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', borderLeft: '4px solid #0d7c71', fontWeight: '500' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>Work Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="e.g., teacher@school.com" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', transition: 'border-color 0.2s', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '36px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>Account Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', transition: 'border-color 0.2s', outline: 'none' }} />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#0d7c71', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 124, 113, 0.2)', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Verifying Credentials...' : 'Authorize Session'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '15px', color: '#718096', marginTop: '28px', margin: '28px 0 0 0' }}>
            New to the environment? <Link to="/signup" style={{ color: '#0d7c71', textDecoration: 'none', fontWeight: 'bold' }}>Register Staff Member</Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;