# ⚡ Быстрая настройка Supabase

## Ваш проект Supabase:
- **URL:** https://hlqlqfeaylfqojypnjcb.supabase.co
- **Project Ref:** `hlqlqfeaylfqojypnjcb`

## 🎯 Что нужно сделать:

### 1. Получить Connection String из Supabase Dashboard

1. Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database
2. Прокрутите до раздела **"Connection string"**
3. Выберите вкладку **"URI"**
4. Скопируйте строку (она выглядит так):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres
   ```
5. **Замените `[YOUR-PASSWORD]`** на пароль базы данных (который вы указали при создании проекта)

### 2. Создать файл `.env`

Создайте файл `server/.env` и вставьте:

```env
DATABASE_URL="postgresql://postgres:ВАШ_ПАРОЛЬ@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres"
SUPABASE_URL="https://hlqlqfeaylfqojypnjcb.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhscWxxZmVheWxmcW9qeXBuamNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NzM4MDYsImV4cCI6MjA4MTQ0OTgwNn0.jPSsDIW3FSFkcjQ1yy2X7azLCoWD5LUJIheIFHwlRDs"
PORT=5000
JWT_SECRET=diar-super-secret-jwt-key-2024
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Выполнить команды:

```bash
cd server
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## ✅ Готово!

После этого ваше приложение будет подключено к Supabase.

## 🔑 Если забыли пароль БД:

1. Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database
2. Найдите раздел **"Database password"**
3. Нажмите **"Reset database password"**
4. Сохраните новый пароль и обновите `DATABASE_URL` в `.env`


