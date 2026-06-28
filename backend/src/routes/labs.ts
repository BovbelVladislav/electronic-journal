import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { auth, AuthRequest, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', auth, async (_req, res) => {
  const labs = await prisma.lab.findMany({
    include: { subject: { select: { title: true, code: true } }, _count: { select: { submissions: true } } },
    orderBy: { issuedAt: 'desc' },
  });
  res.json(labs);
});

router.get('/subject/:subjectId', auth, async (req, res) => {
  const labs = await prisma.lab.findMany({
    where: { subjectId: Number(req.params.subjectId) },
    include: { _count: { select: { submissions: true } } },
    orderBy: { issuedAt: 'desc' },
  });
  res.json(labs);
});

router.get('/:id', auth, async (req, res) => {
  const lab = await prisma.lab.findUnique({
    where: { id: Number(req.params.id) },
    include: { subject: true, submissions: { include: { student: { select: { id: true, name: true } }, files: true, grade: true, comments: { include: { author: { select: { name: true } } } } } } },
  });
  if (!lab) return res.status(404).json({ message: 'Not found' });
  res.json(lab);
});

router.post('/', auth, requireRole('TEACHER', 'ADMIN'), async (req, res) => {
  const { subjectId, title, description, deadline, teamWork } = req.body;
  if (!subjectId || !title) return res.status(400).json({ message: 'subjectId, title required' });
  const lab = await prisma.lab.create({
    data: { subjectId, title, description, deadline: deadline ? new Date(deadline) : null, teamWork: !!teamWork },
    include: { subject: { select: { title: true } } },
  });
  res.status(201).json(lab);
});

router.post('/:id/submit', auth, requireRole('STUDENT'), upload.array('files', 5), async (req: AuthRequest, res) => {
  const labId = Number(req.params.id);
  const lab = await prisma.lab.findUnique({ where: { id: labId } });
  if (!lab) return res.status(404).json({ message: 'Lab not found' });

  let submission = await prisma.labSubmission.findFirst({ where: { labId, studentId: req.user!.id } });
  if (!submission) {
    submission = await prisma.labSubmission.create({ data: { labId, studentId: req.user!.id } });
  }

  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length) {
    await prisma.file.createMany({
      data: files.map((f) => ({
        filename: f.originalname,
        path: f.path,
        mime: f.mimetype,
        size: f.size,
        submissionId: submission!.id,
      })),
    });
  }

  const result = await prisma.labSubmission.findUnique({
    where: { id: submission.id },
    include: { files: true, grade: true, comments: { include: { author: { select: { name: true } } } } },
  });
  res.json(result);
});

router.get('/my/submissions', auth, requireRole('STUDENT'), async (req: AuthRequest, res) => {
  const submissions = await prisma.labSubmission.findMany({
    where: { studentId: req.user!.id },
    include: { lab: { include: { subject: { select: { title: true } } } }, files: true, grade: true, comments: { include: { author: { select: { name: true } } } } },
    orderBy: { submittedAt: 'desc' },
  });
  res.json(submissions);
});

router.patch('/submissions/:id/grade', auth, requireRole('TEACHER', 'ADMIN'), async (req, res) => {
  const { value, comment } = req.body;
  const submission = await prisma.labSubmission.findUnique({
    where: { id: Number(req.params.id) },
    include: { lab: true, grade: true },
  });
  if (!submission) return res.status(404).json({ message: 'Not found' });

  const grade = submission.grade
    ? await prisma.grade.update({ where: { id: submission.grade.id }, data: { value: Number(value), comment } })
    : await prisma.grade.create({
        data: { studentId: submission.studentId!, subjectId: submission.lab.subjectId, value: Number(value), type: 'LAB', comment, submissionId: submission.id },
      });
  res.json(grade);
});

router.post('/submissions/:id/comments', auth, async (req: AuthRequest, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'text required' });
  const comment = await prisma.comment.create({
    data: { text, authorId: req.user!.id, submissionId: Number(req.params.id) },
    include: { author: { select: { name: true } } },
  });
  res.status(201).json(comment);
});

router.delete('/:id', auth, requireRole('TEACHER', 'ADMIN'), async (req, res) => {
  await prisma.lab.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default router;
