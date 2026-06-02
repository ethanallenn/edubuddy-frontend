import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createClassAssignment, fetchClassDashboard } from '../api/dashboardService.js';

type TemplateKey = 'retrieval-practice' | 'exit-ticket' | 'mixed-practice' | 'extension-task' | 'code-challenge' | 'math-problem-set' | 'data-lab';

const templates: Array<{
  key: TemplateKey;
  title: string;
  description: string;
  duration: number;
  tone: 'green' | 'blue' | 'amber' | 'violet' | 'slate' | 'emerald' | 'indigo';
}> = [
  { key: 'retrieval-practice', title: 'Retrieval Practice', description: 'Short, high-frequency recall tasks to strengthen memory and confidence.', duration: 15, tone: 'green' },
  { key: 'exit-ticket', title: 'Exit Ticket', description: 'A quick end-of-lesson check for understanding and immediate next steps.', duration: 10, tone: 'blue' },
  { key: 'mixed-practice', title: 'Mixed Practice', description: 'A balanced set of questions targeting a range of skills and standards.', duration: 25, tone: 'amber' },
  { key: 'extension-task', title: 'Extension Task', description: 'Stretch learners with a deeper challenge or independent investigation.', duration: 30, tone: 'violet' },
  { key: 'code-challenge', title: 'Coding Challenge', description: 'An algorithmic sandbox task with automated unit-test grading (Python/JS/C++).', duration: 45, tone: 'slate' },
  { key: 'math-problem-set', title: 'Math Problem Set', description: 'Multi-step equation solving with LaTeX support and AI step-by-step grading.', duration: 30, tone: 'emerald' },
  { key: 'data-lab', title: 'Data Analysis Lab', description: 'Provide a CSV dataset for students to parse, graph, and interpret using embedded notebooks.', duration: 60, tone: 'indigo' },
];

const toneStyles: Record<TemplateKey, { accent: string; background: string; border: string }> = {
  'retrieval-practice': { accent: '#0d7c71', background: '#ecfdf5', border: '#bbf7d0' },
  'exit-ticket': { accent: '#2563eb', background: '#eff6ff', border: '#bfdbfe' },
  'mixed-practice': { accent: '#d97706', background: '#fff7ed', border: '#fed7aa' },
  'extension-task': { accent: '#7c3aed', background: '#f5f3ff', border: '#ddd6fe' },
  'code-challenge': { accent: '#334155', background: '#f8fafc', border: '#cbd5e0' },
  'math-problem-set': { accent: '#059669', background: '#ecfdf5', border: '#a7f3d0' },
  'data-lab': { accent: '#4f46e5', background: '#e0e7ff', border: '#c7d2fe' },
};

