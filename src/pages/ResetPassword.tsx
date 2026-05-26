import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // States for the form
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // 1. Get the token from the URL (e.g., ?token=abc123xyz)
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing reset token. Please request a new link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Client-side validation: Passwords must match
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, // The token from the URL
          newPassword: password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setStatus('success');
      setMessage('Your password has been reset successfully!');
      
      // 3. Automatically redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error: any) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
          <p className="text-gray-600 text-sm">
            Please enter your new secure password below.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center">
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-md border border-emerald-200 text-sm mb-4">
              {message}
            </div>
            <p className="text-gray-500 text-xs">Redirecting you to the login page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {(status === 'error' || message) && (
              <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200 text-sm">
                {message}
              </div>
            )}

            {/* If token is missing, we disable the inputs */}
            <fieldset disabled={!token || status === 'loading'} className="space-y-5">
              <div>
                <label htmlFor="pass" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div>
                <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPass"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  placeholder="Re-type password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Updating...' : 'Update Password'}
              </button>
            </fieldset>
            
          </form>
        )}
        
      </div>
    </div>
  );
};

export default ResetPassword;