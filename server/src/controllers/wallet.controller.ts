import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

// Получить кошелек пользователя
export async function getWallet(req: Request, res: Response) {
  try {
    const userEmail = req.user?.email;
    console.log('[getWallet] Запрос на получение кошелька для пользователя:', userEmail);

    if (!userEmail) {
      console.error('[getWallet] Email пользователя не предоставлен');
      return res.status(401).json({ error: 'Email пользователя не предоставлен' });
    }

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      console.error('[getWallet] Пользователь не найден:', userEmail);
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    console.log('[getWallet] Пользователь найден, ID:', user.id);

    // Ищем или создаем кошелек пользователя
    let wallet;
    
    // Проверяем доступность модели wallet перед использованием
    const walletModel = (prisma as any).wallet;
    if (!walletModel || typeof walletModel.findUnique !== 'function') {
      const errorDetails = {
        message: 'Модель Wallet не найдена в Prisma Client. Prisma Client нужно перегенерировать.',
        code: 'PRISMA_MODEL_NOT_FOUND',
        name: 'PrismaClientError',
        solution: 'Выполните следующие команды:',
        steps: [
          '1. Откройте терминал',
          '2. Перейдите в папку server: cd server',
          '3. Запустите: npm run prisma:generate',
          '4. Перезапустите сервер: npm run dev'
        ],
        alternative: 'Или используйте: ./node_modules/.bin/prisma generate',
        hasWalletModel: !!walletModel,
        walletModelType: typeof walletModel,
      };
      
      console.error('[getWallet] Модель Wallet недоступна в Prisma Client');
      console.error('[getWallet] Проверка модели:', {
        exists: !!walletModel,
        type: typeof walletModel,
        hasFindUnique: walletModel && typeof walletModel.findUnique === 'function',
      });
      console.error('[getWallet] Детали ошибки:', errorDetails);
      
      return res.status(500).json({
        error: 'Модель Wallet не найдена. Запустите: cd server && npm run prisma:generate',
        message: 'Prisma Client не содержит модель Wallet. Необходимо перегенерировать клиент.',
        details: errorDetails,
      });
    }
    
    try {
      wallet = await (prisma as any).wallet.findUnique({
        where: { userId: user.id },
      });
    } catch (prismaError: any) {
      console.error('[getWallet] Ошибка Prisma при поиске кошелька:', prismaError);
      console.error('[getWallet] Детали ошибки Prisma:', {
        message: prismaError.message,
        code: prismaError.code,
        name: prismaError.name,
        stack: prismaError.stack,
      });
      
      // Если это ошибка "Unknown model" или связанная с wallet
      if (prismaError.message?.includes('Unknown model') || 
          prismaError.message?.includes('wallet') ||
          prismaError.message?.includes('prisma.wallet') ||
          prismaError.message?.includes('is not a function') ||
          prismaError.code === 'P2001') {
        const errorDetails = {
          message: prismaError.message || 'Модель Wallet не найдена в Prisma Client',
          code: prismaError.code || 'UNKNOWN_MODEL',
          name: prismaError.name || 'PrismaClientKnownRequestError',
          solution: 'Выполните следующие команды:',
          steps: [
            '1. Откройте терминал',
            '2. Перейдите в папку server: cd server',
            '3. Запустите: npm run prisma:generate',
            '4. Перезапустите сервер: npm run dev'
          ],
        };
        
        console.error('[getWallet] Отправляем ошибку "Unknown model":', errorDetails);
        
        return res.status(500).json({
          error: 'Модель Wallet не найдена. Запустите: cd server && npm run prisma:generate',
          message: 'Prisma Client не содержит модель Wallet. Необходимо перегенерировать клиент.',
          details: errorDetails,
        });
      }
      
      throw prismaError;
    }

    if (!wallet) {
      console.log('[getWallet] Кошелек не найден, создаем новый для userId:', user.id);
      try {
        wallet = await (prisma as any).wallet.create({
          data: {
            userId: user.id,
            balance: 0,
            currency: '₸',
          },
        });
        console.log('[getWallet] Кошелек успешно создан, ID:', wallet.id);
      } catch (createError: any) {
        console.error('[getWallet] Ошибка при создании кошелька:', createError);
        console.error('[getWallet] Детали ошибки:', {
          message: createError.message,
          code: createError.code,
          meta: createError.meta,
        });
        throw createError;
      }
    } else {
      console.log('[getWallet] Кошелек найден, ID:', wallet.id, 'Баланс:', wallet.balance);
    }

    res.json({
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance.toString(),
      currency: wallet.currency,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    });
  } catch (error: any) {
    console.error('[getWallet] Ошибка при получении кошелька:', error);
    console.error('[getWallet] Детали ошибки:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      name: error.name,
      stack: error.stack,
    });
    
    // Более детальное сообщение об ошибке
    let errorMessage = 'Ошибка при получении кошелька';
    let userFriendlyMessage = errorMessage;
    
    // Всегда передаем детали (не только в режиме разработки)
    const errorDetails: any = {
      message: String(error.message || 'Неизвестная ошибка'),
      code: String(error.code || 'UNKNOWN'),
      name: String(error.name || 'Error'),
    };
    
    if (error.code === 'P2002') {
      errorMessage = 'Кошелек с таким userId уже существует';
      userFriendlyMessage = errorMessage;
    } else if (error.code === 'P2025') {
      errorMessage = 'Запись не найдена';
      userFriendlyMessage = errorMessage;
    } else if (error.message?.includes('Unknown model') || 
               error.message?.includes('wallet') ||
               error.message?.includes('prisma.wallet') ||
               error.message?.includes('is not a function') ||
               error.message?.includes('Wallet model not found')) {
      errorMessage = 'Модель Wallet не найдена в Prisma Client';
      userFriendlyMessage = 'Модель Wallet не найдена. Запустите: cd server && npm run prisma:generate';
      errorDetails.code = 'PRISMA_MODEL_NOT_FOUND';
      errorDetails.solution = 'Выполните следующие команды:';
      errorDetails.steps = [
        '1. Откройте терминал',
        '2. Перейдите в папку server: cd server',
        '3. Запустите: npm run prisma:generate',
        '4. Перезапустите сервер: npm run dev'
      ];
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Добавляем дополнительную информацию в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      if (error.stack) {
        errorDetails.stack = String(error.stack).split('\n').slice(0, 10).join('\n');
      }
      if (error.meta) {
        errorDetails.meta = error.meta;
      }
    }
    
    // Логируем полные детали для отладки
    const responseData = { 
      error: userFriendlyMessage,
      details: errorDetails,
    };
    console.error('[getWallet] Отправляем ответ клиенту:', JSON.stringify(responseData, null, 2));
    console.error('[getWallet] Проверка headersSent:', res.headersSent);
    
    // Убеждаемся, что ответ еще не отправлен
    if (!res.headersSent) {
      try {
        res.status(500).json(responseData);
        console.error('[getWallet] Ответ успешно отправлен с деталями');
      } catch (sendError: any) {
        console.error('[getWallet] Ошибка при отправке ответа:', sendError);
        // Если не удалось отправить JSON, пробуем отправить простой текст
        if (!res.headersSent) {
          res.status(500).send(JSON.stringify(responseData));
        }
      }
    } else {
      console.error('[getWallet] Ответ уже отправлен, не можем отправить детали ошибки');
    }
  }
}

