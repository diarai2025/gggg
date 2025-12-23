# 🔍 Проверка подключения к Supabase

## Текущая конфигурация:

✅ **Пароль установлен:** `ovnrakbliznets`  
✅ **DATABASE_URL:** `postgresql://postgres:ovnrakbliznets@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres`

## ❌ Проблема: Подключение не работает

Ошибка: `Can't reach database server`

## 🔧 Возможные решения:

### 1. Проверьте статус проекта Supabase

Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb

**Убедитесь, что:**
- ✅ Проект **активен** (не приостановлен)
- ✅ Проект не в режиме "Paused" или "Inactive"
- ✅ Если проект приостановлен - нажмите "Resume" или "Restore"

### 2. Получите точный Connection String из Dashboard

1. Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database
2. Прокрутите до раздела **"Connection string"**
3. Выберите вкладку **"URI"**
4. Скопируйте **полную строку** (она может отличаться от текущей)
5. Замените `DATABASE_URL` в `server/.env`

### 3. Попробуйте Connection Pooler

Если прямое подключение не работает:

1. В Dashboard: Settings → Database → Connection string
2. Выберите **"Connection pooling"** → **"Session mode"**
3. Скопируйте строку (формат будет другой)
4. Замените `DATABASE_URL` в `.env`

### 4. Проверьте регион проекта

Connection string может содержать регион (например, `us-west-1`, `eu-west-1`).  
Убедитесь, что используете правильный регион для вашего проекта.

## 📝 Текущий .env файл:

```env
DATABASE_URL="postgresql://postgres:ovnrakbliznets@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres"
SUPABASE_URL="https://hlqlqfeaylfqojypnjcb.supabase.co"
NEXT_PUBLIC_SUPABASE_URL="https://hlqlqfeaylfqojypnjcb.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_7WTi7zRrxzYR4Y_JFh3kJQ_VGgQob4k"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="sb_publishable_7WTi7zRrxzYR4Y_JFh3kJQ_VGgQob4k"
```

## ✅ После исправления:

```bash
cd server
source ~/.nvm/nvm.sh
npm run db:check
```

Если подключение успешно:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## 🆘 Если ничего не помогает:

1. Проверьте, что проект Supabase активен
2. Попробуйте сбросить пароль БД в Dashboard
3. Используйте точный connection string из Dashboard (не создавайте вручную)
4. Проверьте, нет ли проблем с сетью/firewall


