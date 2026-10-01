import { Request, Response } from 'express';
import { employeeService } from './employee.service';
import { listQuerySchema } from './employee.schema';

export const list = async (req: Request, res: Response) => {
  const query = listQuerySchema.parse(req.query); // Express 5: req.query is read-only, so parse here
  const { items, meta } = await employeeService.list(query);
  res.json({ success: true, data: items, meta });
};
export const getOne = async (req: Request, res: Response) => {
  res.json({ success: true, data: await employeeService.getById(String(req.params.id)) });
};
export const create = async (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: await employeeService.create(req.body) });
};
export const update = async (req: Request, res: Response) => {
  res.json({ success: true, data: await employeeService.update(String(req.params.id), req.body) });
};
export const remove = async (req: Request, res: Response) => {
  await employeeService.remove(String(req.params.id));
  res.status(204).send();
};