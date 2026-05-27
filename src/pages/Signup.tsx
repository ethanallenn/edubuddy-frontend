import React, { useState, useEffect } from 'react';
import { signup } from '../api/authService.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    school_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'teacher' as 'teacher' | 'admin'
  });

  const [isInvited, setIsInvited] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlSchoolId = queryParams.get('school_id');
    const urlEmail = queryParams.get('email');
    const urlRole = queryParams.get('role');

    if (urlSchoolId && urlEmail) {
      setFormData(prev => ({
        ...prev,
        school_id: urlSchoolId,
        email: decodeURIComponent(urlEmail),
        role: (urlRole === 'admin' ? 'admin' : 'teacher'),
      }));
      setIsInvited(true);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    if (e.target.name === 'school_id' && !isInvited) {
      value = value.replace(/\D/g, ''); // Sanitization block for manual entries
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-flight client validation checks to protect against empty payloads
    if (formData.school_id.length !== 7) {
      setError('School ID reference must be an exact 7-digit numerical code.');
      return;
    }

    setLoading(true);
    try {
      const result = await signup(formData);
      if (result.status === 'success') {
        navigate('/setup-classes');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration rejected. Verify configuration values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#fff' }}>
      
      {/* LEFT COLUMN: BRAND SOLID PANEL */}
      <div style={{ flex: '1', background: '#0d7c71', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#fff', color: '#0d7c71', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>E</div>
            <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>EduBuddy<span style={{ color: '#fff' }}>.</span></span>
          </div>
          
          <div style={{ marginTop: '60px', maxWidth: '460px' }}>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#99f6e4', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {isInvited ? 'Invitation' : 'Staff Access'}
            </span>
            <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '52px', margin: '16px 0 20px 0', letterSpacing: '-1px' }}>
              {isInvited && formData.first_name ? `Welcome, ${formData.first_name}.` : 'Create your staff account.'}
            </h1>
            <p style={{ color: '#ccfbf1', fontSize: '17px', lineHeight: '26px', opacity: 0.95 }}>Join your school's Portal to manage classes, collaborate with colleagues, and support student learning.</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', fontSize: '13px', color: '#d6fff3' }}>
          <strong style={{ display: 'block', fontSize: '13px' }}>Built for Schools</strong>
          <div style={{ opacity: 0.95, marginTop: '6px', fontSize: '12px' }}>Designed with educators in mind — simple, secure, and school-first.</div>
        </div>
      </div>

      {/* RIGHT COLUMN: DATA FORM CONTAINER */}
      <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}>
          
          <h2 style={{ margin: '0 0 8px 0', color: '#1a202c', fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Register Staff Account</h2>
          <p style={{ margin: '0 0 28px 0', color: '#718096', fontSize: '15px', lineHeight: '22px' }}>Configure your baseline access credentials below to bind your personal profile node.</p>

          {error && (
            <div style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '14px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', borderLeft: '4px solid #0d7c71', fontWeight: '500' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>7-Digit DENI School Number</label>
              <input type="text" name="school_id" maxLength={7} value={formData.school_id} onChange={handleChange} required readOnly={isInvited} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', fontFamily: '"SFMono-Regular", Consolas, monospace', letterSpacing: '1px', outline: 'none', backgroundColor: isInvited ? '#edf2f7' : '#fff' }} placeholder="e.g., 1234567" />
            </div>

            <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="First Name" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Last Name" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>School Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required readOnly={isInvited} placeholder="name@school.com" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none', backgroundColor: isInvited ? '#edf2f7' : '#fff' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>Secure Account Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none', borderLeft: '3px solid #0d7c71' }} />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>Institutional Responsibility Layer</label>
              {isInvited ? (
                <input type="text" value={formData.role === 'admin' ? 'System Administrator' : 'Classroom Teacher / Educator'} readOnly style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none', backgroundColor: '#edf2f7', color: '#4a5568' }} />
              ) : (
                <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', backgroundColor: '#fff', boxSizing: 'border-box', fontSize: '15px', outline: 'none' }}>
                  <option value="teacher">Classroom Teacher / Educator</option>
                  <option value="admin">System Administrator / Head of Department</option>
                </select>
              )}
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#0d7c71', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 124, 113, 0.2)', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Activating Profile Core...' : 'Register Workspace Core'}
            </button>
          </form>

          {!isInvited && (
            <p style={{ textAlign: 'center', fontSize: '15px', color: '#718096', marginTop: '24px', margin: '24px 0 0 0' }}>
              Already registered? <Link to="/login" style={{ color: '#0d7c71', textDecoration: 'none', fontWeight: 'bold' }}>Sign In here</Link>
            </p>
          )}

        </div>
      </div>

    </div>
  );
};

export default Signup;