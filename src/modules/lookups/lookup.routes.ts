import { Router } from 'express';
import { prisma } from '../../config/prisma';
import { authenticate } from '../../middlewares/auth';

const router = Router();
router.use(authenticate);
router.get('/departments', async (_req, res) => {
  res.json({ success: true, data: await prisma.department.findMany({ orderBy: { name: 'asc' } }) });
});
router.get('/designations', async (_req, res) => {
  res.json({ success: true, data: await prisma.designation.findMany({ orderBy: { title: 'asc' } }) });
});
export default router;