import API from './client.js';

export const fetchDashboardSummary = async () => {
  const response = await API.get('/dashboard/summary');
  return response.data;
};

export const fetchClassDashboard = async (classId: string) => {
  const response = await API.get(`/dashboard/classes/${classId}`);
  return response.data;
};

export const createClassAssignment = async (classId: string, payload: {
  title: string;
  template_key: string;
  description?: string;
  due_date?: string;
  estimated_duration_mins?: number;
  status?: 'draft' | 'scheduled' | 'published' | 'archived';
}) => {
  const response = await API.post(`/dashboard/classes/${classId}/assignments`, payload);
  return response.data;
};