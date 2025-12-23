import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('=== ERROR HANDLER ===');
  console.error('Ошибка:', err);
  console.error('Тип ошибки:', err.constructor.name);
  console.error('Сообщение:', err.message);
  if ((err as any).stack) {
    console.error('Stack trace:', (err as any).stack);
  }
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('Headers:', JSON.stringify(req.headers, null, 2));

  // Проверяем, не был ли ответ уже отправлен
  if (res.headersSent) {
    return next(err);
  }

  // Всегда передаем детали ошибки
  const errorDetails: any = {
    message: String(err.message || 'Неизвестная ошибка'),
    name: String(err.name || 'Error'),
    code: String((err as any).code || 'UNKNOWN'),
  };

  // Проверяем, связана ли ошибка с отсутствием модели Wallet
  if (err.message?.includes('wallet') || 
      err.message?.includes('Wallet') ||
      err.message?.includes('is not a function') ||
      err.message?.includes('Unknown model') ||
      err.message?.includes('prisma.wallet')) {
    errorDetails.code = 'PRISMA_MODEL_NOT_FOUND';
    errorDetails.solution = 'Выполните: cd server && npm run prisma:generate';
    errorDetails.steps = [
      '1. Откройте терминал',
      '2. Перейдите в папку server: cd server',
      '3. Запустите: npm run prisma:generate',
      '4. Перезапустите сервер: npm run dev'
    ];
  }

  // Добавляем дополнительную информацию в режиме разработки
  if (process.env.NODE_ENV === 'development') {
    if ((err as any).stack) {
      errorDetails.stack = String((err as any).stack).split('\n').slice(0, 10).join('\n');
    }
    if ((err as any).meta) {
      errorDetails.meta = (err as any).meta;
    }
  }

  console.error('[errorHandler] Отправляем ответ с деталями:', JSON.stringify({
    error: err.message || 'Внутренняя ошибка сервера',
    message: err.message,
    details: errorDetails,
  }, null, 2));

  res.status(500).json({
    error: err.message || 'Внутренняя ошибка сервера',
    message: err.message,
    details: errorDetails,
  });
}

