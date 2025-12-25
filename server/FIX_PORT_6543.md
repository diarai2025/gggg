# Исправление ошибки подключения на порту 6543

## Проблема
Ошибка: `Can't reach database server at db.hlqlqfeaylfqojypnjcb.supabase.co:6543`

Это означает, что Connection Pooling (порт 6543) недоступен для вашего проекта.

## Решение: Используйте прямой порт 5432

### Шаг 1: Вернитесь к прямому подключению

В Vercel Environment Variables обновите `DATABASE_URL`:

**Используйте:**
```
postgresql://postgres:yMThHt0YV1bXeoz6@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres
```

**НЕ используйте порт 6543** - он недоступен для вашего проекта.

### Шаг 2: Отключите Network Restrictions в Supabase

1. Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database
2. Найдите раздел **"Network Restrictions"** или **"IP Allowlist"**
3. Убедитесь, что ограничения **отключены** или список разрешенных IP **пустой**
4. Если есть включенные ограничения - отключите их

### Шаг 3: Обновите DATABASE_URL в Vercel

1. Откройте: https://vercel.com/diarai2025/server
2. Settings → Environment Variables
3. Найдите `DATABASE_URL`
4. Убедитесь, что используется порт **5432** (не 6543)
5. URL должен быть:
   ```
   postgresql://postgres:yMThHt0YV1bXeoz6@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres
   ```
6. Сохраните

### Шаг 4: Пересоберите проект

1. Deployments → последний деплой → Redeploy
2. Проверьте логи - ошибка должна исчезнуть

## Почему порт 6543 не работает?

Connection Pooling (порт 6543) может быть:
- Не включен для вашего проекта
- Недоступен на вашем тарифном плане Supabase
- Требует дополнительной настройки

Прямое подключение (порт 5432) должно работать, если:
- Network Restrictions отключены
- Пароль правильный
- База данных доступна

## Проверка

После обновления проверьте логи:
- ✅ Должно быть: `✅ Подключение к базе данных установлено`
- ❌ Не должно быть: `Can't reach database server`

