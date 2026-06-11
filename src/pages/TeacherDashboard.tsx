import React from 'react';
import HeatMap from './TeacherHeatMap';

const TeacherDashboard: React.FC = () => {
  // In a real app, cohortId would be selected dynamically from context or an API
  const activeCohortId = 1;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cohort Overview</h1>
          <p className="text-slate-500 mt-2 text-lg">Monitor your students' progress across the EduBuddy knowledge graph.</p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all">
          + Assign Challenge
        </button>
      </header>
      
      <HeatMap cohortId={activeCohortId} />
    </div>
  );
};

export default TeacherDashboard;