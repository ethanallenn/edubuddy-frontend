import React, { useState, useEffect, useRef } from 'react';
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
    // Boom. Send them straight to their workspace.
    navigate(`/${schoolId}/login`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        
        <div className="mb-8 text-center">
          <div className="mb-4">
             <span className="text-2xl font-extrabold text-teal-700">EduBuddy.</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Workspace</h2>
          <p className="text-gray-600 text-sm">
            Search for your institution to access your tracking node.
          </p>
        </div>

        <div className="space-y-5" ref={dropdownRef}>
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <div className="relative">
            <label htmlFor="schoolSearch" className="block text-sm font-medium text-gray-700 mb-1">
              Institution Name
            </label>
            <input
              id="schoolSearch"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="e.g. Belfast High School..."
              autoComplete="off"
            />
            
            {/* Loading Spinner Indicator */}
            {isSearching && (
              <div className="absolute right-3 top-9">
                <div className="animate-spin h-5 w-5 border-2 border-teal-600 border-t-transparent rounded-full"></div>
              </div>
            )}

            {/* The Dropdown Menu */}
            {showDropdown && results.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {results.map((school) => (
                  <li
                    key={school.school_id}
                    onClick={() => handleSelectSchool(school.school_id)}
                    className="text-gray-900 cursor-pointer select-none relative py-3 px-4 hover:bg-teal-50 hover:text-teal-900 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <span className="block truncate font-medium">
                      {school.school_name}
                    </span>
                    <span className="block truncate text-xs text-gray-500 mt-0.5">
                      DENI: {school.school_id}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* No Results State */}
            {showDropdown && searchTerm.length >= 2 && results.length === 0 && !isSearching && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-3 px-4 text-sm text-gray-500 ring-1 ring-black ring-opacity-5">
                No institutions found matching "{searchTerm}".
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Can't find your institution? <br/>
            Contact your system administrator to register.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default WorkspaceFinder;