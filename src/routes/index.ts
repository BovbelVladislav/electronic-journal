// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth';
import classesRoutes from './classes';
import submissionsRoutes from './submissions';
import subjectsRoutes from './subjectRoutes';
import lessonRoutes from './lessonRoutes';
import attendanceRoutes from './attendance';
import commentsRoutes from './comments';
import journalRoutes from './journal';

const router = Router();

router.use('/auth', authRoutes);
router.use('/classes', classesRoutes);
router.use('/submissions', submissionsRoutes);
router.use('/subjects', subjectsRoutes);
router.use('/lessons', lessonRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/comments', commentsRoutes);
router.use('/journal', journalRoutes);

export default router;
