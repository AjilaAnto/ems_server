import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export type Role = 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';
export interface AuthUser { id: string; role: Role }

declare module 'express-serve-static-core' {
  interface Request { user?: AuthUser }
}

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new AppError(401, 'Missing token');
  try {
    const p = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as AuthUser;
    req.user = { id: p.id, role: p.role };
    next();
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }
};

export const authorize = (...roles: Role[]): RequestHandler => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) throw new AppError(403, 'Forbidden');
  next();
};