import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';

const include = { department: true, designation: true };

export const employeeService = {
  async list(q: {
    page: number; limit: number; search?: string; departmentId?: number;
    sortBy: string; order: 'asc' | 'desc';
  }) {
    const where: Prisma.EmployeeWhereInput = {
      isDeleted: false,
      ...(q.departmentId && { departmentId: q.departmentId }),
      ...(q.search && {
        OR: [
          { firstName: { contains: q.search, mode: 'insensitive' } },
          { lastName: { contains: q.search, mode: 'insensitive' } },
          { email: { contains: q.search, mode: 'insensitive' } },
          { employeeCode: { contains: q.search, mode: 'insensitive' } },
        ],
      }),
    };
    const [items, total] = await prisma.$transaction([
      prisma.employee.findMany({
        where, include,
        orderBy: { [q.sortBy]: q.order },
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      prisma.employee.count({ where }),
    ]);
    return {
      items,
      meta: { total, page: q.page, limit: q.limit, totalPages: Math.ceil(total / q.limit) },
    };
  },

  async getById(id: string) {
    const emp = await prisma.employee.findFirst({
      where: { id, isDeleted: false },
      include: { ...include, manager: { select: { id: true, firstName: true, lastName: true } } },
    });
    if (!emp) throw new AppError(404, 'Employee not found');
    return emp;
  },

  create(data: Prisma.EmployeeUncheckedCreateInput) {
    return prisma.employee.create({ data, include });
  },

  async update(id: string, data: Prisma.EmployeeUncheckedUpdateInput) {
    await this.getById(id); // 404 if missing or deleted
    return prisma.employee.update({ where: { id }, data, include });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.employee.update({ where: { id }, data: { isDeleted: true } }); // soft delete
  },
};