import pool from '../database/pool';

export interface Comment {
  id: number;
  submission_id: number;
  author_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export class CommentService {
  async addComment(submissionId: number, authorId: number, content: string): Promise<Comment> {
    const result = await pool.query(
      `INSERT INTO comments (submission_id, author_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [submissionId, authorId, content]
    );

    return result.rows[0];
  }

  async getSubmissionComments(submissionId: number): Promise<Comment[]> {
    const result = await pool.query(
      `SELECT * FROM comments WHERE submission_id = $1 ORDER BY created_at ASC`,
      [submissionId]
    );

    return result.rows;
  }

  async deleteComment(commentId: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    return result.rowCount! > 0;
  }

  async updateComment(commentId: number, content: string): Promise<Comment> {
    const result = await pool.query(
      `UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [content, commentId]
    );

    return result.rows[0];
  }
}

export const commentService = new CommentService();
