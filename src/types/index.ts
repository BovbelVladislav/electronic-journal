export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
}

export enum AssignmentType {
  LAB = 'lab',
  PRACTICE = 'practice',
  TEST = 'test',
  CONTROL = 'control',
  OTHER = 'other',
}

export enum SubmissionStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  REJECTED = 'rejected',
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface Class {
  id: number;
  subject_id: number;
  group_id: number;
  teacher_id: number;
  start_time: string;
  end_time: string;
  day_of_week: number;
  room?: string;
}

export interface AttendanceGrade {
  id: number;
  class_id: number;
  student_id: number;
  date: Date;
  attendance?: AttendanceStatus;
  grade?: number;
  comments?: string;
}

export interface Assignment {
  id: number;
  subject_id: number;
  title: string;
  description?: string;
  type: AssignmentType;
  deadline?: Date;
  is_team_work: boolean;
}

export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  submitted_at?: Date;
  file_path?: string;
  content?: string;
  grade?: number;
  status: SubmissionStatus;
}
