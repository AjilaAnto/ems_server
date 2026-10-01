import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { loginSchema, refreshSchema } from './auth.schema';
import * as c from './auth.controller';

const router = Router();
router.post('/login', validate(loginSchema), c.login);
router.post('/refresh', validate(refreshSchema), c.refresh);
router.post('/logout', validate(refreshSchema), c.logout);
export default router;