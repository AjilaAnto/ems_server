import { Request, Response } from 'express';
import { authService } from './auth.service';

export const login = async (req: Request, res: Response) => {
  const data = await authService.login(req.body.email, req.body.password);
  res.json({ success: true, data });
};
export const refresh = async (req: Request, res: Response) => {
  res.json({ success: true, data: await authService.refresh(req.body.refreshToken) });
};
export const logout = async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(204).send();
};