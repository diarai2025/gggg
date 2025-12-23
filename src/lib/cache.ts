// Утилиты для кэширования данных в localStorage

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_PREFIX = 'diarai_cache_';
const CACHE_TTL = 5 * 60 * 1000; // 5 минут в миллисекундах

export const cacheKeys = {
  campaigns: 'campaigns',
  leads: 'leads',
  deals: 'deals',
  tasks: 'tasks',
} as const;

/**
 * Сохраняет данные в кэш
 */
export function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (error) {
    console.warn('Ошибка сохранения в кэш:', error);
  }
}

/**
 * Получает данные из кэша
 */
export function getCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();

    // Проверяем, не истек ли кэш
    if (now - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.warn('Ошибка чтения из кэша:', error);
    return null;
  }
}

/**
 * Удаляет данные из кэша
 */
export function clearCache(key: string): void {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (error) {
    console.warn('Ошибка очистки кэша:', error);
  }
}

/**
 * Очищает весь кэш приложения
 */
export function clearAllCache(): void {
  try {
    Object.values(cacheKeys).forEach(key => {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    });
  } catch (error) {
    console.warn('Ошибка очистки всего кэша:', error);
  }
}

/**
 * Проверяет, актуальны ли данные в кэше
 */
export function isCacheValid(key: string): boolean {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return false;

    const entry: CacheEntry<unknown> = JSON.parse(cached);
    const now = Date.now();

    return now - entry.timestamp <= CACHE_TTL;
  } catch {
    return false;
  }
}

