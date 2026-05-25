import API from './client.js';

interface BatchStudentPayload {
  school_id: string;
  class_name: string;
  academic_year: string;
  students: Array<{
    first_name: string;
    last_name: string;
    email?: string;
    candidate_number?: string;
  }>;
}

export const ingestStudentBatch = async (payload: BatchStudentPayload) => {
  const response = await API.post('/students/batch-ingest', payload);
  return response.data;
};