import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of our school data
interface SchoolResult {
  school_id: string;
  school_name: string;
}

const WorkspaceFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SchoolResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    // Don't search if the term is too short
    if (searchTerm.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchSchools = async () => {
      setIsSearching(true);
      setError('');

      try {
        const response = await fetch(`http://localhost:3000/api/v1/schools/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (!response.ok) throw new Error('Failed to fetch schools');

        setResults(data.data);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
        setError('Having trouble connecting to the database.');
      } finally {
        setIsSearching(false);
      }
    };

    // Wait 300ms after the user stops typing before making the request
    const delayDebounceFn = setTimeout(() => {
      fetchSchools();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSchool = (schoolId: string) => {
    setShowDropdown(false);
    navigate(`/${schoolId}/login`);
  };

  const pageStyle: CSSProperties = {
    minHeight: '100vh',
    padding: '24px',
    background:
      'radial-gradient(circle at top left, rgba(20, 184, 166, 0.24), transparent 28%), radial-gradient(circle at bottom right, rgba(13, 124, 113, 0.22), transparent 32%), linear-gradient(135deg, #051b1a 0%, #083b36 38%, #0f766e 100%)',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const shellStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '1180px',
    minHeight: 'calc(100vh - 48px)',
    borderRadius: '32px',
    overflow: 'hidden',
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.94)',
    boxShadow: '0 30px 90px rgba(2, 6, 23, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.16)',
    backdropFilter: 'blur(18px)',
  };

  const heroStyle: CSSProperties = {
    flex: '1.05',
    padding: '56px',
    color: '#fff',
    background:
      'linear-gradient(160deg, #0d7c71 0%, #0b645b 55%, #084f49 100%)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const formPaneStyle: CSSProperties = {
    flex: '0 0 540px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '36px',
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
  };

  const cardStyle: CSSProperties = {
    width: '100%',
    maxWidth: '460px',
  };

  const eyebrowStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '999px',
    padding: '9px 14px',
    background: 'rgba(13, 124, 113, 0.1)',
    color: '#0d7c71',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    height: '54px',
    borderRadius: '16px',
    border: '1px solid #d7e1df',
    background: '#fff',
    padding: '0 16px',
    fontSize: '15px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  };

  const dropdownItemStyle: CSSProperties = {
    cursor: 'pointer',
    padding: '14px 16px',
    borderBottom: '1px solid #edf2f7',
    transition: 'background-color 150ms ease, transform 150ms ease',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#fff' }}>

      {/* LEFT: Brand Panel */}
      <div style={{ flex: '1', background: '#0d7c71', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#fff', color: '#0d7c71', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>E</div>
            <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>EduBuddy<span style={{ color: '#fff' }}>.</span></span>
          </div>

          <div style={{ marginTop: '60px', maxWidth: '460px' }}>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#99f6e4', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>School Portal</span>
            <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '52px', margin: '16px 0 20px 0', letterSpacing: '-1px' }}>Find your school workspace and get teaching tools ready.</h1>
            <p style={{ color: '#ccfbf1', fontSize: '17px', lineHeight: '26px', opacity: 0.95 }}>Search your institution to access class lists, student progress, timetables and staff resources.</p>
          </div>
        </div>

        {/* Education-focused footer (no external affiliations displayed) */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', fontSize: '13px', color: '#d6fff3' }}>
          <strong style={{ display: 'block', fontSize: '13px' }}>Built for Schools</strong>
          <div style={{ opacity: 0.95, marginTop: '6px', fontSize: '12px' }}>Designed with educators in mind — simple, secure, and school-first.</div>
        </div>
      </div>

      {/* RIGHT: Form panel */}
      <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }} ref={dropdownRef}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ marginBottom: '14px' }}>
              <span style={eyebrowStyle}>EduBuddy workspace</span>
            </div>
            <h2 style={{ margin: '0 0 10px', color: '#0f172a', fontSize: '32px', lineHeight: 1, letterSpacing: '-0.06em', fontWeight: 800 }}>Find your workspace</h2>
            <p style={{ margin: 0, color: '#5b6472', fontSize: '15px', lineHeight: 1.7 }}>Search for your institution to continue into the correct login flow.</p>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {error && (
              <div style={{ borderRadius: '12px', border: '1px solid #fecaca', background: '#fff1f2', color: '#9f1239', padding: '12px 14px', fontSize: '14px', lineHeight: 1.5 }}>{error}</div>
            )}

            <div style={{ position: 'relative' }}>
              <label htmlFor="schoolSearch" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#334155' }}>Institution name</label>
              <input id="schoolSearch" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => { if (results.length > 0) setShowDropdown(true); }} style={inputStyle} placeholder="e.g. Belfast High School..." autoComplete="off" />

              {isSearching && (
                <div style={{ position: 'absolute', right: '16px', top: '41px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '999px', border: '2px solid #0d7c71', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                </div>
              )}

              {showDropdown && results.length > 0 && (
                <ul style={{ position: 'absolute', zIndex: 10, top: '66px', left: 0, right: 0, margin: 0, padding: '8px 0', listStyle: 'none', borderRadius: '12px', border: '1px solid #d7e1df', background: '#fff', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.14)', maxHeight: '260px', overflowY: 'auto' }}>
                  {results.map((school) => (
                    <li key={school.school_id} onClick={() => handleSelectSchool(school.school_id)} style={dropdownItemStyle} onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = '#f0fdfa'; }} onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = '#fff'; }}>
                      <span style={{ display: 'block', fontSize: '15px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{school.school_name}</span>
                      <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#64748b' }}>DENI: {school.school_id}</span>
                    </li>
                  ))}
                </ul>
              )}

              {showDropdown && searchTerm.length >= 2 && results.length === 0 && !isSearching && (
                <div style={{ position: 'absolute', zIndex: 10, top: '66px', left: 0, right: 0, borderRadius: '12px', border: '1px solid #d7e1df', background: '#fff', padding: '12px', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.14)', color: '#64748b', fontSize: '14px' }}>No institutions found matching "{searchTerm}".</div>
              )}
            </div>

            <div style={{ borderRadius: '12px', border: '1px solid #d7e1df', background: '#f8fafc', padding: '12px', color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>Can't find your institution? Contact your system administrator to register it.</div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default WorkspaceFinder;