import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        return void res
            .status(err.statusCode)
            .json({ success: false, message: err.message, details: err.details });
    }

    if (err instanceof ZodError) {
        const details = err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
        return void res.status(400).json({ success: false, message: 'Validation failed', details });
    }

    // Prisma unique constraint violation (checked by code, no class import needed)
    if (err?.code === 'P2002') {
        return void res.status(409).json({ success: false, message: 'Duplicate value', details: err.meta });
    }
    if (err?.code === 'P2003')
        return void res.status(400).json({ success: false, message: 'Invalid reference (department, designation or manager)' });
    if (err?.code === 'P2025')
        return void res.status(404).json({ success: false, message: 'Record not found' });
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
};