import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth.middleware';

// Роуты
import leadsRoutes from './routes/leads.routes';
import dealsRoutes from './routes/deals.routes';
import tasksRoutes from './routes/tasks.routes';
import crmRoutes from './routes/crm.routes';
import dashboardRoutes from './routes/dashboard.routes';
import campaignsRoutes from './routes/campaigns.routes';
import userRoutes from './routes/user.routes';
import aiRoutes from './routes/ai.routes';
import walletRoutes from './routes/wallet.routes';
import supportRoutes from './routes/support.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/leads', authMiddleware, leadsRoutes);
app.use('/api/deals', authMiddleware, dealsRoutes);
app.use('/api/tasks', authMiddleware, tasksRoutes);
app.use('/api/crm', authMiddleware, crmRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/campaigns', authMiddleware, campaignsRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/wallet', authMiddleware, walletRoutes);
app.use('/api/support', authMiddleware, supportRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Экспорт для Vercel serverless функции
export default app;

