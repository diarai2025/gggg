import { Wallet as WalletIcon, Plus, RefreshCw, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { walletAPI, Wallet, APIError } from '../lib/api';

interface WalletProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function Wallet({ showToast }: WalletProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletAPI.getWallet();
      setWallet(data);
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке кошелька:', error);
      let errorMessage = 'Не удалось загрузить кошелек';
      
      if (error instanceof APIError) {
        if (error.isNetworkError) {
          errorMessage = 'Не удалось подключиться к серверу. Убедитесь, что сервер запущен.';
        } else if (error.statusCode === 404) {
          errorMessage = 'Пользователь не найден. Пожалуйста, войдите заново.';
        } else if (error.statusCode === 401) {
          errorMessage = 'Ошибка аутентификации. Пожалуйста, войдите заново.';
        } else if (error.statusCode === 500) {
          // Проверяем детали ошибки от сервера
          const errorDetails = (error as any).errorDetails || (error as any).serverErrorData?.details;
          const serverErrorData = (error as any).serverErrorData;
          
          // Проверяем различные варианты сообщений об ошибке модели Wallet
          const isWalletModelError = 
            errorDetails?.message?.includes('Unknown model') || 
            errorDetails?.message?.includes('wallet') ||
            errorDetails?.message?.includes('Prisma Client') ||
            errorDetails?.message?.includes('не найдена') ||
            errorDetails?.code === 'PRISMA_MODEL_NOT_FOUND' ||
            errorDetails?.code === 'UNKNOWN_MODEL' ||
            serverErrorData?.details?.message?.includes('Unknown model') ||
            serverErrorData?.details?.message?.includes('Wallet') ||
            serverErrorData?.error?.includes('Wallet') ||
            error.message?.includes('Wallet') ||
            error.message?.includes('prisma:generate');
          
          if (isWalletModelError) {
            errorMessage = 'Модель Wallet не найдена в Prisma Client. Запустите: cd server && npm run prisma:generate';
          } else if (errorDetails?.message) {
            errorMessage = `Ошибка сервера: ${errorDetails.message}`;
          } else if (serverErrorData?.details?.message) {
            errorMessage = `Ошибка сервера: ${serverErrorData.details.message}`;
          } else if (serverErrorData?.error) {
            errorMessage = serverErrorData.error;
          } else {
            errorMessage = error.message || 'Ошибка при загрузке кошелька. Проверьте логи сервера.';
          }
        } else if (error.message?.includes('Unknown model') || error.message?.includes('Wallet')) {
          errorMessage = 'Модель Wallet не найдена. Запустите: cd server && npm run prisma:generate';
        } else {
          errorMessage = error.message || 'Ошибка при загрузке кошелька';
        }
        
        const errorDetails = (error as any).errorDetails || (error as any).serverErrorData?.details;
        console.error('Детали ошибки API:', {
          statusCode: error.statusCode,
          isNetworkError: error.isNetworkError,
          isServerError: error.isServerError,
          message: error.message,
          errorDetails: errorDetails,
          serverErrorData: (error as any).serverErrorData,
        });
      } else {
        errorMessage = 'Не удалось загрузить кошелек. Проверьте подключение к серверу.';
      }
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const handleAddFunds = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Введите корректную сумму', 'error');
      return;
    }

    try {
      setIsAdding(true);
      const result = await walletAPI.addFunds(parseFloat(amount));
      setWallet(result);
      setAmount('');
      setShowAddForm(false);
      showToast(result.message || 'Кошелек успешно пополнен', 'success');
    } catch (error) {
      console.error('Ошибка при пополнении кошелька:', error);
      if (error instanceof APIError) {
        showToast(error.message || 'Ошибка при пополнении кошелька', 'error');
      } else {
        showToast('Ошибка при пополнении кошелька', 'error');
      }
    } finally {
      setIsAdding(false);
    }
  }, [amount, showToast]);


  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
              <WalletIcon className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Кошелек</h3>
              <p className="text-gray-400 text-sm">Баланс вашего счета</p>
            </div>
          </div>
        </div>
        <div className="text-center py-6">
          <p className="text-red-400 mb-2 font-medium">{error || 'Не удалось загрузить кошелек'}</p>
          {(error?.includes('prisma:generate') || error?.includes('Unknown model') || error?.includes('Модель Wallet') || error?.includes('Prisma Client')) && (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-4 text-left">
              <p className="text-yellow-400 text-sm font-semibold mb-3">🔧 Инструкция по исправлению:</p>
              <div className="space-y-2 mb-3">
                <p className="text-gray-300 text-sm">1. Откройте терминал</p>
                <p className="text-gray-300 text-sm">2. Перейдите в папку server:</p>
                <code className="text-yellow-400 text-xs block bg-black/50 p-2 rounded">
                  cd server
                </code>
                <p className="text-gray-300 text-sm">3. Сгенерируйте Prisma Client:</p>
                <code className="text-yellow-400 text-xs block bg-black/50 p-2 rounded mb-2">
                  npm run prisma:generate
                </code>
                <p className="text-gray-300 text-sm">4. Перезапустите сервер:</p>
                <code className="text-yellow-400 text-xs block bg-black/50 p-2 rounded">
                  npm run dev
                </code>
              </div>
              <p className="text-gray-400 text-xs mt-3 border-t border-slate-600 pt-3">
                💡 <strong>Причина:</strong> Prisma Client не содержит модель Wallet. После генерации клиента ошибка исчезнет.
              </p>
            </div>
          )}
          <button
            onClick={loadWallet}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Загрузка...
              </>
            ) : (
              'Попробовать снова'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
            <WalletIcon className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Кошелек</h3>
            <p className="text-gray-400 text-sm">Баланс вашего счета</p>
          </div>
        </div>
        <button
          onClick={loadWallet}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          title="Обновить"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="mb-6">
        <div className="text-gray-400 text-sm mb-2">Текущий баланс</div>
        <div className="text-3xl font-bold text-white mb-1">
          {formatBalance(wallet.balance)} {wallet.currency}
        </div>
        <div className="text-gray-500 text-xs">
          Обновлено: {new Date(wallet.updatedAt).toLocaleString('ru-RU')}
        </div>
      </div>

      <div className="flex gap-3">
        {!showAddForm ? (
          <button
            onClick={() => {
              setShowAddForm(true);
              setAmount('');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Пополнить
          </button>
        ) : (
          <div className="w-full flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Сумма"
              className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              min="0"
              step="0.01"
            />
            <button
              onClick={handleAddFunds}
              disabled={isAdding}
              className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Добавить
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setAmount('');
              }}
              className="px-4 py-3 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Отмена
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

