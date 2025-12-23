import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// В режиме разработки не используем глобальный кеш, чтобы избежать проблем
// со старым экземпляром Prisma Client после перегенерации
let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // В продакшене используем глобальный кеш для оптимизации
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    log: ['error'],
  });
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaInstance;
  }
} else {
  // В режиме разработки всегда создаем новый экземпляр
  // Это гарантирует, что после перегенерации Prisma Client будет использован новый экземпляр
  if (globalForPrisma.prisma) {
    // Отключаем старый экземпляр
    globalForPrisma.prisma.$disconnect().catch(() => {});
  }
  prismaInstance = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
  globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;

// Проверка подключения к базе данных при старте
let isConnected = false;
prisma.$connect()
  .then(() => {
    isConnected = true;
    console.log('✅ Подключение к базе данных установлено');
    
    // Проверяем доступность модели Wallet
    try {
      // Проверяем, что модель wallet доступна в Prisma Client
      if (!('wallet' in prisma)) {
        console.error('⚠️  ВНИМАНИЕ: Модель Wallet не найдена в Prisma Client!');
        console.error('⚠️  Выполните: cd server && npm run prisma:generate');
        console.error('⚠️  Затем перезапустите сервер');
      } else {
        console.log('✅ Модель Wallet доступна в Prisma Client');
      }
    } catch (checkError: any) {
      console.error('⚠️  Ошибка при проверке модели Wallet:', checkError.message);
      console.error('⚠️  Выполните: cd server && npm run prisma:generate');
    }
  })
  .catch((error) => {
    console.error('❌ Ошибка подключения к базе данных:', error);
    console.error('Детали ошибки:', {
      message: error.message,
      code: error.code,
    });
  });

// Экспортируем функцию для проверки подключения
export async function ensureConnection() {
  if (!isConnected) {
    try {
      await prisma.$connect();
      isConnected = true;
      console.log('✅ Подключение к базе данных восстановлено');
    } catch (error: any) {
      console.error('❌ Не удалось подключиться к базе данных:', error);
      throw new Error(`Ошибка подключения к базе данных: ${error.message}`);
    }
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

