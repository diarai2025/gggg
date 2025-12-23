import { useState, memo, useCallback, useMemo } from 'react';
import { Mail, Lock, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onLogin: (name: string) => void;
}

export const Login = memo(function Login({ onLogin }: LoginProps) {
  const { signIn, signUp, signInWithGoogle, signInWithApple, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('🇷🇺 RU');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getErrorMessage = useCallback((message: string): string => {
    if (message.includes('Invalid login credentials') || message.includes('invalid_grant')) {
      return 'Неверный email или пароль. Проверьте данные или зарегистрируйтесь.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Email не подтвержден. Проверьте почту и подтвердите регистрацию.';
    }
    if (message.includes('User already registered')) {
      return 'Пользователь с таким email уже зарегистрирован. Войдите или восстановите пароль.';
    }
    if (message.includes('Password')) {
      return 'Пароль должен содержать минимум 6 символов.';
    }
    if (message.includes('email') && message.includes('not found')) {
      return 'Пользователь с таким email не найден. Проверьте email или зарегистрируйтесь.';
    }
    if (message.includes('rate limit') || message.includes('too many')) {
      return 'Слишком много запросов. Пожалуйста, попробуйте позже.';
    }
    return message || 'Произошла ошибка. Попробуйте еще раз.';
  }, []);

  const handleEmailLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }
    
    if (!agreed) {
      setError('Необходимо согласие с политикой конфиденциальности');
      return;
    }

    setIsLoading(true);
    
    if (isSignUp) {
      // Регистрация
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(getErrorMessage(signUpError.message));
      } else {
        setError('Регистрация успешна! Проверьте email для подтверждения или войдите.');
        setIsSignUp(false);
      }
    } else {
      // Вход
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(getErrorMessage(signInError.message));
      } else {
        onLogin(email.split('@')[0]);
      }
    }
    
    setIsLoading(false);
  }, [email, password, agreed, isSignUp, signUp, signIn, getErrorMessage, onLogin]);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const handleSocialLogin = useCallback(async (provider: 'google' | 'apple') => {
    if (!agreed) {
      setError('Необходимо согласие с политикой конфиденциальности');
      return;
    }

    setError(null);
    if (provider === 'google') {
      await signInWithGoogle();
    } else {
      await signInWithApple();
    }
  }, [agreed, signInWithGoogle, signInWithApple]);

  const handleForgotPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!email) {
      setError('Введите email для восстановления пароля');
      return;
    }

    // Базовая валидация email
    if (!emailRegex.test(email)) {
      setError('Введите корректный email адрес');
      return;
    }

    setIsLoading(true);
    const { error: resetError } = await resetPassword(email);
    
    if (resetError) {
      setError(getErrorMessage(resetError.message));
    } else {
      setSuccessMessage('Письмо с инструкциями по восстановлению пароля отправлено на ваш email. Проверьте почту и следуйте инструкциям.');
      // Не закрываем форму, чтобы пользователь видел сообщение
    }
    
    setIsLoading(false);
  }, [email, emailRegex, getErrorMessage, resetPassword]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">
            DIAR
          </h1>
          <p className="text-gray-400">
            {showForgotPassword 
              ? 'Восстановление пароля' 
              : (isSignUp ? 'Регистрация' : 'Вход в аккаунт')}
          </p>
        </div>

        {/* Language selector */}
        <div className="mb-6">
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
            >
              <option>🇷🇺 RU</option>
              <option>🇰🇿 KZ</option>
              <option>🇺🇸 EN</option>
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        {/* Social login buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Вход через Google
          </button>

          <button
            onClick={() => handleSocialLogin('apple')}
            disabled={isLoading}
            className="w-full bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-3 border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Вход через Apple
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-slate-900 text-gray-500">или</span>
          </div>
        </div>

        {/* Email login form */}
        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4 mb-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email для восстановления пароля"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-black rounded-xl hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Отправка...' : 'Отправить инструкции'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setError(null);
                setSuccessMessage(null);
              }}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors"
            >
              ← Вернуться к входу
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  Забыли пароль?
                </button>
              </div>
            )}

            {!showForgotPassword && (
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-yellow-500 focus:ring-yellow-500/50"
                />
                <label htmlFor="agree" className="text-gray-400">
                  Я согласен с{' '}
                  <a href="#" className="text-yellow-500 hover:text-yellow-400">
                    политикой конфиденциальности
                  </a>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={(!agreed && !showForgotPassword) || isLoading}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-black rounded-xl hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (isSignUp ? 'Регистрация...' : 'Вход...') : (isSignUp ? 'Зарегистрироваться' : 'Войти')}
            </button>
          </form>
        )}

        {!showForgotPassword && (
          <p className="text-center text-gray-500">
            {isSignUp ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-yellow-500 hover:text-yellow-400"
            >
              {isSignUp ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
});