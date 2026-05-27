import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, school_id: schoolId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      localStorage.setItem('token', data.token);
      navigate(`/${schoolId}/dashboard`);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#fff' }}>
      <div style={{ flex: '1', background: '#0d7c71', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#fff', color: '#0d7c71', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>E</div>
            <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>EduBuddy<span style={{ color: '#fff' }}>.</span></span>
          </div>

          <div style={{ marginTop: '60px', maxWidth: '460px' }}>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#99f6e4', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Staff Portal</span>
            <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '52px', margin: '16px 0 20px 0', letterSpacing: '-1px' }}>Access your school dashboard.</h1>
            <p style={{ color: '#ccfbf1', fontSize: '17px', lineHeight: '26px', opacity: 0.95 }}>Sign in to manage classes, monitor student progress, and access teaching resources.</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', fontSize: '13px', color: '#d6fff3' }}>
          <strong style={{ display: 'block', fontSize: '13px' }}>Built for Schools</strong>
          <div style={{ opacity: 0.95, marginTop: '6px', fontSize: '12px' }}>Designed with educators in mind — simple, secure, and school-first.</div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ margin: '0 0 8px 0', color: '#1a202c', fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Sign In</h2>
            <p style={{ margin: '0 0 8px 0', color: '#718096', fontSize: '15px' }}>Workspace: <span style={{ color: '#0d7c71', fontWeight: 700 }}>{schoolId}</span></p>
          </div>

          {status === 'error' && (
            <div style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '14px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', borderLeft: '4px solid #0d7c71', fontWeight: '500' }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>School Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@school.edu" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>Password</label>
                <Link to={`/${schoolId}/forgot-password`} style={{ color: '#0d7c71', fontSize: '13px', fontWeight: 700 }}>Forgot password?</Link>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none' }} />
            </div>

            <button type="submit" disabled={status === 'loading'} style={{ width: '100%', padding: '16px', background: '#0d7c71', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 124, 113, 0.12)', opacity: status === 'loading' ? 0.6 : 1 }}>
              {status === 'loading' ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '15px', color: '#718096', marginTop: '20px' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#0d7c71', fontWeight: 700 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;