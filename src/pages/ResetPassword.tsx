import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing reset token. Please request a new link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to reset password.');

      setStatus('success');
      setMessage('Your password has been reset successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message);
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
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#99f6e4', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Account Support</span>
            <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '52px', margin: '16px 0 20px 0', letterSpacing: '-1px' }}>Set a secure new password.</h1>
            <p style={{ color: '#ccfbf1', fontSize: '17px', lineHeight: '26px', opacity: 0.95 }}>Set a strong password to maintain access to your school's Portal and resources.</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', fontSize: '13px', color: '#d6fff3' }}>
          <strong style={{ display: 'block', fontSize: '13px' }}>Built for Schools</strong>
          <div style={{ opacity: 0.95, marginTop: '6px', fontSize: '12px' }}>Designed with educators in mind — simple, secure, and school-first.</div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}>

          <h2 style={{ margin: '0 0 8px 0', color: '#1a202c', fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Set New Password</h2>
          <p style={{ margin: '0 0 28px 0', color: '#718096', fontSize: '15px', lineHeight: '22px' }}>Please enter your new secure password below.</p>

          {status === 'success' ? (
            <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '14px 16px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '14px', marginBottom: '12px' }}>{message}</div>
          ) : (
            <form onSubmit={handleSubmit}>
              {(status === 'error' || message) && (
                <div style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '14px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', borderLeft: '4px solid #0d7c71' }}>{message}</div>
              )}

              <fieldset disabled={!token || status === 'loading'}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>New Password</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>Confirm New Password</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-type password" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none' }} />
                </div>

                <button type="submit" style={{ width: '100%', padding: '16px', background: '#0d7c71', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 124, 113, 0.12)', opacity: status === 'loading' ? 0.6 : 1 }}>{status === 'loading' ? 'Updating...' : 'Update Password'}</button>
              </fieldset>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;