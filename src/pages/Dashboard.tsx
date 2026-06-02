import React, { useState, useEffect } from 'react';
import { fetchDashboardSummary } from '../api/dashboardService.js';
import { useNavigate } from 'react-router-dom';

interface SchoolClass {
  class_id: string;
  class_name: string;
  academic_year: string;
}

interface DashboardSummary {
  classCount: number;
  studentCount: number;
  assessmentCount: number;
  averagePerformance: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    classCount: 0,
    studentCount: 0,
    assessmentCount: 0,
    averagePerformance: 0,
  });
  const [loading, setLoading] = useState(true);

  // Extract logged-in teacher context from session memory
  const userString = localStorage.getItem('edubuddy_user');
  const user = userString ? JSON.parse(userString) : null;
  const schoolId = user?.school_id || localStorage.getItem('edubuddy_school_id') || '';
  const teacherName = user ? `${user.first_name} ${user.last_name}` : 'Educator';

  useEffect(() => {
    const loadDashboardMetrics = async () => {
      try {
        const response = await fetchDashboardSummary();
        if (response.status === 'success') {
          setClasses(response.data.classes ?? []);
          setSummary(response.data.summary ?? {
            classCount: 0,
            studentCount: 0,
            assessmentCount: 0,
            averagePerformance: 0,
          });
        }
      } catch (err) {
        const status = (err as { response?: { status?: number } } | undefined)?.response?.status;

        if (status === 401 || status === 403) {
          localStorage.removeItem('edubuddy_token');
          localStorage.removeItem('edubuddy_user');
          localStorage.removeItem('edubuddy_school_id');
          navigate('/login');
          return;
        }

        console.error('Failed fetching dashboard data from the backend.', err);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardMetrics();
  }, []);

  const handleLogoutExecute = () => {
    localStorage.removeItem('edubuddy_token');
    localStorage.removeItem('edubuddy_user');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* 1. SLIMLINE TOP NAVIGATION BAR */}
      <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        {/* Logo Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <div style={{ width: '28px', height: '24px', backgroundColor: '#0d7c71', color: '#fff', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '13px' }}>E</div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#1a202c', letterSpacing: '-0.5px' }}>EduBuddy</span>
        </div>

        {/* Tab Selection Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0d7c71', borderBottom: '2px solid #0d7c71', padding: '22px 0', cursor: 'pointer' }}>Home</span>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#718096', cursor: 'pointer', transition: 'color 0.15s' }} onClick={() => alert('Diagnostic Reports analytics compilation model loading...')}>Reports</span>
          {user?.role === 'admin' && (
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#718096', cursor: 'pointer' }} onClick={() => navigate(`/${schoolId}/admin`)}>Admin</span>
          )}
          <button onClick={handleLogoutExecute} style={{ background: 'none', border: 'none', padding: 0, fontSize: '14px', fontWeight: '600', color: '#e53e3e', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      {/* MAIN DASHBOARD CONTENT GRID */}
      <div style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 24px', boxSizing: 'border-box' }}>
        
        {/* 2. FRIENDLY GREETING WELCOME BANNER */}
        <div style={{ background: 'linear-gradient(135deg, #0d7c71 0%, #0a5c54 100%)', borderRadius: '12px', padding: '36px 40px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(13, 124, 113, 0.1)', marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Welcome, {teacherName}.</h1>
          <p style={{ margin: 0, color: '#ccfbf1', fontSize: '16px', opacity: 0.95 }}>What can I help you with today?</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #effaf8 100%)', border: '1px solid #d9ebe8', borderRadius: '22px', padding: '26px 28px', boxShadow: '0 18px 44px rgba(15, 23, 42, 0.05)', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '18px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '760px' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#0d7c71', letterSpacing: '0.14em', textTransform: 'uppercase' }}>AI executive summary</div>
              <h2 style={{ margin: '10px 0 8px 0', fontSize: '28px', lineHeight: 1.08, letterSpacing: '-0.04em', color: '#0f172a', fontWeight: 900 }}>
                {summary.classCount > 0
                  ? `${summary.classCount} classes are live, with ${summary.studentCount} students tracked and ${summary.assessmentCount} assessments ready to review.`
                  : 'No live classes yet. The platform is ready for the first class setup and assignment workflow.'}
              </h2>
              <p style={{ margin: 0, color: '#475569', fontSize: '15px', lineHeight: 1.7 }}>
                {summary.averagePerformance > 0
                  ? `Average performance is ${summary.averagePerformance}%, which makes this workspace useful for leaders who want a quick view of momentum and next actions.`
                  : 'Once the first assessments are published, the dashboard will generate a concise AI-style brief for leaders and investors.'}
              </p>
            </div>

            <div style={{ minWidth: '220px', display: 'grid', gap: '10px' }}>
              <button onClick={() => navigate('/setup-classes')} style={{ border: 'none', backgroundColor: '#0d7c71', color: '#fff', borderRadius: '14px', padding: '12px 16px', fontSize: '14px', fontWeight: 900, cursor: 'pointer' }}>Create a class</button>
              <button onClick={() => navigate('/workspace')} style={{ border: '1px solid #cbd5e0', backgroundColor: '#fff', color: '#0f172a', borderRadius: '14px', padding: '12px 16px', fontSize: '14px', fontWeight: 900, cursor: 'pointer' }}>Open workspace</button>
            </div>
          </div>
        </div>

        {/* 3. CHART METRICS WRAPPER MODULES */}
        <h3 style={{ margin: '0 0 16px 0', color: '#1a202c', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>Performance Analytics Preview</h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          
          <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', minHeight: '140px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Classes</span>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#0d7c71', margin: '12px 0 4px 0' }}>{summary.classCount}</div>
            <p style={{ margin: 0, fontSize: '12px', color: '#48bb78' }}>Loaded directly from the classes table</p>
          </div>

          <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', minHeight: '140px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enrolled Students</span>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#2b6cb0', margin: '12px 0 4px 0' }}>{summary.studentCount}</div>
            <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0' }}>Aggregated from the students table</p>
          </div>

          <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', minHeight: '140px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Performance</span>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#dd6b20', margin: '12px 0 4px 0' }}>{summary.averagePerformance}%</div>
            <p style={{ margin: 0, fontSize: '12px', color: '#dd6b20', fontWeight: '500' }}>{summary.assessmentCount} assessments stored in the grades table</p>
          </div>

        </div>

        {/* 4. ACTIVE ENROLLED CLASSES GRID */}
        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#1a202c', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>Your Active Enrolled Groups</h3>
          <button onClick={() => navigate('/setup-classes')} style={{ padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #cbd5e0', borderRadius: '6px', color: '#0d7c71', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.15s' }}>+ Create New Class</button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#718096', fontSize: '14px' }}>Loading classroom profiles data loops...</div>
        ) : classes.length === 0 ? (
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed #cbd5e0', padding: '48px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 16px 0', color: '#718096', fontSize: '15px' }}>You do not have any classes yet. Add one to start tracking students and assessments.</p>
            <button onClick={() => navigate('/setup-classes')} style={{ padding: '12px 20px', backgroundColor: '#0d7c71', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Run Class Setup Wizard</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {classes.map((cls) => (
              <div key={cls.class_id} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/dashboard/classes/${cls.class_id}`); }} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }} onClick={() => navigate(`/dashboard/classes/${cls.class_id}`)}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', backgroundColor: '#e2e8f0', color: '#4a5568', padding: '4px 8px', borderRadius: '4px' }}>{cls.academic_year}</span>
                    <span style={{ fontSize: '18px' }}>📚</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#1a202c', fontSize: '18px', fontWeight: '700', lineHeight: '24px' }}>{cls.class_name}</h4>
                </div>
                
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#718096' }}>Roster Active</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0d7c71' }}>View Gradebook →</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;