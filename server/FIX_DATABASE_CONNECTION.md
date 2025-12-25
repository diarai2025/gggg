# Исправление подключения к базе данных на Vercel

## Проблема
Ошибка подключения к базе данных на Vercel serverless функциях, даже если `DATABASE_URL` настроен правильно.

## Причина
Vercel serverless функции требуют использования **Connection Pooling** вместо прямого подключения к базе данных.

## Решение

### Вариант 1: Использовать Connection Pooling URL (рекомендуется)

1. Откройте Supabase Dashboard: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database
2. Найдите раздел **"Connection Pooling"**
3. Скопируйте строку подключения из раздела **"Connection string"** → **"URI"**
4. Она будет выглядеть так:
   ```
   postgresql://postgres.hlqlqfeaylfqojypnjcb:yMThHt0YV1bXeoz6@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
   Или:
   ```
   postgresql://postgres:yMThHt0YV1bXeoz6@db.hlqlqfeaylfqojypnjcb.supabase.co:6543/postgres?pgbouncer=true
   ```

5. Обновите `DATABASE_URL` в Vercel:
   - Откройте проект на Vercel
   - Settings → Environment Variables
   - Найдите `DATABASE_URL`
   - Замените значение на Connection Pooling URL (с портом `6543` и параметром `?pgbouncer=true`)
   - Сохраните и пересоберите проект

### Вариант 2: Преобразовать существующий URL

Если у вас есть прямой URL:
```
postgresql://postgres:yMThHt0YV1bXeoz6@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres
```

Преобразуйте его в:
```
postgresql://postgres:yMThHt0YV1bXeoz6@db.hlqlqfeaylfqojypnjcb.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

**Изменения:**
- Порт: `5432` → `6543`
- Добавлен параметр: `?pgbouncer=true&connection_limit=1`

### Вариант 3: Отключить Network Restrictions

Если Connection Pooling не помогает:

1. Откройте Supabase Dashboard: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database
2. Найдите раздел **"Network Restrictions"** или **"Connection Pooling"**
3. Убедитесь, что ограничения по IP отключены
4. Если есть список разрешенных IP - удалите все записи

## Проверка

После обновления `DATABASE_URL`:

1. Пересоберите проект на Vercel (Redeploy)
2. Проверьте логи:
   - Должно быть: `✅ Подключение к базе данных установлено`
   - Не должно быть: `❌ Ошибка подключения к базе данных`
3. Проверьте работу API - ошибки 500 должны исчезнуть

## Важные замечания

- **Connection Pooling** обязателен для serverless функций (Vercel, AWS Lambda и т.д.)
- Прямое подключение (порт 5432) может работать локально, но не на Vercel
- Параметр `connection_limit=1` важен для serverless функций

## Текущий код

Код уже обновлен для автоматического преобразования URL в режиме production, но лучше использовать правильный Connection Pooling URL из Supabase Dashboard.

