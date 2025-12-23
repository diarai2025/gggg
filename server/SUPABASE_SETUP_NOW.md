# 🚀 Быстрая настройка Supabase для DIAR

## Ваши данные Supabase:

- **Project URL:** `https://hlqlqfeaylfqojypnjcb.supabase.co`
- **Project Ref:** `hlqlqfeaylfqojypnjcb`
- **API Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (сохранен)

## ⚠️ Важно: Нужен пароль базы данных!

API ключ - это для REST API, но для Prisma нужен **connection string** базы данных, который требует пароль БД.

## Шаг 1: Получить Connection String

1. Откройте https://supabase.com/dashboard
2. Выберите ваш проект (hlqlqfeaylfqojypnjcb)
3. Перейдите в **Settings** → **Database**
4. Прокрутите до раздела **Connection string**
5. Выберите вкладку **URI**
6. Скопируйте строку подключения

Она будет выглядеть так:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Или более простая версия:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres
```

⚠️ **Замените `[YOUR-PASSWORD]` на пароль, который вы указали при создании проекта!**

Если вы забыли пароль:
- Перейдите в **Settings** → **Database** → **Database password**
- Нажмите **Reset database password** (осторожно - это может прервать активные подключения)

## Шаг 2: Создать/обновить .env файл

Создайте файл `server/.env` со следующим содержимым:

```env
# Supabase Database Connection
DATABASE_URL="postgresql://postgres:ВАШ_ПАРОЛЬ_БД@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres"

# Supabase API (для будущего использования)
SUPABASE_URL="https://hlqlqfeaylfqojypnjcb.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhscWxxZmVheWxmcW9qeXBuamNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NzM4MDYsImV4cCI6MjA4MTQ0OTgwNn0.jPSsDIW3FSFkcjQ1yy2X7azLCoWD5LUJIheIFHwlRDs"

# Server Configuration
PORT=5000
JWT_SECRET=diar-super-secret-jwt-key-2024-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Пример реального DATABASE_URL (замените YOUR_PASSWORD):**
```env
DATABASE_URL="postgresql://postgres:MySecurePassword123@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres"
```

## Шаг 3: Установить зависимости и настроить Prisma

```bash
cd server
npm install
```

## Шаг 4: Генерация Prisma Client

```bash
npm run db:generate
```

## Шаг 5: Создание таблиц в базе данных

```bash
npm run db:migrate
```

Эта команда создаст все таблицы в Supabase на основе вашей Prisma схемы.

## Шаг 6: Заполнение тестовыми данными

```bash
npm run db:seed
```

Создаст демо пользователя:
- **Email:** `demo@example.com`
- **Пароль:** `demo123`

## Шаг 7: Проверка подключения

```bash
npm run db:check
```

## Шаг 8: Запуск сервера

```bash
npm run dev
```

Сервер должен запуститься на `http://localhost:5000`

## ✅ Проверка работы

1. Проверьте health endpoint:
   ```bash
   curl http://localhost:5000/health
   ```

2. Откройте Prisma Studio для просмотра данных:
   ```bash
   npm run db:studio
   ```
   Откроется на http://localhost:5555

## 🔍 Альтернативный способ: Использование Connection Pooler

Если у вас проблемы с подключением, попробуйте использовать connection pooler:

```env
DATABASE_URL="postgresql://postgres.hlqlqfeaylfqojypnjcb:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

Где `[REGION]` - это регион вашего проекта (например, `us-west-1`, `eu-west-1`).

## 🆘 Решение проблем

### Ошибка: "Can't reach database server"
- Проверьте, что `DATABASE_URL` правильный
- Убедитесь, что пароль в URL правильный (без квадратных скобок)
- Проверьте, что проект Supabase активен

### Ошибка: "Authentication failed"
- Проверьте пароль в `DATABASE_URL`
- Убедитесь, что вы заменили `[YOUR-PASSWORD]` на реальный пароль

### Ошибка миграции
```bash
# Сбросить и пересоздать базу (осторожно - удалит все данные!)
npx prisma migrate reset

# Или применить миграции заново
npx prisma migrate deploy
```

## 📝 Примечания

- API ключ сохранен для будущего использования (например, для Supabase REST API или клиента)
- Connection string должен содержать реальный пароль базы данных
- Не коммитьте `.env` файл в git (он уже в .gitignore)


