import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import employeeRoutes from './modules/employees/employee.routes';
import lookupRoutes from './modules/lookups/lookup.routes';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);

app.use('/api/employees', employeeRoutes);
app.use('/api', lookupRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler); // always last
export default app; 