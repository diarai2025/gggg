# Быстрый старт с Supabase

## 1. Установите зависимости

```bash
npm install
```

## 2. Создайте файл .env

Создайте файл `.env` в корне проекта со следующим содержимым:

```env
VITE_SUPABASE_URL=ваш_url_проекта
VITE_SUPABASE_ANON_KEY=ваш_anon_ключ
```

**Где найти эти значения:**
- Откройте ваш проект на [app.supabase.com](https://app.supabase.com)
- Перейдите в **Settings** → **API**
- Скопируйте **Project URL** и **anon/public key**

## 3. Запустите приложение

```bash
npm run dev
```

## Что было настроено:

✅ Клиент Supabase (`src/lib/supabase.ts`)
✅ Контекст аутентификации (`src/contexts/AuthContext.tsx`)
✅ Интеграция с компонентом Login
✅ Автоматическая проверка сессии при загрузке
✅ Поддержка входа через email/пароль
✅ Поддержка OAuth (Google, Apple)

## Важно:

- Для работы OAuth провайдеров нужно настроить их в панели Supabase
- Добавьте redirect URL: `http://localhost:3000/auth/callback` в настройках Authentication

