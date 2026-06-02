import API from './client.js';

export const fetchAdminActivities = async (limit = 20) => {
  const response = await API.get(`/admin/activities?limit=${limit}`);
  return response.data;
};

export const sendAdminBatchInvitations = async (schoolId: string, invites: Array<{ first_name: string; last_name: string; email: string; role: 'admin' | 'teacher' }>) => {
  const response = await API.post('/admin/invites/batch', { school_id: schoolId, invites });
  return response.data;
};