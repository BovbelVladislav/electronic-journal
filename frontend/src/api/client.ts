import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export interface Subject {
  id: number;
  title: string;
  code: string;
  teacher?: { id: number; name: string };
}

export interface Lesson {
  id: number;
  subjectId: number;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  subject?: { title: string; code: string };
}

export interface Grade {
  id: number;
  value: number;
  type: string;
  date: string;
  comment?: string;
  subject?: { title: string; code: string };
}

export interface Lab {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  subject?: { title: string; code: string };
}

export interface Submission {
  id: number;
  submittedAt: string;
  lab?: Lab & { subject?: { title: string } };
  files?: { id: number; filename: string }[];
  grade?: { value: number; comment?: string };
  comments?: { id: number; text: string; author: { name: string }; createdAt: string }[];
}
