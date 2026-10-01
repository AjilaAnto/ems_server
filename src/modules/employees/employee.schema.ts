import { z } from 'zod';

export const createEmployeeSchema = z.object({
  employeeCode: z.string().min(2),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfJoining: z.coerce.date(),
  salary: z.coerce.number().positive(),
  departmentId: z.coerce.number().int(),
  designationId: z.coerce.number().int(),
  managerId: z.string().uuid().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  departmentId: z.coerce.number().int().optional(),
  sortBy: z.enum(['firstName', 'lastName', 'email', 'dateOfJoining', 'salary', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});