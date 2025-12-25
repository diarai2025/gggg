# Исправление подключения к базе данных на Vercel

## Проблема
`Can't reach database server at db.hlqlqfeaylfqojypnjcb.supabase.co:5432`

Это означает, что Vercel не может подключиться к Supabase из-за Network Restrictions.

## Решение

### Вариант 1: Отключить Network Restrictions (рекомендуется)

1. Откройте Supabase Dashboard:
   - https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database

2. Найдите раздел **"Network Restrictions"** или **"IP Allowlist"**:
   - Прокрутите вниз до раздела "Network Restrictions"
   - Убедитесь, что переключатель **выключен** (OFF)
   - Если есть список разрешенных IP - **удалите все записи** или оставьте пустым

3. Сохраните изменения

4. Пересоберите проект на Vercel

### Вариант 2: Добавить параметры SSL

Если Network Restrictions отключены, но проблема остается, добавьте параметры SSL в URL:

**Текущий URL:**
```
postgresql://postgres:yMThHt0YV1bXeoz6@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres
```

**С параметрами SSL:**
```
postgresql://postgres:yMThHt0YV1bXeoz6@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres?sslmode=require
```

Обновите `DATABASE_URL` в Vercel с параметром `?sslmode=require`

### Вариант 3: Использовать Connection String из Supabase Dashboard

1. Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database
2. Найдите раздел **"Connection string"** или **"Connection parameters"**
3. Скопируйте строку подключения (если она там есть)
4. Используйте её в Vercel

## Проверка Network Restrictions

### Как проверить, включены ли Network Restrictions:

1. Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database
2. Прокрутите до раздела **"Network Restrictions"** или **"IP Allowlist"**
3. Если видите:
   - Переключатель "Restrict database access" - должен быть **выключен**
   - Список разрешенных IP - должен быть **пустым**

### Если Network Restrictions включены:

1. Выключите переключатель "Restrict database access"
2. Удалите все IP из списка разрешенных
3. Сохраните изменения
4. Пересоберите проект на Vercel

## Альтернативное решение: Использовать Supabase REST API

Если прямое подключение не работает, можно использовать Supabase REST API вместо Prisma для некоторых операций. Но это требует значительных изменений в коде.

## Проверка после исправления

1. Пересоберите проект на Vercel
2. Проверьте логи:
   - ✅ Должно быть: `✅ Подключение к базе данных установлено`
   - ❌ Не должно быть: `Can't reach database server`

## Важно

- Network Restrictions **должны быть отключены** для работы с Vercel
- Vercel использует динамические IP, поэтому нельзя добавить их в whitelist
- Если Network Restrictions включены, подключение с Vercel будет блокироваться

