import React from 'react';
// FIXED: Changed 'react-router' to 'react-router-dom'
import { Outlet, NavLink, useLocation } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 flex items-center gap-3">
          <span className="text-3xl">📚</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            EduBuddy
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavLink
            to="/student"
            className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-700 shadow-md font-semibold' : 'hover:bg-indigo-800/50 text-indigo-100 hover:text-white'}`}
          >
            🎓 Student Portal
          </NavLink>
          <NavLink
            to="/teacher"
            className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-700 shadow-md font-semibold' : 'hover:bg-indigo-800/50 text-indigo-100 hover:text-white'}`}
          >
            📊 Teacher Portal
          </NavLink>
        </nav>
        
        <div className="p-6 border-t border-indigo-800/50 text-sm text-indigo-300">
          EduBuddy v1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;