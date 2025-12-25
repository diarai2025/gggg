import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from '../src/middleware/errorHandler';
import { authMiddleware } from '../src/middleware/auth.middleware';

// Роуты
import leadsRoutes from '../src/routes/leads.routes';
import dealsRoutes from '../src/routes/deals.routes';
import tasksRoutes from '../src/routes/tasks.routes';
import crmRoutes from '../src/routes/crm.routes';
import dashboardRoutes from '../src/routes/dashboard.routes';
import campaignsRoutes from '../src/routes/campaigns.routes';
import userRoutes from '../src/routes/user.routes';
import aiRoutes from '../src/routes/ai.routes';
import walletRoutes from '../src/routes/wallet.routes';
import supportRoutes from '../src/routes/support.routes';
import adminRoutes from '../src/routes/admin.routes';

dotenv.config();

const app = express();

// CORS настройки - явно разрешаем фронтенд домен
const corsOptions = {
  origin: [
    'https://diarai.vercel.app',
    'https://diarai2025.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-email'],
  exposedHeaders: ['Content-Type'],
  maxAge: 86400 // 24 часа
};

// CORS middleware - должен быть ПЕРЕД всеми маршрутами
app.use(cors(corsOptions));

// Обработка preflight запросов
app.options('*', cors(corsOptions));

app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Корневой маршрут для проверки работоспособности
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'DIAR AI Server API',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api/*'
    }
  });
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

