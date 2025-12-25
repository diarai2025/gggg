# Исправление ошибки "Токен доступа не найден в сессии Supabase"

## Проблема
Ошибка: `Токен доступа не найден в сессии Supabase`

Это означает, что фронтенд не может получить токен из Supabase сессии.

## Решение

### 1. Проверьте переменные окружения Supabase на фронтенде

Убедитесь, что в Vercel (для фронтенда) добавлены переменные:

1. Откройте проект фронтенда на Vercel: https://vercel.com/diarai2025/gggg
2. Settings → Environment Variables
3. Проверьте наличие:

#### VITE_SUPABASE_URL
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://hlqlqfeaylfqojypnjcb.supabase.co`
- **Где найти:** Supabase Dashboard → Settings → API → Project URL

#### VITE_SUPABASE_ANON_KEY
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (ваш anon key)
- **Где найти:** Supabase Dashboard → Settings → API → anon public key

### 2. Если переменные отсутствуют - добавьте их

1. Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/api
2. Найдите:
   - **Project URL** → скопируйте для `VITE_SUPABASE_URL`
   - **anon public** key → скопируйте для `VITE_SUPABASE_ANON_KEY`
3. Добавьте в Vercel (фронтенд проект):
   - Settings → Environment Variables
   - Добавьте обе переменные
   - Environment: Production, Preview, Development
4. Сохраните и пересоберите проект

### 3. Проверьте, что пользователь авторизован

Если пользователь не авторизован:
1. Войдите в систему через форму входа
2. Убедитесь, что сессия Supabase создана
3. Проверьте в консоли браузера - не должно быть ошибок Supabase

### 4. Перезагрузите страницу

После добавления переменных окружения:
1. Пересоберите фронтенд на Vercel
2. Очистите кеш браузера (Ctrl+Shift+R или Cmd+Shift+R)
3. Перезагрузите страницу
4. Войдите в систему заново

## Проверка

После настройки переменных окружения:

1. Откройте консоль браузера (F12)
2. Проверьте, что нет ошибок:
   - ❌ Не должно быть: `Supabase URL или ключ не настроены`
   - ❌ Не должно быть: `Токен доступа не найден в сессии Supabase`
3. Проверьте Network tab:
   - Запросы к API должны содержать заголовок `Authorization: Bearer ...`
   - Запросы должны возвращать 200 OK (не 401)

## Важно

- `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` должны быть добавлены в **фронтенд проект** на Vercel
- Это **разные** переменные от `SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` в сервере
- После добавления переменных **обязательно пересоберите** проект

## Структура переменных

### Фронтенд (Vercel проект: gggg):
- `VITE_SUPABASE_URL` - URL проекта Supabase
- `VITE_SUPABASE_ANON_KEY` - anon public key
- `VITE_API_URL` - URL сервера (https://server-wgba.vercel.app)

### Сервер (Vercel проект: server):
- `DATABASE_URL` - строка подключения к БД
- `SUPABASE_URL` - URL проекта Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - service role key (секретный)

