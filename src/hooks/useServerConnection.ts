import { useState, useEffect, useCallback } from 'react';
import { checkServerHealth, APIError } from '../lib/api';

interface UseServerConnectionReturn {
  isConnected: boolean;
  isChecking: boolean;
  error: APIError | null;
  checkConnection: () => Promise<void>;
}

export function useServerConnection(): UseServerConnectionReturn {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const isHealthy = await checkServerHealth();
      setIsConnected(isHealthy);
      if (!isHealthy) {
        setError(new APIError('Сервер недоступен', undefined, true, false));
      }
    } catch (err) {
      setIsConnected(false);
      if (err instanceof APIError) {
        setError(err);
      } else {
        setError(new APIError('Не удалось проверить подключение к серверу', undefined, true, false));
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Проверяем подключение при монтировании и периодически
  useEffect(() => {
    checkConnection();
    
    // Проверяем каждые 30 секунд
    const interval = setInterval(() => {
      if (!isConnected) {
        checkConnection();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [checkConnection, isConnected]);

  // Слушаем события онлайн/оффлайн
  useEffect(() => {
    const handleOnline = () => {
      checkConnection();
    };

    const handleOffline = () => {
      setIsConnected(false);
      setError(new APIError('Нет подключения к интернету', undefined, true, false));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection]);

  return {
    isConnected,
    isChecking,
    error,
    checkConnection,
  };
}

