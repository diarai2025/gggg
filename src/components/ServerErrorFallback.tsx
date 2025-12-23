import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ServerErrorFallbackProps {
  onRetry?: () => void;
  isRetrying?: boolean;
  errorMessage?: string;
}

export function ServerErrorFallback({ 
  onRetry, 
  isRetrying = false,
  errorMessage 
}: ServerErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-red-400" />
          </div>
        </div>
        
        <h2 className="text-white text-2xl font-semibold mb-3">
          Сервер недоступен
        </h2>
        
        <p className="text-gray-400 mb-6">
          {errorMessage || 'Не удалось подключиться к серверу. Пожалуйста, проверьте подключение к интернету и убедитесь, что бэкенд запущен.'}
        </p>

        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium mb-2">Что можно сделать:</p>
              <ul className="text-gray-400 text-sm space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Проверьте подключение к интернету</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Убедитесь, что бэкенд запущен на {import.meta.env.VITE_API_URL || 'http://localhost:3001'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Запустите сервер командой: <code className="bg-slate-800 px-2 py-0.5 rounded text-xs">cd server && npm run dev</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Попробуйте обновить страницу</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Подключение...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Попробовать снова
              </>
            )}
          </button>
        )}

        <button
          onClick={() => window.location.reload()}
          className="w-full mt-3 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Wifi className="w-5 h-5" />
          Обновить страницу
        </button>
      </div>
    </div>
  );
}

