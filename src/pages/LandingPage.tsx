import React, { useState } from 'react';
import { Link } from 'react-router';

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleBetaSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire this up to a simple backend email collection route!
    alert(`Thanks for signing up for the beta with ${email}! We'll be in touch soon.`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Navigation */}
      <header className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="text-xl font-extrabold text-indigo-900 tracking-tight">EduBuddy</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/play" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors py-2">Join a Class</Link>
          <Link to="/login" className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold hover:bg-indigo-200 transition-colors hidden sm:block">Teacher Login</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="space-y-4">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-800 text-sm font-bold tracking-wider uppercase">Private Beta</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Master STEM with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">EduBuddy</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto">
              The intelligent platform for teachers to track concept mastery and for students to dive into interactive coding and logic challenges.
            </p>
          </div>

          {/* Email Capture */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Request Beta Access</h2>
            <form onSubmit={handleBetaSignup} className="flex flex-col sm:flex-row gap-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your school email" className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg">
                Join Waitlist
              </button>
            </form>
            <p className="text-sm text-slate-500 mt-4">
              Are you a student? <Link to="/play" className="text-indigo-600 font-bold hover:underline">Click here to join an active class.</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
export default LandingPage;