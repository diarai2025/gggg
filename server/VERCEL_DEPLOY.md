# Деплой сервера на Vercel

## Быстрый старт

### 1. Установка Vercel CLI (если еще не установлен)

```bash
npm i -g vercel
```

### 2. Логин в Vercel

```bash
vercel login
```

### 3. Деплой из папки server

```bash
cd server
vercel
```

При первом деплое Vercel задаст вопросы:
- **Set up and deploy?** → Yes
- **Which scope?** → Выберите ваш аккаунт
- **Link to existing project?** → No (для первого раза)
- **Project name?** → diarai-server (или любое другое имя)
- **Directory?** → ./ (текущая директория)
- **Override settings?** → No

### 4. Настройка переменных окружения

После первого деплоя нужно добавить переменные окружения в Vercel:

```bash
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add PORT
```

Или через веб-интерфейс Vercel:
1. Откройте проект на [vercel.com](https://vercel.com)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте переменные:
   - `DATABASE_URL` - строка подключения к Supabase PostgreSQL
   - `OPENAI_API_KEY` - ключ OpenAI API (опционально)
   - `PORT` - порт (обычно не нужен, Vercel автоматически)
   - `NODE_ENV` - production

### 5. Повторный деплой после изменения переменных

```bash
vercel --prod
```

## Структура файлов для Vercel

- `api/index.ts` - точка входа для serverless функции
- `vercel.json` - конфигурация Vercel
- `package.json` - зависимости и скрипты

## Важные замечания

1. **Prisma**: Vercel автоматически запустит `prisma generate` во время сборки благодаря скрипту `vercel-build`

2. **Переменные окружения**: Все секретные данные должны быть добавлены через Vercel Dashboard или CLI

3. **База данных**: Убедитесь, что `DATABASE_URL` указывает на вашу Supabase базу данных

4. **Таймауты**: Vercel имеет ограничения на время выполнения функций:
   - Hobby план: 10 секунд
   - Pro план: 60 секунд
   - Enterprise: до 900 секунд

5. **Логи**: Просматривайте логи в Vercel Dashboard → **Deployments** → выберите деплой → **Functions** → **View Function Logs**

## Проверка деплоя

После успешного деплоя проверьте:

```bash
# Получить URL деплоя
vercel ls

# Проверить health endpoint
curl https://your-project.vercel.app/health
```

## Обновление деплоя

После изменений в коде:

```bash
cd server
vercel --prod
```

## Альтернатива: Деплой через GitHub

1. Подключите репозиторий GitHub к Vercel
2. В настройках проекта укажите:
   - **Root Directory**: `server`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: (оставьте пустым)
3. Добавьте переменные окружения в настройках проекта
4. Vercel будет автоматически деплоить при каждом push в main ветку

