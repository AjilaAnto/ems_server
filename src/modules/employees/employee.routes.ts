import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { createEmployeeSchema, updateEmployeeSchema } from './employee.schema';
import * as c from './employee.controller';

const router = Router();
router.use(authenticate);

router.get('/', c.list);
router.get('/:id', c.getOne);
router.post('/', authorize('ADMIN', 'HR'), validate(createEmployeeSchema), c.create);
router.patch('/:id', authorize('ADMIN', 'HR'), validate(updateEmployeeSchema), c.update);
router.delete('/:id', authorize('ADMIN', 'HR'), c.remove);

export default router;