import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Login = () => {
  // Grab the school ID from the URL (e.g., /6574834/login -> schoolId = "6574834")
  const { schoolId } = useParams(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send the URL parameter to your backend along with the credentials
        body: JSON.stringify({ email, password, school_id: schoolId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      // Success! Store the token (e.g., in localStorage or Context)
      localStorage.setItem('token', data.token);
      
      // Redirect to their specific workspace dashboard
      navigate(`/${schoolId}/dashboard`);

    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
          {/* Displaying the workspace ID so they know they are in the right place */}
          <p className="text-gray-600 text-sm">
            Workspace: <span className="font-semibold text-teal-700">{schoolId}</span>
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {status === 'error' && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200 text-sm">
              {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              School Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="name@school.edu"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {/* THE FORGOT PASSWORD LINK */}
              <Link 
                to={`/${schoolId}/forgot-password`} 
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-teal-700 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;