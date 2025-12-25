# Как проверить логи сервера на Vercel

## Проблема: Ошибки 500 (Internal Server Error)

Если вы видите ошибки 500 при запросах к API, нужно проверить логи сервера на Vercel.

## Как посмотреть логи:

### 1. Через Vercel Dashboard

1. Откройте проект сервера на Vercel: https://vercel.com/diarai2025/server
2. Перейдите в раздел **Deployments**
3. Выберите последний деплой
4. Нажмите на **Functions** → `api/index.ts`
5. Нажмите **View Function Logs**

### 2. Через Vercel CLI

```bash
cd /Users/janjan/Desktop/diarai/server
vercel logs --follow
```

## Что искать в логах:

### Ошибки подключения к базе данных:

```
❌ Ошибка подключения к базе данных
❌ DATABASE_URL не установлен
P1001 - Can't reach database server
P1000 - Authentication failed
```

**Решение:**
- Проверьте, что `DATABASE_URL` добавлен в Vercel Environment Variables
- Убедитесь, что пароль в `DATABASE_URL` правильный
- Проверьте, что Network Restrictions отключены в Supabase

### Ошибки Prisma:

```
⚠️  Модель Wallet не найдена в Prisma Client
Unknown model 'wallet'
```

**Решение:**
- Prisma Client не сгенерирован
- Проверьте, что `vercel-build` команда включает `prisma generate`
- Убедитесь, что `package.json` содержит скрипт `vercel-build`

### Ошибки аутентификации:

```
Ошибка конфигурации сервера: настройте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY
```

**Решение:**
- Добавьте `SUPABASE_URL` в Vercel Environment Variables
- Добавьте `SUPABASE_SERVICE_ROLE_KEY` в Vercel Environment Variables

## Быстрая проверка переменных окружения:

1. Откройте проект на Vercel
2. Settings → Environment Variables
3. Убедитесь, что есть:
   - ✅ `DATABASE_URL`
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ `OPENAI_API_KEY` (опционально)

## После исправления:

1. Пересоберите проект (Redeploy)
2. Проверьте логи снова
3. Проверьте работу API

