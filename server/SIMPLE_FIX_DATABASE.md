# Простое решение проблемы подключения к базе данных

## Проблема
Ошибка подключения к базе данных на Vercel, даже после настройки `DATABASE_URL`.

## Простое решение

### Шаг 1: Обновите DATABASE_URL в Vercel

Измените порт с `5432` на `6543` и добавьте параметры:

**Текущий URL:**
```
postgresql://postgres:yMThHt0YV1bXeoz6@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres
```

**Новый URL (для Vercel):**
```
postgresql://postgres:yMThHt0YV1bXeoz6@db.hlqlqfeaylfqojypnjcb.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

**Что изменилось:**
- Порт: `5432` → `6543`
- Добавлено: `?pgbouncer=true&connection_limit=1`

### Шаг 2: Обновите в Vercel

1. Откройте: https://vercel.com/diarai2025/server
2. Settings → Environment Variables
3. Найдите `DATABASE_URL`
4. Замените значение на новый URL (с портом 6543)
5. Сохраните

### Шаг 3: Пересоберите проект

1. Deployments → последний деплой → Redeploy
2. Или сделайте новый commit и push

### Шаг 4: Проверьте логи

После пересборки проверьте логи:
- Должно быть: `✅ Подключение к базе данных установлено`
- Не должно быть: `❌ Ошибка подключения к базе данных`

## Альтернатива: Если порт 6543 не работает

Попробуйте использовать прямой URL, но убедитесь, что:
1. Network Restrictions отключены в Supabase
2. Пароль правильный
3. URL скопирован полностью (без пробелов)

## Почему это работает

- Порт `6543` - это Connection Pooling порт Supabase
- `pgbouncer=true` - включает режим connection pooling
- `connection_limit=1` - важно для serverless функций (Vercel)

Код автоматически преобразует URL, но лучше использовать правильный URL сразу.

