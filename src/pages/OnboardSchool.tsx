import React, { useState } from 'react';
import { registerSchool } from '../api/schoolService.js';
import { sendBatchInvitations } from '../api/schoolService.js';
import { useNavigate, Link } from 'react-router-dom';

interface TeamInvite {
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'teacher';
}

const OnboardSchool: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Track active tab panel (1 - 5)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields State
  const [schoolId, setSchoolId] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [postcode, setPostcode] = useState('');
  
  // Dynamic Team Array Rows
  const [sltMembers, setSltMembers] = useState<TeamInvite[]>([{ first_name: '', last_name: '', email: '', role: 'admin' }]);
  const [deptHeads, setDeptHeads] = useState<TeamInvite[]>([{ first_name: '', last_name: '', email: '', role: 'teacher' }]);

  // Progress Bar Helper Layout Calculation
  const totalSteps = 5;
  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  // Add Row Helpers
  const addSltRow = () => setSltMembers([...sltMembers, { first_name: '', last_name: '', email: '', role: 'admin' }]);
  const addDeptRow = () => setDeptHeads([...deptHeads, { first_name: '', last_name: '', email: '', role: 'teacher' }]);

  // Input Change Array Handling
  const handleSltChange = (index: number, field: keyof TeamInvite, value: string) => {
    const updated = [...sltMembers];
    updated[index][field] = value as any;
    setSltMembers(updated);
  };

  const handleDeptChange = (index: number, field: keyof TeamInvite, value: string) => {
    const updated = [...deptHeads];
    updated[index][field] = value as any;
    setDeptHeads(updated);
  };

  // Final Submission Loop Processing Engine
  const handleFinalSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // 1. First register the base school environment node
      const schoolResult = await registerSchool({ school_id: schoolId, school_name: schoolName, postcode });
      
      if (schoolResult.status === 'success') {
        // 2. Combine invites array safely filtering out empty slots
        const allInvites = [
          ...sltMembers.filter(m => m.email),
          ...deptHeads.filter(m => m.email)
        ];

        if (allInvites.length > 0) {
          await sendBatchInvitations(schoolId, allInvites);
        }

        setStep(5); // Advance to dynamic Success Completion Tab Panel
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Onboarding compilation process failed. Check network connections.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#fff' }}>
      
      {/* LEFT COLUMN: IDENTICAL BRAND SPLASH WITH THE MATCHING TEAL COLOR */}
      <div style={{ flex: '1', background: '#0d7c71', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#fff', color: '#0d7c71', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>E</div>
            <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>EduBuddy<span style={{ color: '#fff' }}>.</span></span>
          </div>
          
          <div style={{ marginTop: '60px', maxWidth: '460px' }}>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#99f6e4', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>School Setup</span>
            <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '52px', margin: '16px 0 20px 0', letterSpacing: '-1px' }}>Prepare your school's workspace.</h1>
            <p style={{ color: '#ccfbf1', fontSize: '17px', lineHeight: '26px', opacity: 0.95 }}>Create school records, invite staff, and configure classes to get teaching and learning started.</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', fontSize: '13px', color: '#d6fff3' }}>
          <strong style={{ display: 'block', fontSize: '13px' }}>Built for Schools</strong>
          <div style={{ opacity: 0.95, marginTop: '6px', fontSize: '12px' }}>Designed with educators in mind — simple, secure, and school-first.</div>
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIONABLE MULTI-TAB WORKSPACE CONTENT */}
      <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}>
          
          {/* PROGRESS BAR ASSEMBLY HEADER BLOCK */}
          {step < 5 && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#718096', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span>Step {step} of 4</span>
                <span>{Math.round(progressPercent)}% Complete</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', position: 'relative' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#0d7c71', borderRadius: '3px', transition: 'width 0.3s ease-in-out' }} />
              </div>
            </div>
          )}

          {error && (
            <div style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '14px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', borderLeft: '4px solid #0d7c71', fontWeight: '500' }}>
              ⚠️ {error}
            </div>
          )}

          {/* TAB PANEL STEP 1: SCHOOL NUMBER IDENTIFIER CODE */}
          {step === 1 && (
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#1a202c', fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>School Number</h2>
              <p style={{ margin: '0 0 32px 0', color: '#718096', fontSize: '15px' }}>Enter your official 7-digit DE Reference Code (DENI Number).</p>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>7-Digit Code</label>
                <input type="text" maxLength={7} value={schoolId} onChange={(e) => setSchoolId(e.target.value.replace(/\D/g, ''))} required placeholder="e.g., 1234567" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '16px', fontFamily: '"SFMono-Regular", Consolas, monospace', letterSpacing: '1px', outline: 'none' }} />
              </div>
              <button disabled={schoolId.length !== 7} onClick={() => setStep(2)} style={{ width: '100%', padding: '16px', background: '#0d7c71', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: schoolId.length !== 7 ? 0.5 : 1 }}>Continue</button>
            </div>
          )}

          {/* TAB PANEL STEP 2: INSTITUTION NAME MAP */}
          {step === 2 && (
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#1a202c', fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>School Name</h2>
              <p style={{ margin: '0 0 32px 0', color: '#718096', fontSize: '15px' }}>State the official designated name of your educational facility.</p>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>Official Designation</label>
                <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required placeholder="e.g., Queen's Academy Belfast" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => setStep(1)} style={{ padding: '16px 24px', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#4a5568' }}>Back</button>
                <button disabled={!schoolName} onClick={() => setStep(3)} style={{ flex: 1, padding: '16px', background: '#0d7c71', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: !schoolName ? 0.5 : 1 }}>Continue</button>
              </div>
            </div>
          )}

          {/* TAB PANEL STEP 3: REGIONAL POSTCODE TRACK */}
          {step === 3 && (
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#1a202c', fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>School Postcode</h2>
              <p style={{ margin: '0 0 32px 0', color: '#718096', fontSize: '15px' }}>Enter the geographic postal sorting code routing location.</p>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>Postcode Location</label>
                <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} required placeholder="e.g., BT9 5AJ" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => setStep(2)} style={{ padding: '16px 24px', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#4a5568' }}>Back</button>
                <button disabled={!postcode} onClick={() => setStep(4)} style={{ flex: 1, padding: '16px', background: '#0d7c71', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: !postcode ? 0.5 : 1 }}>Continue</button>
              </div>
            </div>
          )}

          {/* TAB PANEL STEP 4: COLLABORATOR/STAFF INVITATION ROW COMPILER */}
          {step === 4 && (
            <div>
              <h2 style={{ margin: '0 0 4px 0', color: '#1a202c', fontSize: '28px', fontWeight: '800', letterSpacing: '-1px' }}>Invite Faculty Staff</h2>
              <p style={{ margin: '0 0 24px 0', color: '#718096', fontSize: '14px', lineHeight: '20px' }}>Provision user accounts. Senior Leadership members will be designated as platform system administrators automatically.</p>

              {/* SLT COLUMN MAPPING CONFIG */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#2d3748', fontSize: '15px', fontWeight: '700' }}>Senior Leadership Team (Admins)</h4>
                {sltMembers.map((member, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input type="text" placeholder="First Name" value={member.first_name} onChange={(e) => handleSltChange(i, 'first_name', e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
                    <input type="text" placeholder="Last Name" value={member.last_name} onChange={(e) => handleSltChange(i, 'last_name', e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
                    <input type="email" placeholder="Email Address" value={member.email} onChange={(e) => handleSltChange(i, 'email', e.target.value)} style={{ flex: 1.5, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
                  </div>
                ))}
                <button type="button" onClick={addSltRow} style={{ marginTop: '4px', background: 'none', border: 'none', color: '#0d7c71', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>+ Add Administrator</button>
              </div>

              {/* DEPARTMENT HEAD ROW CONTEXT */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#2d3748', fontSize: '15px', fontWeight: '700' }}>Department Heads (Teachers)</h4>
                {deptHeads.map((member, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input type="text" placeholder="First Name" value={member.first_name} onChange={(e) => handleDeptChange(i, 'first_name', e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
                    <input type="text" placeholder="Last Name" value={member.last_name} onChange={(e) => handleDeptChange(i, 'last_name', e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
                    <input type="email" placeholder="Email Address" value={member.email} onChange={(e) => handleDeptChange(i, 'email', e.target.value)} style={{ flex: 1.5, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
                  </div>
                ))}
                <button type="button" onClick={addDeptRow} style={{ marginTop: '4px', background: 'none', border: 'none', color: '#0d7c71', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>+ Add Department Head</button>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => setStep(3)} style={{ padding: '16px 24px', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#4a5568' }}>Back</button>
                <button onClick={handleFinalSubmit} disabled={loading} style={{ flex: 1, padding: '16px', background: '#0d7c71', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {loading ? 'Initializing Workspace Cluster...' : 'Complete Onboarding & Dispatch Invites'}
                </button>
              </div>
            </div>
          )}

          {/* TAB PANEL STEP 5: FINAL SYSTEM ONBOARDED VIEW DISPLAY */}
          {step === 5 && (
            <div>
              <div style={{ background: '#fff', padding: '10px 0', textAlign: 'left' }}>
                <h2 style={{ margin: '0 0 8px 0', color: '#1a202c', fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Environment Ready</h2>
                <p style={{ margin: '0 0 28px 0', color: '#718096', fontSize: '15px', lineHeight: '24px' }}>
                  The environment profile maps for <strong style={{ color: '#1a202c' }}>{schoolName}</strong> ({schoolId.slice(0,3)}-{schoolId.slice(3)}) have completely compiled. Secure email notification nodes have been dispatched to all team layers.
                </p>

                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e0', marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Your Local Institutional Target Pin</label>
                  <div style={{ fontFamily: '"SFMono-Regular", Consolas, monospace', fontSize: '22px', fontWeight: 'bold', color: '#0d7c71', letterSpacing: '1px' }}>{schoolId}</div>
                </div>

                <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '16px', background: '#0d7c71', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 124, 113, 0.2)' }}>
                  Enter Secure Portal Gateway
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default OnboardSchool;