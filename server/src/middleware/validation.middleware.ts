import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Middleware для валидации тела запроса
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Логируем входящие данные для отладки (только в development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Валидация данных:', JSON.stringify(req.body, null, 2));
      }
      
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        
        // Логируем ошибки валидации
        console.error('Ошибки валидации:', errors);
        console.error('Полученные данные:', JSON.stringify(req.body, null, 2));
        
        return res.status(400).json({
          error: 'Ошибка валидации',
          details: errors,
        });
      }
      return res.status(400).json({ error: 'Ошибка валидации данных' });
    }
  };
}

// Middleware для валидации параметров запроса
export function validateParams(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          error: 'Ошибка валидации параметров',
          details: errors,
        });
      }
      return res.status(400).json({ error: 'Ошибка валидации параметров' });
    }
  };
}

// Middleware для валидации query параметров
export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          error: 'Ошибка валидации query параметров',
          details: errors,
        });
      }
      return res.status(400).json({ error: 'Ошибка валидации query параметров' });
    }
  };
}

