# Настройка переменных окружения

## Frontend (.env в корне проекта)

Создайте файл `.env` в корневой директории проекта со следующим содержимым:

```env
# URL бэкенд сервера
VITE_API_URL=http://localhost:3001

# Supabase настройки
# Получите из Supabase Dashboard: Settings → API
VITE_SUPABASE_URL=https://[PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Как получить Supabase credentials:**
1. Откройте ваш проект на [app.supabase.com](https://app.supabase.com)
2. Перейдите в **Settings** → **API**
3. Скопируйте:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## Backend (.env в папке server/)

Создайте файл `server/.env` со следующим содержимым:

```env
# Database
# Получите из Supabase Dashboard: Settings → Database → Connection string → URI
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Server
PORT=3001
NODE_ENV=development

# Supabase (опционально, для полной аутентификации в продакшене)
# SUPABASE_URL="https://[PROJECT-REF].supabase.co"
# SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**Как получить DATABASE_URL:**
1. Откройте ваш проект на [app.supabase.com](https://app.supabase.com)
2. Перейдите в **Settings** → **Database**
3. Найдите **Connection string** → **URI**
4. Замените `[YOUR-PASSWORD]` на ваш пароль базы данных

## Важно

- Не коммитьте файлы `.env` в git (они уже в .gitignore)
- Используйте `.env.example` как шаблон для других разработчиков
- В продакшене используйте переменные окружения вашего хостинга

