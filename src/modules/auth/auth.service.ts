import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';

const hash = (t: string) => crypto.createHash('sha256').update(t).digest('hex');
const REFRESH_DAYS = 7;

const issueTokens = async (user: { id: string; role: string }) => {
  const accessToken = jwt.sign({ id: user.id, role: user.role }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id, jti: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, { expiresIn: `${REFRESH_DAYS}d` });
  await prisma.refreshToken.create({
    data: {
      tokenHash: hash(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_DAYS * 864e5),
    },
  });
  return { accessToken, refreshToken };
};

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash)))
      throw new AppError(401, 'Invalid credentials');
    const tokens = await issueTokens(user);
    return { ...tokens, user: { id: user.id, email: user.email, role: user.role } };
  },

  async refresh(token: string) {
    try { jwt.verify(token, env.JWT_REFRESH_SECRET); }
    catch { throw new AppError(401, 'Invalid refresh token'); }
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hash(token) }, include: { user: true } });
    if (!stored || stored.expiresAt < new Date()) throw new AppError(401, 'Refresh token expired');
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    return issueTokens(stored.user);
  },

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { tokenHash: hash(token) } });
  },
};