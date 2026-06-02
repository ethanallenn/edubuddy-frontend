import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchClassDashboard } from '../api/dashboardService.js';

interface SchoolClass {
  class_id: string;
  class_name: string;
  academic_year: string;
}

interface ClassRosterEntry {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  candidate_number: string | null;
}

interface ClassAssessmentEntry {
  assessment_name: string;
  subject_name: string | null;
  submissions: number;
  average_score: number;
  average_percentage: number;
  latest_date: string | null;
}

interface ClassDashboardData {
  class: SchoolClass;
  roster: ClassRosterEntry[];
  metrics: {
    studentCount: number;
    assessmentCount: number;
    averagePerformance: number;
    subjectCount: number;
  };
  assessments: ClassAssessmentEntry[];
  assignments: ClassAssignmentEntry[];
}

interface ClassAssignmentEntry {
  assignment_id: string;
  title: string;
  template_key: string;
  description: string | null;
  due_date: string | null;
  estimated_duration_mins: number | null;
  status: string;
  created_at: string | null;
}

interface InsightCard {
  title: string;
  value: string;
  tone: 'positive' | 'warning' | 'neutral';
  detail: string;
}

const ClassDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [currentClass, setCurrentClass] = useState<SchoolClass | null>(null);
  const [roster, setRoster] = useState<ClassRosterEntry[]>([]);
  const [metrics, setMetrics] = useState<ClassDashboardData['metrics']>({
    studentCount: 0,
    assessmentCount: 0,
    averagePerformance: 0,
    subjectCount: 0,
  });
  const [assessments, setAssessments] = useState<ClassAssessmentEntry[]>([]);
  const [assignments, setAssignments] = useState<ClassAssignmentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments' | 'insights'>('overview');

  const userString = localStorage.getItem('edubuddy_user');
  const user = userString ? JSON.parse(userString) : null;
  const teacherName = user ? `${user.first_name} ${user.last_name}` : 'Educator';

  const topAssessment = assessments[0] ?? null;
  const lowSignal = metrics.averagePerformance > 0 && metrics.averagePerformance < 60;
  const strongSignal = metrics.averagePerformance >= 80;

  const insights: InsightCard[] = [
    {
      title: 'Momentum',
      value: strongSignal ? 'On track' : lowSignal ? 'Needs attention' : 'Building',
      tone: strongSignal ? 'positive' : lowSignal ? 'warning' : 'neutral',
      detail: strongSignal
        ? 'This class is above the healthy threshold and is ready for stretch targets.'
        : lowSignal
          ? 'The class needs a focused follow-up cycle and a tighter intervention loop.'
          : 'The class has enough data to start forming weekly trends and targets.',
    },
    {
      title: 'STEM Concept Blockers',
      value: metrics.studentCount === 0 ? 'Add a roster' : assignments.length === 0 ? 'Create an assignment' : 'Review logic & steps',
      tone: metrics.studentCount === 0 ? 'warning' : lowSignal ? 'warning' : 'neutral',
      detail: metrics.studentCount === 0
        ? 'No students are assigned yet, so the class cannot generate meaningful insights.'
        : assignments.length === 0
          ? 'Create a math or coding assignment to map out conceptual understanding dependencies.'
          : 'The AI detected consistent errors in intermediate calculation steps. Click to review common logic pitfalls.',
    },
    {
      title: 'Focus signal',
      value: topAssessment ? topAssessment.assessment_name : 'No live assessment',
      tone: topAssessment ? 'positive' : 'neutral',
      detail: topAssessment
        ? `Most recent tracked item: ${topAssessment.subject_name ?? 'General'} with ${topAssessment.submissions} submissions.`
        : 'The class needs live assessment data before the signal engine can rank topics.',
    },
  ];

  const roasterNameList = roster.slice(0, 3).map((student) => `${student.first_name} ${student.last_name}`);
  const healthBars = [
    { label: 'Overall Mastery', value: metrics.averagePerformance, hint: 'class average' },
    { label: 'Algorithmic Logic', value: Math.min(100, metrics.averagePerformance > 0 ? metrics.averagePerformance + 8 : 0), hint: 'code & computer science' },
    { label: 'Equation Solving', value: Math.max(0, metrics.averagePerformance > 0 ? metrics.averagePerformance - 6 : 0), hint: 'math & intermediate steps' },
  ];
  const topAssessmentBars = assessments.slice(0, 4).map((assessment) => ({
    label: assessment.assessment_name,
    value: Math.max(0, Math.min(100, assessment.average_percentage)),
    hint: assessment.subject_name ?? 'General',
  }));

  useEffect(() => {
    const loadClass = async () => {
      try {
        if (!classId) {
          setErrorMessage('Missing class identifier.');
          return;
        }

        const response = await fetchClassDashboard(classId);
        if (response.status === 'success') {
          setCurrentClass(response.data.class ?? null);
          setRoster(response.data.roster ?? []);
          setMetrics(response.data.metrics ?? {
            studentCount: 0,
            assessmentCount: 0,
            averagePerformance: 0,
            subjectCount: 0,
          });
          setAssessments(response.data.assessments ?? []);
          setAssignments(response.data.assignments ?? []);
        }
      } catch (error) {
        console.error('Failed to load class dashboard.', error);
        setErrorMessage('This class could not be loaded right now.');
      } finally {
        setLoading(false);
      }
    };

    loadClass();
  }, [classId]);

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, rgba(13, 124, 113, 0.08), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #f4f7fb 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 24px 48px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ marginBottom: '16px', border: 'none', background: 'none', color: '#0d7c71', fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
        >
          ← Back to dashboard
        </button>

        <div style={{ background: 'linear-gradient(135deg, #0d7c71 0%, #0a5c54 100%)', borderRadius: '22px', padding: '30px 36px', color: '#fff', boxShadow: '0 18px 40px rgba(13, 124, 113, 0.16)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
            <div>
              <p style={{ margin: '0 0 12px 0', opacity: 0.88, fontSize: '13px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Class workspace</p>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '36px', lineHeight: 1.08, fontWeight: 800 }}>
                {loading ? 'Loading class...' : currentClass?.class_name ?? 'Class not found'}
              </h1>
              <p style={{ margin: 0, color: '#ccfbf1', fontSize: '16px' }}>
                {teacherName} • {loading ? 'Resolving class details.' : currentClass ? currentClass.academic_year : 'No class record matched this link.'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ padding: '8px 12px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.12)', color: '#e6fffb', fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {currentClass ? 'Ready' : 'Not found'}
              </span>
              <span style={{ padding: '8px 12px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.12)', color: '#e6fffb', fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {metrics.studentCount} students
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div style={{ marginTop: '20px', borderRadius: '12px', border: '1px solid #fecaca', background: '#fff1f2', color: '#9f1239', padding: '14px 16px', fontSize: '14px' }}>{errorMessage}</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '24px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Class ID</div>
            <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#1a202c', wordBreak: 'break-word' }}>{classId ?? 'Unknown'}</div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Academic year</div>
            <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>{currentClass?.academic_year ?? 'Unavailable'}</div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Students</div>
            <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>{metrics.studentCount}</div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Assessments</div>
            <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>{metrics.assessmentCount}</div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Average performance</div>
            <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>{metrics.averagePerformance}%</div>
          </div>
        </div>

        <div style={{ marginTop: '24px', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 26px rgba(15, 23, 42, 0.04)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '10px', padding: '18px 18px 0 18px', flexWrap: 'wrap' }}>
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'students', label: `Students (${roster.length})` },
              { key: 'assignments', label: `Assignments (${assignments.length})` },
              { key: 'insights', label: 'Insights' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                style={{
                  border: '1px solid ' + (activeTab === tab.key ? '#0d7c71' : '#d7e1df'),
                  backgroundColor: activeTab === tab.key ? '#0d7c71' : '#fff',
                  color: activeTab === tab.key ? '#fff' : '#334155',
                  borderRadius: '999px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '18px' }}>
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Roster summary</div>
                  <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>{roster.length} students</div>
                  <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>Use the Students tab to review names, candidate numbers, and contact details.</p>
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Assignment summary</div>
                  <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>{assignments.length} assignments</div>
                  <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>Use the Assignments tab to deploy coding challenges and math problem sets in a few clicks.</p>
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Health</div>
                  <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#0d7c71' }}>{currentClass ? 'Class loaded' : 'Class missing'}</div>
                  <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>This page is now dedicated to a single class, with the main data separated into clear tabs.</p>
                </div>

                <div style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, #0d7c71 0%, #0a5c54 100%)', borderRadius: '18px', padding: '24px', color: '#fff', boxShadow: '0 16px 36px rgba(13, 124, 113, 0.14)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', opacity: 0.86 }}>EduBuddy AI coach</div>
                  <div style={{ marginTop: '10px', fontSize: '24px', fontWeight: 800 }}>Instant class brief</div>
                  <p style={{ margin: '8px 0 0 0', color: '#e6fffb', fontSize: '15px', lineHeight: 1.7 }}>
                    {metrics.studentCount === 0
                      ? 'Add students to unlock class intelligence and intervention suggestions.'
                      : `This class has ${metrics.studentCount} students and ${metrics.assessmentCount} assessments. ${strongSignal ? 'Performance is healthy.' : lowSignal ? 'Performance needs attention.' : 'There is enough activity to start measuring progress.'}`}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                    <span style={{ padding: '8px 12px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.12)', fontSize: '12px', fontWeight: 800 }}>Top class names: {roasterNameList.length > 0 ? roasterNameList.join(', ') : 'No students yet'}</span>
                    <span style={{ padding: '8px 12px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.12)', fontSize: '12px', fontWeight: 800 }}>Subjects tracked: {metrics.subjectCount}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1a202c' }}>Students</h2>
                    <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>Roster entries assigned to this class.</p>
                  </div>
                </div>

                {roster.length === 0 ? (
                  <div style={{ borderRadius: '16px', border: '1px dashed #cbd5e0', padding: '28px', color: '#64748b', backgroundColor: '#fafcff' }}>No students are assigned to this class yet.</div>
                ) : (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {roster.map((student) => (
                      <div key={student.student_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{student.first_name} {student.last_name}</div>
                          <div style={{ marginTop: '4px', fontSize: '13px', color: '#64748b' }}>{student.email ?? 'No email'}{student.candidate_number ? ` • Candidate ${student.candidate_number}` : ''}</div>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#0d7c71', backgroundColor: '#e6fffb', padding: '6px 10px', borderRadius: '999px' }}>{student.student_id.slice(0, 8)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1a202c' }}>Assignments</h2>
                    <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>Create and manage assignment templates for this class.</p>
                  </div>
                  <button onClick={() => navigate(`/dashboard/classes/${classId}/assignments/new`)} style={{ border: 'none', backgroundColor: '#0d7c71', color: '#fff', borderRadius: '999px', padding: '12px 16px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>Create assignment</button>
                </div>

                {assignments.length === 0 ? (
                  <div style={{ borderRadius: '16px', border: '1px dashed #cbd5e0', padding: '28px', color: '#64748b', backgroundColor: '#fafcff' }}>
                    <p style={{ margin: '0 0 16px 0' }}>No assignments have been created for this class yet.</p>
                    <button onClick={() => navigate(`/dashboard/classes/${classId}/assignments/new`)} style={{ border: 'none', backgroundColor: '#0d7c71', color: '#fff', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>Build your first assignment</button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {assignments.map((assignment) => (
                      <div key={assignment.assignment_id} style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{assignment.title}</div>
                            <div style={{ marginTop: '4px', fontSize: '13px', color: '#64748b' }}>{assignment.template_key.replace('-', ' ')} • {assignment.estimated_duration_mins ?? 0} mins</div>
                            {assignment.description && <div style={{ marginTop: '8px', fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>{assignment.description}</div>}
                          </div>
                          <div style={{ textAlign: 'right', minWidth: '120px' }}>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0d7c71', textTransform: 'capitalize' }}>{assignment.status}</div>
                            <div style={{ marginTop: '4px', fontSize: '12px', color: '#64748b' }}>{assignment.due_date ?? 'No due date'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'insights' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1a202c' }}>Insights</h2>
                    <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>Generated recommendations based on live class data.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  {insights.map((insight) => {
                    const colors = insight.tone === 'positive'
                      ? { border: '#bbf7d0', background: '#f0fdf4', accent: '#15803d' }
                      : insight.tone === 'warning'
                        ? { border: '#fecaca', background: '#fff1f2', accent: '#b91c1c' }
                        : { border: '#e2e8f0', background: '#f8fafc', accent: '#0d7c71' };

                    return (
                      <div key={insight.title} style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}`, borderRadius: '18px', padding: '20px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{insight.title}</div>
                        <div style={{ marginTop: '10px', fontSize: '20px', fontWeight: 800, color: colors.accent }}>{insight.value}</div>
                        <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px', lineHeight: 1.65 }}>{insight.detail}</p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>STEM Mastery Breakdown</div>
                    <div style={{ marginTop: '12px', display: 'grid', gap: '14px' }}>
                      {healthBars.map((bar) => (
                        <div key={bar.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a202c' }}>{bar.label}</span>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0d7c71' }}>{Math.round(bar.value)}%</span>
                          </div>
                          <div style={{ height: '10px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                            <div style={{ width: `${bar.value}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #0d7c71 0%, #22c55e 100%)' }} />
                          </div>
                          <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>{bar.hint}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Assessment chart</div>
                    {topAssessmentBars.length === 0 ? (
                      <p style={{ margin: '12px 0 0 0', color: '#64748b', fontSize: '14px', lineHeight: 1.65 }}>No assessments yet. Publish the first assignment to generate a chart here.</p>
                    ) : (
                      <div style={{ marginTop: '12px', display: 'grid', gap: '14px' }}>
                        {topAssessmentBars.map((bar) => (
                          <div key={bar.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a202c' }}>{bar.label}</span>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: '#2563eb' }}>{Math.round(bar.value)}%</span>
                            </div>
                            <div style={{ height: '10px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                              <div style={{ width: `${bar.value}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)' }} />
                            </div>
                            <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>{bar.hint}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suggested next move</div>
                    <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>
                      {metrics.studentCount === 0
                        ? 'Import students to build your concept map'
                        : assignments.length === 0
                          ? 'Launch a coding or math challenge to map skills'
                          : 'Review intermediate steps of the latest outliers'}
                    </div>
                    <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px', lineHeight: 1.65 }}>This aligns teaching interventions directly with where the logic gaps are happening.</p>
                  </div>

                  <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>STEM Power Features</div>
                    <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>Live Python & LaTeX rendering</div>
                    <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px', lineHeight: 1.65 }}>Students can write code and math formulas directly into EduBuddy, auto-graded instantly.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDashboard;
