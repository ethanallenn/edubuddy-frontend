import React from 'react';

const StudentDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">My Learning Path</h1>
        <p className="text-slate-500 mt-2 text-lg">Pick up where you left off and master new computer science concepts.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Active EduBuddy Challenge</h3>
          <div className="bg-indigo-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center border-2 border-indigo-100 border-dashed">
            <span className="text-5xl mb-4 drop-shadow-sm">💻</span>
            <h4 className="text-2xl font-bold text-indigo-950">Intro to Recursion</h4>
            <p className="text-indigo-700/80 mt-3 mb-8 max-w-md text-lg">Write a function that calls itself to solve smaller instances of the same problem.</p>
            <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-lg transition-all w-full max-w-xs">
              Enter Workspace
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">My Stats</h3>
          <ul className="space-y-6">
            <li className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-slate-600 font-medium">Skills Mastered</span>
              <span className="font-extrabold text-indigo-600 text-2xl">14</span>
            </li>
            <li className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-slate-600 font-medium">Current Streak</span>
              <span className="font-extrabold text-amber-500 text-2xl">5 Days 🔥</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;