import { Request, Response } from 'express';
import { submissionService } from '../services/submissionService';
import multer from 'multer';
import path from 'path';

export class SubmissionController {
  async createAssignment(req: Request, res: Response) {
    try {
      const { subjectId, title, description, type, deadline, isTeamWork } = req.body;

      const assignment = await submissionService.createAssignment(
        subjectId,
        title,
        description,
        type,
        deadline ? new Date(deadline) : undefined,
        isTeamWork
      );

      res.status(201).json(assignment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async submitAssignment(req: Request, res: Response) {
    try {
      const { assignmentId } = req.params;
      const { content } = req.body;

      let filePath: string | undefined;
      if (req.file) {
        filePath = req.file.path;
      }

      if (!req.user) {
        return res.status(401).json({ error: 'No user' });
      }

      const submission = await submissionService.submitAssignment(
        parseInt(assignmentId),
        req.user.id,
        filePath,
        content
      );

      res.status(201).json(submission);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async gradeSubmission(req: Request, res: Response) {
    try {
      const { submissionId } = req.params;
      const { grade, comments } = req.body;

      const submission = await submissionService.gradeSubmission(
        parseInt(submissionId),
        grade,
        comments
      );

      res.json(submission);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAssignmentSubmissions(req: Request, res: Response) {
    try {
      const { assignmentId } = req.params;

      const submissions = await submissionService.getAssignmentSubmissions(
        parseInt(assignmentId)
      );

      res.json(submissions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStudentSubmissions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No user' });
      }

      const submissions = await submissionService.getStudentSubmissions(req.user.id);
      res.json(submissions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSubjectAssignments(req: Request, res: Response) {
    try {
      const { subjectId } = req.params;

      const assignments = await submissionService.getSubjectAssignments(
        parseInt(subjectId)
      );

      res.json(assignments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const submissionController = new SubmissionController();
