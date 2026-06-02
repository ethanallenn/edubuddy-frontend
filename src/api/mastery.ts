import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface MasteryRecord {
  student_id: number;
  student_name: string;
  node_id: number;
  status: 'locked' | 'unlocked' | 'in_progress' | 'mastered';
  last_activity_at: string;
}

export const getCohortMastery = async (cohortId: number): Promise<MasteryRecord[]> => {
  const response = await axios.get(`${API_URL}/mastery/cohort/${cohortId}`);
  return response.data;
};

export const getStudentMastery = async (studentId: number): Promise<MasteryRecord[]> => {
  const response = await axios.get(`${API_URL}/mastery/student/${studentId}`);
  return response.data;
};