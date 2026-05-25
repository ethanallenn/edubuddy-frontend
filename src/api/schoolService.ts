import API from './client.js';

export const registerSchool = async (schoolData: { school_id?: string; school_name: string; postcode: string }) => {
  const response = await API.post('/schools', schoolData);
  return response.data;
};

export const sendBatchInvitations = async (schoolId: string, invites: Array<{ first_name: string; last_name: string; email: string; role: string }>) => {
  const response = await API.post('/invites/batch', { school_id: schoolId, invites });
  return response.data;
};