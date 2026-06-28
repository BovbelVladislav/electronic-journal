import { Router } from 'express';
import authRoutes from './auth';
import subjectsRoutes from './subjects';
import lessonsRoutes from './lessons';
import attendanceRoutes from './attendance';
import gradesRoutes from './grades';
import labsRoutes from './labs';
import usersRoutes from './users';

const router = Router();
router.use('/auth', authRoutes);
router.use('/subjects', subjectsRoutes);
router.use('/lessons', lessonsRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/grades', gradesRoutes);
router.use('/labs', labsRoutes);
router.use('/users', usersRoutes);

export default router;
