import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const StudentPlay: React.FC = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [nickname, setNickname] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Validate PIN and create student session
    navigate('/student');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 p-4">
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl p-8 text-center border-4 border-indigo-200">
        <div className="text-6xl mb-6 animate-bounce">🎓</div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">EduBuddy</h1>
        <p className="text-slate-500 mb-8 font-medium">Ready to learn? Join your class below!</p>
        
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <input 
              type="text" 
              required 
              value={pin} 
              onChange={e => setPin(e.target.value.toUpperCase())} 
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 text-center text-2xl font-bold tracking-widest text-slate-800 placeholder:text-slate-300 outline-none transition-all" 
              placeholder="CLASS PIN" 
              maxLength={6}
            />
          </div>
          <div>
            <input 
              type="text" 
              required 
              value={nickname} 
              onChange={e => setNickname(e.target.value)} 
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 text-center text-xl font-bold text-slate-800 placeholder:text-slate-300 outline-none transition-all" 
              placeholder="Nickname" 
              maxLength={20}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xl py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1">
            Join Class
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-400 font-medium">Are you a teacher?</p>
          <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-500 text-sm">Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default StudentPlay;