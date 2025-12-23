# 🔧 Исправление подключения к Supabase

## Текущая проблема:
Ошибка: `Can't reach database server`

## ✅ Решение:

### 1. Проверьте статус проекта Supabase

Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb

Убедитесь, что проект **активен** (не приостановлен).

### 2. Получите точный Connection String

1. Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database
2. Прокрутите до **"Connection string"**
3. Выберите вкладку **"URI"** (не Transaction или Session)
4. Скопируйте **полную строку** - она должна выглядеть так:

```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xxxxx.pooler.supabase.com:6543/postgres
```

Или:

```
postgresql://postgres:[YOUR-PASSWORD]@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres
```

### 3. Обновите .env файл

Замените строку `DATABASE_URL` в `server/.env` на **точную строку** из Supabase Dashboard.

### 4. Альтернатива: Используйте Connection Pooler

Если прямое подключение не работает, попробуйте pooler:

1. В Supabase Dashboard: Settings → Database → Connection string
2. Выберите **"Connection pooling"** → **"Session mode"**
3. Скопируйте строку и используйте её в `.env`

### 5. Проверьте пароль

Если забыли пароль:
- Settings → Database → Database password → **Reset database password**

## 🔍 Текущий DATABASE_URL в .env:

```
DATABASE_URL="postgresql://postgres:ovnrakbliznets@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres"
```

## ⚠️ Возможные проблемы:

1. **Проект приостановлен** - активируйте в Dashboard
2. **Неправильный формат** - используйте точную строку из Dashboard
3. **Пароль неверный** - сбросьте и используйте новый
4. **Регион не совпадает** - проверьте регион проекта

## 📝 После исправления:

```bash
cd server
source ~/.nvm/nvm.sh
npm run db:check
```

Если подключение успешно, выполните:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```


