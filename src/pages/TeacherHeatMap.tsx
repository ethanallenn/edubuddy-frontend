import React, { useEffect, useState } from 'react';
import { getCohortMastery, type MasteryRecord } from '../api/mastery';
import axios from 'axios';

interface TeacherHeatMapProps {
  cohortId: number;
}

const HeatMap: React.FC<TeacherHeatMapProps> = ({ cohortId }) => {
  const [masteryData, setMasteryData] = useState<MasteryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeatMapData = async () => {
      try {
        const data = await getCohortMastery(cohortId);
        setMasteryData(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to load mastery data.');
        } else {
          setError('An unexpected error occurred while loading mastery data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHeatMapData();
  }, [cohortId]);

  if (loading) return <div className="flex justify-center p-12 text-indigo-600 font-medium animate-pulse">Loading EduBuddy Mastery Data...</div>;
  if (error) return <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>;

  // Group data by student for the rows, and extract unique nodes for the columns
  const students = Array.from(new Set(masteryData.map(d => d.student_name)));
  const nodes = Array.from(new Set(masteryData.map(d => d.node_id))).sort((a, b) => a - b);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'bg-emerald-500 border-emerald-600 shadow-inner text-white';
      case 'in_progress': return 'bg-amber-400 border-amber-500 shadow-inner text-amber-900';
      case 'unlocked': return 'bg-indigo-100 border-indigo-200 text-transparent';
      case 'locked': default: return 'bg-slate-100 border-slate-200 text-transparent';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto p-1">
        <table className="min-w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="w-48 p-4 bg-white text-left font-semibold text-slate-500 border-b border-slate-200 sticky left-0 z-10">Student</th>
              {nodes.map(nodeId => (
                <th key={nodeId} className="w-16 p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  N-{nodeId}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={nodes.length + 1} className="p-8 text-center text-slate-400 italic">No mastery data available for this cohort.</td>
              </tr>
            ) : (
              students.map(student => (
                <tr key={student} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 border-b border-slate-100 sticky left-0 bg-white z-10">{student}</td>
                  {nodes.map(nodeId => {
                    const record = masteryData.find(d => d.student_name === student && d.node_id === nodeId);
                    const status = record ? record.status : 'locked';
                    return (
                      <td key={nodeId} className="p-2 border-b border-slate-100 text-center">
                        <div 
                          className={`w-10 h-10 mx-auto rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${getStatusColor(status)}`} 
                          title={`${student} - Node ${nodeId}: ${status}`}
                        >
                          {status === 'mastered' && '✓'}
                          {status === 'in_progress' && '⋯'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-center gap-6 text-sm text-slate-600">
        <span className="font-semibold text-slate-700 mr-2">Legend:</span>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-600"></div> Mastered</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-amber-400 border border-amber-500"></div> In Progress</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-indigo-100 border border-indigo-200"></div> Unlocked</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-slate-100 border border-slate-200"></div> Locked</div>
      </div>
    </div>
  );
};

export default HeatMap;