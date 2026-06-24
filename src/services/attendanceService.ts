import pool from '../database/pool';
import { AttendanceGrade, AttendanceStatus } from '../types';

export class AttendanceService {
  async recordAttendance(
    classId: number,
    studentId: number,
    date: Date,
    status: AttendanceStatus,
    comments?: string
  ): Promise<AttendanceGrade> {
    const result = await pool.query(
      `INSERT INTO attendance_grades (class_id, student_id, date, attendance, comments)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (class_id, student_id, date)
       DO UPDATE SET attendance = $4, comments = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [classId, studentId, date, status, comments]
    );

    return result.rows[0];
  }

  async setGrade(classId: number, studentId: number, date: Date, grade: number, comments?: string): Promise<AttendanceGrade> {
    const result = await pool.query(
      `INSERT INTO attendance_grades (class_id, student_id, date, grade, comments)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (class_id, student_id, date)
       DO UPDATE SET grade = $4, comments = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [classId, studentId, date, grade, comments]
    );

    return result.rows[0];
  }

  async getStudentGrades(studentId: number, subjectId?: number): Promise<AttendanceGrade[]> {
    let query = `
      SELECT ag.* FROM attendance_grades ag
      JOIN classes c ON ag.class_id = c.id
      WHERE ag.student_id = $1
    `;

    const params: any[] = [studentId];

    if (subjectId) {
      query += ` AND c.subject_id = $2`;
      params.push(subjectId);
    }

    query += ` ORDER BY ag.date DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  async getClassAttendance(classId: number, date: Date): Promise<AttendanceGrade[]> {
    const result = await pool.query(
      `SELECT * FROM attendance_grades WHERE class_id = $1 AND date = $2 ORDER BY student_id`,
      [classId, date]
    );

    return result.rows;
  }
}

export const attendanceService = new AttendanceService();
