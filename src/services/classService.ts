import pool from '../database/pool';
import { Class } from '../types';

export class ClassService {
  async createClass(
    subjectId: number,
    groupId: number,
    teacherId: number,
    startTime: string,
    endTime: string,
    dayOfWeek: number,
    room?: string
  ): Promise<Class> {
    const result = await pool.query(
      `INSERT INTO classes (subject_id, group_id, teacher_id, start_time, end_time, day_of_week, room)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [subjectId, groupId, teacherId, startTime, endTime, dayOfWeek, room]
    );

    return result.rows[0];
  }

  async getTeacherClasses(teacherId: number): Promise<Class[]> {
    const result = await pool.query(
      `SELECT * FROM classes WHERE teacher_id = $1 ORDER BY day_of_week, start_time`,
      [teacherId]
    );

    return result.rows;
  }

  async getGroupClasses(groupId: number): Promise<Class[]> {
    const result = await pool.query(
      `SELECT * FROM classes WHERE group_id = $1 ORDER BY day_of_week, start_time`,
      [groupId]
    );

    return result.rows;
  }

  async getStudentClasses(studentId: number): Promise<Class[]> {
    const result = await pool.query(
      `SELECT c.* FROM classes c
       JOIN student_group sg ON c.group_id = sg.group_id
       WHERE sg.student_id = $1
       ORDER BY c.day_of_week, c.start_time`,
      [studentId]
    );

    return result.rows;
  }

  async deleteClass(classId: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM classes WHERE id = $1', [classId]);
    return result.rowCount! > 0;
  }
}

export const classService = new ClassService();
