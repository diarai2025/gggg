import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Расширяем тип Request для добавления user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

/**
 * Production middleware для аутентификации через Supabase JWT токены
 * 
 * Требования:
 * 1. Установите @supabase/supabase-js: npm install @supabase/supabase-js
 * 2. Добавьте в .env: SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY
 * 
 * Middleware проверяет JWT токен из заголовка Authorization: Bearer <token>
 * и валидирует его через Supabase Admin API
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[authMiddleware] Токен не предоставлен. Заголовок authorization:', authHeader ? 'присутствует, но неверный формат' : 'отсутствует');
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    const token = authHeader.substring(7);
    console.log('[authMiddleware] Получен токен, длина:', token.length);

    // Проверка токена через Supabase Admin API
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[authMiddleware] Supabase credentials not configured.');
      console.error('[authMiddleware] SUPABASE_URL:', supabaseUrl ? 'установлен' : 'не установлен');
      console.error('[authMiddleware] SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'установлен' : 'не установлен');
      return res.status(500).json({ error: 'Ошибка конфигурации сервера: настройте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env' });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('[authMiddleware] Ошибка проверки токена:', error?.message || 'Пользователь не найден');
      console.error('[authMiddleware] Детали ошибки:', error);
      
      // Более детальные сообщения об ошибках
      if (error?.message?.includes('JWT')) {
        return res.status(401).json({ error: 'Недействительный токен. Пожалуйста, войдите заново.' });
      }
      if (error?.message?.includes('expired')) {
        return res.status(401).json({ error: 'Токен истек. Пожалуйста, войдите заново.' });
      }
      
      return res.status(401).json({ error: 'Недействительный токен' });
    }
    
    console.log('[authMiddleware] Пользователь аутентифицирован:', user.id, user.email);
    
    // Добавляем user в request
    req.user = {
      id: user.id,
      email: user.email || '',
    };

    next();
  } catch (error: any) {
    console.error('[authMiddleware] Ошибка аутентификации:', error);
    console.error('[authMiddleware] Стек ошибки:', error?.stack);
    res.status(401).json({ error: 'Ошибка аутентификации' });
  }
}

// Опциональное middleware для разработки (без проверки токена)
export function devAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // В режиме разработки используем заголовки для идентификации пользователя
  const userId = req.headers['x-user-id'] as string || 'dev-user-id';
  const userEmail = req.headers['x-user-email'] as string || 'dev@example.com';

  console.log('[devAuthMiddleware] Headers:', {
    'x-user-id': req.headers['x-user-id'],
    'x-user-email': req.headers['x-user-email'],
  });
  console.log('[devAuthMiddleware] Используемые значения:', { userId, userEmail });

  req.user = {
    id: userId,
    email: userEmail,
  };

  next();
}

