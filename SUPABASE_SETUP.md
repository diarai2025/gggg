# Настройка Supabase

## Шаг 1: Установка зависимостей

```bash
npm install
```

## Шаг 2: Создание проекта Supabase

1. Перейдите на [https://app.supabase.com](https://app.supabase.com)
2. Создайте новый проект или используйте существующий
3. Дождитесь завершения инициализации проекта

## Шаг 3: Получение ключей API

1. В панели управления Supabase перейдите в **Settings** → **API**
2. Найдите следующие значения:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon/public key** (длинная строка, начинающаяся с `eyJ...`)

## Шаг 4: Настройка переменных окружения

1. Создайте файл `.env` в корне проекта (скопируйте из `.env.example`)
2. Заполните переменные:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Шаг 5: Настройка аутентификации в Supabase

### Включение провайдеров OAuth (Google, Apple)

1. Перейдите в **Authentication** → **Providers**
2. Включите нужные провайдеры:
   - **Google**: Включите и настройте OAuth credentials
   - **Apple**: Включите и настройте OAuth credentials

### Настройка редиректов

1. Перейдите в **Authentication** → **URL Configuration**
2. Добавьте в **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:5173/auth/callback` (если используете другой порт)

## Шаг 6: Запуск приложения

```bash
npm run dev
```

## Проверка работы

1. Откройте приложение в браузере
2. Перейдите на экран входа
3. Попробуйте войти через email/пароль или через OAuth провайдеры

## Дополнительная информация

- Документация Supabase: [https://supabase.com/docs](https://supabase.com/docs)
- Документация по аутентификации: [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)

