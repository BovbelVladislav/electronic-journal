import pool from '../database/pool';
import { Assignment, Submission, SubmissionStatus } from '../types';
import path from 'path';
import fs from 'fs';

export class SubmissionService {
  async createAssignment(
    subjectId: number,
    title: string,
    description: string,
    type: string,
    deadline?: Date,
    isTeamWork: boolean = false
  ): Promise<Assignment> {
    const result = await pool.query(
      `INSERT INTO assignments (subject_id, title, description, type, deadline, is_team_work)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [subjectId, title, description, type, deadline, isTeamWork]
    );

    return result.rows[0];
  }

  async submitAssignment(
    assignmentId: number,
    studentId: number,
    filePath?: string,
    content?: string
  ): Promise<Submission> {
    const result = await pool.query(
      `INSERT INTO submissions (assignment_id, student_id, file_path, content, submitted_at, status)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)
       ON CONFLICT (assignment_id, student_id)
       DO UPDATE SET file_path = $3, content = $4, submitted_at = CURRENT_TIMESTAMP, status = $5
       RETURNING *`,
      [assignmentId, studentId, filePath, content, 'submitted']
    );

    return result.rows[0];
  }

  async gradeSubmission(submissionId: number, grade: number, comments?: string): Promise<Submission> {
    // Also add comment if provided
    if (comments) {
      const submissionResult = await pool.query('SELECT author_id FROM submissions WHERE id = $1', [submissionId]);
      // This would be the teacher's ID from the request context
    }

    const result = await pool.query(
      `UPDATE submissions
       SET grade = $1, status = 'graded', updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [grade, submissionId]
    );

    return result.rows[0];
  }

  async getSubmission(submissionId: number): Promise<Submission | null> {
    const result = await pool.query('SELECT * FROM submissions WHERE id = $1', [submissionId]);
    return result.rows[0] || null;
  }

  async getAssignmentSubmissions(assignmentId: number): Promise<Submission[]> {
    const result = await pool.query(
      `SELECT * FROM submissions WHERE assignment_id = $1 ORDER BY submitted_at DESC`,
      [assignmentId]
    );

    return result.rows;
  }

  async getStudentSubmissions(studentId: number): Promise<Submission[]> {
    const result = await pool.query(
      `SELECT * FROM submissions WHERE student_id = $1 ORDER BY created_at DESC`,
      [studentId]
    );

    return result.rows;
  }

  async getAssignment(assignmentId: number): Promise<Assignment | null> {
    const result = await pool.query('SELECT * FROM assignments WHERE id = $1', [assignmentId]);
    return result.rows[0] || null;
  }

  async getSubjectAssignments(subjectId: number): Promise<Assignment[]> {
    const result = await pool.query(
      `SELECT * FROM assignments WHERE subject_id = $1 ORDER BY created_at DESC`,
      [subjectId]
    );

    return result.rows;
  }
}

export const submissionService = new SubmissionService();
