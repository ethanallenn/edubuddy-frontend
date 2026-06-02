import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAdminActivities, sendAdminBatchInvitations } from '../api/adminService.js';
import { ingestStudentBatch } from '../api/studentService.js';

interface StaffInviteRow {
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'teacher';
}

interface AdminActivity {
  id: string;
  type: 'invite_batch' | 'student_import';
  status: 'success' | 'failed';
  title: string;
  message: string;
  created_at: string;
  meta: Record<string, unknown>;
}

interface ParsedStudentRow {
  first_name: string;
  last_name: string;
  email?: string;
  candidate_number?: string;
}

const splitCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      const nextCharacter = line[index + 1];
      if (inQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += character;
  }

  values.push(current.trim());
  return values;
};

const parseStudentCsv = (csvText: string): ParsedStudentRow[] => {
  const rows = csvText
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map(splitCsvLine);

  if (rows.length === 0) {
    return [];
  }

  const header = rows[0].map((value) => value.toLowerCase());
  const hasHeader = header.includes('first_name') || header.includes('last_name') || header.includes('email') || header.includes('candidate_number');

  if (!hasHeader) {
    return rows.map((row) => ({
      first_name: row[0] || '',
      last_name: row[1] || '',
      email: row[2] || undefined,
      candidate_number: row[3] || undefined,
    })).filter((student) => student.first_name && student.last_name);
  }

  return rows.slice(1).map((row) => {
    const record: Record<string, string> = {};
    header.forEach((column, index) => {
      record[column] = row[index] || '';
    });

    return {
      first_name: record.first_name || '',
      last_name: record.last_name || '',
      email: record.email || undefined,
      candidate_number: record.candidate_number || undefined,
    };
  }).filter((student) => student.first_name && student.last_name);
};

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { schoolId: routeSchoolId } = useParams();

  const userString = localStorage.getItem('edubuddy_user');
  const user = userString ? JSON.parse(userString) : null;
  const schoolId = routeSchoolId || user?.school_id || localStorage.getItem('edubuddy_school_id') || '';
  const isAdmin = user?.role === 'admin';

  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'staff' | 'import'>('staff');
  const [staffInvites, setStaffInvites] = useState<StaffInviteRow[]>([{ first_name: '', last_name: '', email: '', role: 'teacher' }]);
  const [staffStatus, setStaffStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [staffMessage, setStaffMessage] = useState('');
  const [importClassName, setImportClassName] = useState('');
  const [importAcademicYear, setImportAcademicYear] = useState('2025/2026');
  const [importFileName, setImportFileName] = useState('');
  const [parsedStudents, setParsedStudents] = useState<ParsedStudentRow[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const activityFeed = useMemo(() => activities, [activities]);

  const loadActivities = async () => {
    if (!isAdmin) {
      setActivitiesLoading(false);
      return;
    }

    setActivitiesLoading(true);
    try {
      const response = await fetchAdminActivities(30);
      setActivities(response.data.activities || []);
    } catch (error) {
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [isAdmin]);

  const addInviteRow = () => {
    setStaffInvites([...staffInvites, { first_name: '', last_name: '', email: '', role: 'teacher' }]);
  };

  const updateInviteRow = (index: number, field: keyof StaffInviteRow, value: string) => {
    const nextRows = [...staffInvites];
    nextRows[index] = { ...nextRows[index], [field]: value };
    setStaffInvites(nextRows);
  };

  const submitInvites = async () => {
    if (!schoolId) {
      setStaffStatus('error');
      setStaffMessage('Missing school context.');
      return;
    }

    const invites = staffInvites
      .filter((invite) => invite.first_name.trim() && invite.last_name.trim() && invite.email.trim())
      .map((invite) => ({
        first_name: invite.first_name.trim(),
        last_name: invite.last_name.trim(),
        email: invite.email.trim(),
        role: invite.role,
      }));

    if (invites.length === 0) {
      setStaffStatus('error');
      setStaffMessage('Add at least one full staff invite row.');
      return;
    }

    setStaffStatus('loading');
    setStaffMessage('');

    try {
      const response = await sendAdminBatchInvitations(schoolId, invites);
      setStaffStatus('success');
      setStaffMessage(response.message || 'Invites sent.');
      setStaffInvites([{ first_name: '', last_name: '', email: '', role: 'teacher' }]);
      await loadActivities();
    } catch (error: any) {
      setStaffStatus('error');
      setStaffMessage(error.response?.data?.message || 'Failed to send invites.');
    }
  };

  const handleCsvFile = async (file: File | null) => {
    if (!file) {
      setImportFileName('');
      setParsedStudents([]);
      return;
    }

    const text = await file.text();
    setImportFileName(file.name);
    setParsedStudents(parseStudentCsv(text));
  };

  const submitImport = async () => {
    if (!schoolId) {
      setImportStatus('error');
      setImportMessage('Missing school context.');
      return;
    }

    if (!importClassName.trim() || !importAcademicYear.trim() || parsedStudents.length === 0) {
      setImportStatus('error');
      setImportMessage('Choose a CSV file and fill out the class metadata first.');
      return;
    }

    setImportStatus('loading');
    setImportMessage('');

    try {
      const response = await ingestStudentBatch({
        school_id: schoolId,
        class_name: importClassName.trim(),
        academic_year: importAcademicYear.trim(),
        students: parsedStudents,
      });

      setImportStatus('success');
      setImportMessage(response.message || 'Import complete.');
      setImportClassName('');
      setImportAcademicYear('2025/2026');
      setImportFileName('');
      setParsedStudents([]);
      await loadActivities();
    } catch (error: any) {
      setImportStatus('error');
      setImportMessage(error.response?.data?.message || 'Failed to import CSV.');
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ maxWidth: '560px', width: '100%', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)' }}>
          <h1 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '28px', fontWeight: 800 }}>Admin access required</h1>
          <p style={{ margin: '0 0 24px 0', color: '#64748b', lineHeight: 1.6 }}>This area is available to admin users only.</p>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 16px', border: 'none', borderRadius: '10px', background: '#0d7c71', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Return to dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef6f5 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div>
            <p style={{ margin: '0 0 8px 0', color: '#0d7c71', fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Admin workspace</p>
            <h1 style={{ margin: 0, color: '#0f172a', fontSize: '34px', fontWeight: 900, letterSpacing: '-0.04em' }}>Staff collaboration and data import</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e0', background: '#fff', color: '#0f172a', fontWeight: 700, cursor: 'pointer' }}>Back to dashboard</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <section style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
            <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '20px', fontWeight: 800 }}>Invite staff</h2>
            <p style={{ margin: '0 0 18px 0', color: '#64748b', fontSize: '14px' }}>Send collaboration invites to teachers or other admins.</p>
            {staffInvites.map((invite, index) => (
              <div key={index} style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginBottom: '12px' }}>
                <input value={invite.first_name} onChange={(event) => updateInviteRow(index, 'first_name', event.target.value)} placeholder="First name" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
                <input value={invite.last_name} onChange={(event) => updateInviteRow(index, 'last_name', event.target.value)} placeholder="Last name" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
                <input value={invite.email} onChange={(event) => updateInviteRow(index, 'email', event.target.value)} placeholder="name@school.com" style={{ gridColumn: '1 / -1', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
                <select value={invite.role} onChange={(event) => updateInviteRow(index, 'role', event.target.value)} style={{ gridColumn: '1 / -1', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', background: '#fff' }}>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={addInviteRow} style={{ padding: '10px 14px', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '10px', color: '#0d7c71', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>+ Add row</button>
              <button onClick={submitInvites} disabled={staffStatus === 'loading'} style={{ padding: '10px 14px', background: '#0d7c71', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', opacity: staffStatus === 'loading' ? 0.7 : 1 }}>{staffStatus === 'loading' ? 'Sending...' : 'Send invites'}</button>
            </div>
            {staffMessage && <div style={{ marginTop: '14px', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', background: staffStatus === 'success' ? '#f0fdf4' : '#fef2f2', color: staffStatus === 'success' ? '#166534' : '#991b1b' }}>{staffMessage}</div>}
          </section>

          <section style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div>
                <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '20px', fontWeight: 800 }}>Import students</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Upload a CSV file with `first_name,last_name,email,candidate_number` columns.</p>
              </div>
              <button onClick={() => setActiveTab(activeTab === 'staff' ? 'import' : 'staff')} style={{ padding: '10px 12px', borderRadius: '999px', border: '1px solid #cbd5e0', background: '#fff', color: '#475569', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Switch tool</button>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <input value={importClassName} onChange={(event) => setImportClassName(event.target.value)} placeholder="Class name" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
              <input value={importAcademicYear} onChange={(event) => setImportAcademicYear(event.target.value)} placeholder="Academic year" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none' }} />
              <label style={{ display: 'grid', gap: '8px', padding: '16px', border: '1px dashed #94a3b8', borderRadius: '14px', background: '#f8fafc', color: '#475569', cursor: 'pointer' }}>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>CSV file</span>
                <span style={{ fontSize: '13px' }}>{importFileName || 'Choose a CSV file to parse students from.'}</span>
                <input type="file" accept=".csv,text/csv" onChange={(event) => handleCsvFile(event.target.files?.[0] || null)} style={{ display: 'none' }} />
              </label>
              <div style={{ borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '12px' }}>
                  <strong style={{ color: '#0f172a', fontSize: '14px' }}>Parsed rows</strong>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{parsedStudents.length} student(s)</span>
                </div>
                <div style={{ maxHeight: '180px', overflow: 'auto', display: 'grid', gap: '8px' }}>
                  {parsedStudents.length === 0 ? (
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>No parsed rows yet.</span>
                  ) : parsedStudents.slice(0, 6).map((student, index) => (
                    <div key={`${student.first_name}-${student.last_name}-${index}`} style={{ fontSize: '13px', color: '#334155', padding: '8px 10px', borderRadius: '10px', background: '#f8fafc' }}>
                      {student.first_name} {student.last_name}{student.email ? ` · ${student.email}` : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
              <button onClick={submitImport} disabled={importStatus === 'loading'} style={{ padding: '10px 14px', background: '#0d7c71', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', opacity: importStatus === 'loading' ? 0.7 : 1 }}>{importStatus === 'loading' ? 'Importing...' : 'Import roster'}</button>
              <button onClick={() => { setImportClassName(''); setImportAcademicYear('2025/2026'); setImportFileName(''); setParsedStudents([]); setImportMessage(''); setImportStatus('idle'); }} style={{ padding: '10px 14px', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '10px', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Reset</button>
            </div>
            {importMessage && <div style={{ marginTop: '14px', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', background: importStatus === 'success' ? '#f0fdf4' : '#fef2f2', color: importStatus === 'success' ? '#166534' : '#991b1b' }}>{importMessage}</div>}
          </section>
        </div>

        <section style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '20px', fontWeight: 800 }}>Activity history</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Recent invite batches and roster imports from the backend.</p>
            </div>
            <button onClick={loadActivities} style={{ padding: '10px 14px', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '10px', color: '#0d7c71', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Refresh</button>
          </div>
          {activitiesLoading ? (
            <div style={{ padding: '20px', color: '#64748b' }}>Loading activity feed...</div>
          ) : activityFeed.length === 0 ? (
            <div style={{ padding: '20px', color: '#64748b' }}>No admin activities yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {activityFeed.map((activity) => (
                <div key={activity.id} style={{ borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <strong style={{ color: '#0f172a', fontSize: '14px' }}>{activity.title}</strong>
                      <span style={{ padding: '4px 8px', borderRadius: '999px', background: activity.status === 'success' ? '#dcfce7' : '#fee2e2', color: activity.status === 'success' ? '#166534' : '#991b1b', fontSize: '12px', fontWeight: 700 }}>{activity.status}</span>
                      <span style={{ padding: '4px 8px', borderRadius: '999px', background: '#e2e8f0', color: '#334155', fontSize: '12px', fontWeight: 700 }}>{activity.type}</span>
                    </div>
                    <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: 1.5 }}>{activity.message}</p>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>{new Date(activity.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;