# Настройка переменных окружения для сервера

## Быстрая настройка

### 1. Локальная разработка

```bash
cd server
cp .env.example .env
# Отредактируйте .env и заполните все значения
```

### 2. Vercel (Production)

Добавьте переменные окружения в Vercel Dashboard:

1. Откройте проект сервера на Vercel
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте следующие переменные:

#### Обязательные переменные:

| Переменная | Где найти |
|-----------|-----------|
| `DATABASE_URL` | Supabase Dashboard → Settings → Database → Connection string → URI |
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role key (secret) |

#### Опциональные переменные:

| Переменная | Где найти | Описание |
|-----------|-----------|----------|
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys | Для AI функций (опционально) |
| `NODE_ENV` | - | `production` для продакшена |
| `PORT` | - | Не используется на Vercel |

## Подробные инструкции

### DATABASE_URL

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Database**
4. Найдите раздел **Connection string**
5. Выберите **URI**
6. Скопируйте строку подключения
7. Замените `[YOUR-PASSWORD]` на ваш пароль базы данных

**Формат:**
```
postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

### SUPABASE_URL

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в **Settings** → **API**
4. Найдите раздел **Project URL**
5. Скопируйте URL

**Формат:**
```
https://YOUR_PROJECT_REF.supabase.co
```

### SUPABASE_SERVICE_ROLE_KEY

⚠️ **ВАЖНО:** Это секретный ключ с полными правами доступа! Никогда не коммитьте его в Git!

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в **Settings** → **API**
4. Найдите раздел **Project API keys**
5. Найдите ключ с типом **service_role** (secret)
6. Нажмите **Reveal** чтобы показать ключ
7. Скопируйте ключ

**Формат:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXJfcHJvamVjdF9yZWYiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.YOUR_KEY_HERE
```

### OPENAI_API_KEY (опционально)

1. Откройте [OpenAI Platform](https://platform.openai.com/api-keys)
2. Войдите в аккаунт
3. Нажмите **Create new secret key**
4. Скопируйте ключ (он показывается только один раз!)

**Формат:**
```
sk-proj-...
```

## Проверка настроек

После добавления переменных окружения:

1. **Локально:** Перезапустите сервер (`npm run dev`)
2. **Vercel:** Пересоберите проект (Redeploy)

## Безопасность

⚠️ **НИКОГДА не коммитьте:**
- `.env` файл
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `DATABASE_URL` с паролем

✅ **Безопасно коммитить:**
- `.env.example` (без реальных значений)
- `ENV_SETUP.md` (инструкции)

## Troubleshooting

### Ошибка: "Ошибка конфигурации сервера: настройте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY"

**Причина:** Переменные окружения не установлены или неверны.

**Решение:**
1. Проверьте, что переменные добавлены в Vercel
2. Убедитесь, что значения скопированы полностью (без пробелов)
3. Пересоберите проект на Vercel
4. Проверьте логи деплоя на наличие ошибок

### Ошибка подключения к базе данных

**Причина:** Неверный `DATABASE_URL` или пароль.

**Решение:**
1. Проверьте формат `DATABASE_URL`
2. Убедитесь, что пароль в URL правильный
3. Проверьте, что база данных доступна

### CORS ошибки

**Причина:** Неправильно настроен CORS на сервере.

**Решение:** Уже исправлено в `server/api/index.ts` - проверьте, что изменения задеплоены.

