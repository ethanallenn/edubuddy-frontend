import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      // Adjust the URL path if your router setup is slightly different
      const response = await fetch('http://localhost:3000/api/v1/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, school_id: schoolId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred. Please try again.');
      }

      setStatus('success');
      setMessage(data.message); // Displays the success message from the backend
      setEmail('');
      setSchoolId('');
      
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600 text-sm">
            Enter your email and school ID to receive a secure reset link.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-md border border-emerald-200 text-sm text-center">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {status === 'error' && (
              <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200 text-sm">
                {message}
              </div>
            )}

            <div>
              <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1">
                7-Digit DENI School Number
              </label>
              <input
                id="schoolId"
                type="text"
                required
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                placeholder="e.g. 6574834"
              />
            </div>

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

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-teal-700 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
            
          </form>
        )}
        
      </div>
    </div>
  );
};

export default ForgotPassword;