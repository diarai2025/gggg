# 🔧 Исправление ошибки "Unknown host"

## ❌ Проблема:
Хост `db.hlqlqfeaylfqojypnjcb.supabase.co` не резолвится (Unknown host)

## 🔍 Причины:
1. **Проект Supabase неактивен/приостановлен** (наиболее вероятно)
2. Неправильный формат connection string
3. Проект был удален или перемещен

## ✅ Решение:

### 1. Проверьте статус проекта

Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb

**Убедитесь, что:**
- ✅ Проект **активен** (не приостановлен)
- ✅ Проект не в режиме "Paused"
- ✅ Если проект приостановлен - нажмите **"Resume"** или **"Restore"**

### 2. Получите правильный Connection String

1. Откройте: https://supabase.com/dashboard/project/hlqlqfeaylfqojypnjcb/settings/database
2. Прокрутите до **"Connection string"**
3. Выберите вкладку **"URI"** или **"Connection pooling" → "Session mode"**
4. Скопируйте **полную строку** (она может содержать другой хост!)
5. Замените `DATABASE_URL` в `server/.env`

### 3. Возможные форматы Connection String:

**Формат 1 (Direct):**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

**Формат 2 (Connection Pooler):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Где:**
- `[PROJECT-REF]` = `hlqlqfeaylfqojypnjcb`
- `[PASSWORD]` = `ovnrakbliznets`
- `[REGION]` = регион вашего проекта (us-west-1, eu-west-1, и т.д.)

### 4. Если проект приостановлен:

1. В Dashboard нажмите **"Resume project"** или **"Restore"**
2. Подождите 1-2 минуты, пока проект активируется
3. Затем попробуйте подключиться снова

## 📝 Текущий DATABASE_URL:

```env
DATABASE_URL="postgresql://postgres:ovnrakbliznets@db.hlqlqfeaylfqojypnjcb.supabase.co:5432/postgres?sslmode=require"
```

## ⚠️ Важно:

Если хост не резолвится, это означает, что:
- Проект неактивен (наиболее вероятно)
- Или нужно использовать другой формат connection string из Dashboard

**Скопируйте точный connection string из Supabase Dashboard!**


