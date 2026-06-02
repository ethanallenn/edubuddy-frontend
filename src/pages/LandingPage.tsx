import React from 'react';
import { useNavigate } from 'react-router-dom';

const featureCards = [
  {
    title: 'AI step-by-step autograder',
    description: 'Go beyond the final answer. Our AI analyzes intermediate steps in complex math, physics, and chemistry equations to pinpoint exact misconceptions.',
  },
  {
    title: 'Interactive STEM workspaces',
    description: 'Native support for Jupyter-style notebooks, rich LaTeX math rendering, and multi-language code execution directly in assignments.',
  },
  {
    title: 'Concept mastery graph',
    description: 'Track conceptual dependencies across subjects. Know exactly when students are ready to move from Algebra to Calculus or Kinematics to Dynamics.',
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(13, 124, 113, 0.24), rgba(13, 124, 113, 0) 30%), radial-gradient(circle at bottom right, rgba(15, 118, 110, 0.18), rgba(15, 118, 110, 0) 28%), linear-gradient(180deg, #061b1a 0%, #082e2a 100%)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '32px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#fff', color: '#0d7c71', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>E</div>
            <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.03em' }}>EduBuddy</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} style={{ border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '999px', padding: '11px 16px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>Sign in</button>
            <button onClick={() => navigate('/signup')} style={{ border: 'none', backgroundColor: '#fff', color: '#0d7c71', borderRadius: '999px', padding: '11px 16px', fontSize: '14px', fontWeight: 900, cursor: 'pointer' }}>Request free trial</button>
          </div>
        </div>

        <div style={{ padding: '60px 0 80px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '40px', alignItems: 'center' }}>
          <div style={{ color: '#fff' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ccfbf1', fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Built for STEM Educators</div>
            <h1 style={{ margin: '18px 0 16px 0', fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 900 }}>The intelligent platform built specifically for STEM.</h1>
            <p style={{ margin: 0, maxWidth: '56ch', color: '#cfeee8', fontSize: '18px', lineHeight: 1.7 }}>EduBuddy turns raw data into a powerful STEM workspace. Equip your classes with algorithmic grading, live code execution, and AI that understands complex math and science workflows.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '26px' }}>
              <button onClick={() => navigate('/signup')} style={{ border: 'none', backgroundColor: '#0d7c71', color: '#fff', borderRadius: '14px', padding: '14px 20px', fontSize: '15px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 16px 34px rgba(13, 124, 113, 0.28)' }}>Request a free trial</button>
              <button onClick={() => navigate('/workspace')} style={{ border: '1px solid rgba(255,255,255,0.22)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', borderRadius: '14px', padding: '14px 20px', fontSize: '15px', fontWeight: 900, cursor: 'pointer' }}>Try out a demo environment</button>
            </div>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '30px', color: '#cfeee8', fontSize: '13px', fontWeight: 700 }}>
              <span>LaTeX supported</span>
              <span>Code autograding</span>
              <span>Jupyter integration</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '30px', padding: '24px', boxShadow: '0 28px 80px rgba(2, 6, 23, 0.32)', border: '1px solid rgba(255,255,255,0.48)' }}>
            <div style={{ borderRadius: '22px', padding: '22px', background: 'linear-gradient(135deg, #0d7c71 0%, #0a5c54 100%)', color: '#fff' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 800, opacity: 0.85 }}>STEM concept pulse</div>
              <div style={{ marginTop: '12px', fontSize: '28px', lineHeight: 1.08, fontWeight: 900 }}>Spot logic gaps early. Launch sandbox assignments.</div>
              <p style={{ margin: '12px 0 0 0', color: '#e6fffb', lineHeight: 1.7 }}>A single place for teachers to monitor algorithmic and mathematical mastery.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginTop: '14px' }}>
              {[
                { label: 'Math Grading', value: 'Step-by-step' },
                { label: 'Code Tasks', value: 'Automated' },
                { label: 'Data Science', value: 'Native CSVs' },
              ].map((item) => (
                <div key={item.label} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</div>
                  <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '48px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {featureCards.map((card) => (
            <div key={card.title} style={{ backgroundColor: '#fff', borderRadius: '22px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 14px 32px rgba(15, 23, 42, 0.04)' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#0d7c71', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Feature</div>
              <h3 style={{ margin: '12px 0 10px 0', fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>{card.title}</h3>
              <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>{card.description}</p>
            </div>
          ))}
        </div>
        </div>
      </div>
  );
};

export default LandingPage;