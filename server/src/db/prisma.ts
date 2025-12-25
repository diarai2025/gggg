import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// В режиме разработки не используем глобальный кеш, чтобы избежать проблем
// со старым экземпляром Prisma Client после перегенерации
let prismaInstance: PrismaClient;

// Проверяем DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || '';

if (databaseUrl) {
  if (databaseUrl.includes(':6543/')) {
    console.log('✅ Используется Connection Pooling URL (порт 6543)');
  } else if (databaseUrl.includes(':5432/')) {
    console.log('✅ Используется прямой URL (порт 5432)');
    console.log('⚠️  Убедитесь, что Network Restrictions отключены в Supabase');
  }
}

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

// Проверяем наличие DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: DATABASE_URL не установлен!');
  console.error('❌ Установите DATABASE_URL в переменных окружения');
  console.error('❌ Для Vercel: Settings → Environment Variables → DATABASE_URL');
} else {
  console.log('✅ DATABASE_URL установлен');
  // Скрываем пароль в логах
  const dbUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
  console.log('📡 DATABASE_URL:', dbUrl);
}

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
  .catch((error: any) => {
    console.error('❌ Ошибка подключения к базе данных:', error);
    console.error('Детали ошибки:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    
    // Более детальные сообщения об ошибках
    if (error.code === 'P1001') {
      console.error('❌ Не удалось подключиться к серверу базы данных');
      console.error('❌ Проверьте:');
      console.error('   1. DATABASE_URL установлен правильно');
      console.error('   2. Пароль в DATABASE_URL верный');
      console.error('   3. База данных доступна (Network Restrictions отключены)');
    } else if (error.code === 'P1000') {
      console.error('❌ Ошибка аутентификации');
      console.error('❌ Проверьте пароль в DATABASE_URL');
    }
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