// Пополнить кошелек
export async function addFunds(req: Request, res: Response) {
  try {
    const userEmail = req.user?.email;
    const { amount } = req.body;

    if (!userEmail) {
      return res.status(401).json({ error: 'Email пользователя не предоставлен' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Сумма должна быть положительным числом' });
    }

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Ищем или создаем кошелек пользователя
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
          currency: '₸',
        },
      });
    }

    // Обновляем баланс
    const newBalance = Number(wallet.balance) + Number(amount);
    wallet = await prisma.wallet.update({
      where: { userId: user.id },
      data: { balance: newBalance },
    });

    res.json({
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance.toString(),
      currency: wallet.currency,
      message: `Кошелек пополнен на ${amount} ${wallet.currency}`,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    });
  } catch (error) {
    console.error('Ошибка при пополнении кошелька:', error);
    res.status(500).json({ error: 'Ошибка при пополнении кошелька' });
  }
}

// Снять средства с кошелька
export async function withdrawFunds(req: Request, res: Response) {
  try {
    const userEmail = req.user?.email;
    const { amount } = req.body;

    if (!userEmail) {
      return res.status(401).json({ error: 'Email пользователя не предоставлен' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Сумма должна быть положительным числом' });
    }

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Ищем кошелек пользователя
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Кошелек не найден' });
    }

    // Проверяем достаточность средств
    const currentBalance = Number(wallet.balance);
    const withdrawAmount = Number(amount);

    if (currentBalance < withdrawAmount) {
      return res.status(400).json({ 
        error: `Недостаточно средств. Доступно: ${currentBalance} ${wallet.currency}` 
      });
    }

    // Обновляем баланс
    const newBalance = currentBalance - withdrawAmount;
    wallet = await prisma.wallet.update({
      where: { userId: user.id },
      data: { balance: newBalance },
    });

    res.json({
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance.toString(),
      currency: wallet.currency,
      message: `С кошелька снято ${amount} ${wallet.currency}`,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    });
  } catch (error) {
    console.error('Ошибка при снятии средств:', error);
    res.status(500).json({ error: 'Ошибка при снятии средств' });
  }
}

// Обновить валюту кошелька
export async function updateCurrency(req: Request, res: Response) {
  try {
    const userEmail = req.user?.email;
    const { currency } = req.body;

    if (!userEmail) {
      return res.status(401).json({ error: 'Email пользователя не предоставлен' });
    }

    if (!currency || currency.trim() === '') {
      return res.status(400).json({ error: 'Валюта обязательна' });
    }

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Ищем или создаем кошелек пользователя
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
          currency: currency.trim(),
        },
      });
    } else {
      wallet = await prisma.wallet.update({
        where: { userId: user.id },
        data: { currency: currency.trim() },
      });
    }

    res.json({
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance.toString(),
      currency: wallet.currency,
      message: 'Валюта кошелька обновлена',
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    });
  } catch (error) {
    console.error('Ошибка при обновлении валюты:', error);
    res.status(500).json({ error: 'Ошибка при обновлении валюты' });
  }
}

