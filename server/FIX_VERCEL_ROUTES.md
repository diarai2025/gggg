# Исправление проблемы с маршрутами на Vercel

## Проблема
После деплоя сервера на Vercel:
- На странице сервера показывается "Маршрут не найден"
- Фронтенд не может подключиться к серверу

## Решение

### 1. Проверка сервера

После деплоя сервера на Vercel, вы получите URL вида:
```
https://your-server-name.vercel.app
```

Откройте этот URL в браузере. Вы должны увидеть:
```json
{
  "status": "ok",
  "message": "DIAR AI Server API",
  "timestamp": "...",
  "endpoints": {
    "health": "/health",
    "api": "/api/*"
  }
}
```

Если видите это - сервер работает правильно!

### 2. Настройка фронтенда

Фронтенд должен знать URL вашего сервера на Vercel.

#### Вариант A: Через Vercel Dashboard (рекомендуется)

1. Откройте проект фронтенда на Vercel: https://vercel.com/diarai2025/gggg
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте переменную:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-server-name.vercel.app` (замените на реальный URL вашего сервера)
   - **Environment**: Production, Preview, Development
4. Сохраните и **пересоберите проект**

#### Вариант B: Через Vercel CLI

```bash
cd /Users/janjan/Desktop/diarai
vercel env add VITE_API_URL
# Введите URL вашего сервера: https://your-server-name.vercel.app
# Выберите окружения: Production, Preview, Development
```

### 3. Проверка работы

После настройки `VITE_API_URL`:

1. Пересоберите фронтенд на Vercel
2. Откройте фронтенд в браузере
3. Откройте консоль разработчика (F12)
4. Проверьте, что запросы идут на правильный URL сервера

### 4. Отладка

Если проблемы остаются:

1. **Проверьте логи сервера на Vercel:**
   - Откройте проект сервера на Vercel
   - Перейдите в **Deployments** → выберите последний деплой → **Functions** → `api/index.ts` → **View Function Logs**

2. **Проверьте логи фронтенда:**
   - Откройте консоль браузера (F12)
   - Проверьте ошибки в Network tab

3. **Проверьте переменные окружения:**
   - Убедитесь, что `VITE_API_URL` установлен правильно
   - Убедитесь, что URL начинается с `https://` (не `http://`)

### 5. Тестирование API

Проверьте, что API работает:

```bash
# Проверка health endpoint
curl https://your-server-name.vercel.app/health

# Должен вернуть:
# {"status":"ok","timestamp":"..."}
```

## Важные замечания

1. **CORS**: Сервер уже настроен с `cors()`, поэтому запросы с фронтенда должны работать
2. **Аутентификация**: Все API маршруты требуют JWT токен из Supabase
3. **Переменные окружения сервера**: Убедитесь, что все переменные окружения сервера (DATABASE_URL, SUPABASE_URL, и т.д.) добавлены в Vercel

## Структура URL

- **Сервер**: `https://your-server-name.vercel.app`
- **Health check**: `https://your-server-name.vercel.app/health`
- **API endpoints**: `https://your-server-name.vercel.app/api/*`

Примеры:
- `https://your-server-name.vercel.app/api/user/profile`
- `https://your-server-name.vercel.app/api/campaigns`
- `https://your-server-name.vercel.app/api/leads`