const CreateAssignment: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('retrieval-practice');
  const [title, setTitle] = useState('Retrieval Practice');
  const [description, setDescription] = useState('A quick set of questions to check what students remember and where the class needs support.');
  const [dueDate, setDueDate] = useState('');
  const [estimatedDurationMins, setEstimatedDurationMins] = useState(15);
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>('draft');
  const [className, setClassName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadClass = async () => {
      if (!classId) return;

      try {
        const response = await fetchClassDashboard(classId);
        if (response.status === 'success') {
          setClassName(response.data.class?.class_name ?? '');
        }
      } catch (error) {
        console.error('Failed to load class context for assignment builder.', error);
      }
    };

    loadClass();
  }, [classId]);

  const applyTemplate = (templateKey: TemplateKey) => {
    const template = templates.find((entry) => entry.key === templateKey)!;
    setSelectedTemplate(templateKey);
    setTitle(template.title);
    setDescription(template.description);
    setEstimatedDurationMins(template.duration);
  };

  const handleSubmit = async (submitStatus: 'draft' | 'scheduled' | 'published') => {
    if (!classId) return;

    setSubmitting(true);
    setMessage('');
    try {
      const response = await createClassAssignment(classId, {
        title,
        template_key: selectedTemplate,
        description,
        due_date: dueDate || undefined,
        estimated_duration_mins: estimatedDurationMins,
        status: submitStatus,
      });

      if (response.status === 'success') {
        navigate(`/dashboard/classes/${classId}`, { replace: true });
      }
    } catch (error) {
      console.error('Failed to create assignment.', error);
      setMessage('The assignment could not be saved right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef6f5 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 48px' }}>
        <button onClick={() => navigate(`/dashboard/classes/${classId}`)} style={{ border: 'none', background: 'none', color: '#0d7c71', fontSize: '14px', fontWeight: 800, cursor: 'pointer', padding: 0 }}>← Back to class</button>

        <div style={{ marginTop: '18px', borderRadius: '28px', padding: '30px', background: 'linear-gradient(135deg, #0d7c71 0%, #0a5c54 100%)', color: '#fff', boxShadow: '0 24px 60px rgba(13, 124, 113, 0.18)' }}>
          <div style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.86 }}>Assignment studio</div>
          <h1 style={{ margin: '12px 0 8px 0', fontSize: '38px', lineHeight: 1.05, fontWeight: 900 }}>Create a polished assignment in minutes.</h1>
          <p style={{ margin: 0, color: '#d9fffb', fontSize: '16px', lineHeight: 1.7 }}>{className || 'This class'} • Pick a template, tailor the details, and publish a professional assignment.</p>
        </div>

        {message && <div style={{ marginTop: '16px', borderRadius: '14px', backgroundColor: '#fff1f2', border: '1px solid #fecaca', color: '#9f1239', padding: '14px 16px' }}>{message}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)', gap: '18px', marginTop: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 14px 32px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>1. Choose a template</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {templates.map((template) => {
                const colors = toneStyles[template.key];
                const selected = selectedTemplate === template.key;
                return (
                  <button
                    key={template.key}
                    onClick={() => applyTemplate(template.key)}
                    style={{
                      textAlign: 'left',
                      borderRadius: '18px',
                      padding: '18px',
                      border: `1px solid ${selected ? colors.border : '#e2e8f0'}`,
                      background: selected ? colors.background : '#fff',
                      cursor: 'pointer',
                      boxShadow: selected ? '0 12px 28px rgba(15, 23, 42, 0.05)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: colors.accent }}>Template</div>
                    <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{template.title}</div>
                    <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>{template.description}</p>
                    <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '999px', backgroundColor: '#fff', padding: '7px 10px', fontSize: '12px', fontWeight: 800, color: colors.accent, border: `1px solid ${colors.border}` }}>{template.duration} mins</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 14px 32px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>2. Configure</div>
            <div style={{ display: 'grid', gap: '14px' }}>
              <label style={{ display: 'grid', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Assignment title</span>
                <input value={title} onChange={(event) => setTitle(event.target.value)} style={{ width: '100%', boxSizing: 'border-box', borderRadius: '14px', border: '1px solid #d7e1df', padding: '14px 16px', fontSize: '15px', outline: 'none' }} />
              </label>

              <label style={{ display: 'grid', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Description</span>
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} style={{ width: '100%', boxSizing: 'border-box', borderRadius: '14px', border: '1px solid #d7e1df', padding: '14px 16px', fontSize: '15px', outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                <label style={{ display: 'grid', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Due date</span>
                  <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} style={{ width: '100%', boxSizing: 'border-box', borderRadius: '14px', border: '1px solid #d7e1df', padding: '14px 16px', fontSize: '15px', outline: 'none' }} />
                </label>

                <label style={{ display: 'grid', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Duration (mins)</span>
                  <input type="number" min="5" step="5" value={estimatedDurationMins} onChange={(event) => setEstimatedDurationMins(Number(event.target.value))} style={{ width: '100%', boxSizing: 'border-box', borderRadius: '14px', border: '1px solid #d7e1df', padding: '14px 16px', fontSize: '15px', outline: 'none' }} />
                </label>
              </div>

              <label style={{ display: 'grid', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Status</span>
                <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} style={{ width: '100%', boxSizing: 'border-box', borderRadius: '14px', border: '1px solid #d7e1df', padding: '14px 16px', fontSize: '15px', outline: 'none', backgroundColor: '#fff' }}>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '18px' }}>
              <button disabled={submitting} onClick={() => handleSubmit('draft')} style={{ border: 'none', backgroundColor: '#0d7c71', color: '#fff', borderRadius: '14px', padding: '12px 18px', fontSize: '14px', fontWeight: 900, cursor: 'pointer', opacity: submitting ? 0.75 : 1 }}>Save draft</button>
              <button disabled={submitting} onClick={() => handleSubmit('published')} style={{ border: '1px solid #cbd5e0', backgroundColor: '#fff', color: '#0f172a', borderRadius: '14px', padding: '12px 18px', fontSize: '14px', fontWeight: 900, cursor: 'pointer', opacity: submitting ? 0.75 : 1 }}>Publish now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;