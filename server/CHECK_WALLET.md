# Проверка и исправление ошибки кошелька

## Быстрая диагностика

Откройте терминал в директории `server` и выполните:

```bash
# 1. Проверьте, что Prisma Client обновлен
npm run prisma:generate

# 2. Проверьте, что модель Wallet доступна
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); console.log('Модели Prisma:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));"
```

Если в списке моделей нет `wallet`, значит Prisma Client не обновлен.

## Исправление

### Вариант 1: Через npm (рекомендуется)
```bash
cd server
npm run prisma:generate
npm run dev
```

### Вариант 2: Напрямую через Prisma
```bash
cd server
./node_modules/.bin/prisma generate
npm run dev
```

### Вариант 3: Если npm не работает
```bash
cd server
node_modules/.bin/prisma generate
npm run dev
```

## Проверка после исправления

После выполнения команд:
1. Перезапустите сервер (если он был запущен)
2. Откройте приложение в браузере
3. Проверьте консоль браузера - должны появиться детали ошибки (если ошибка все еще есть)
4. Проверьте логи сервера - должны появиться сообщения `[getWallet] ...`

## Если ошибка сохраняется

Проверьте логи сервера. Должны появиться:
- `[getWallet] Запрос на получение кошелька для пользователя: ...`
- `[getWallet] Пользователь найден, ID: ...`
- Или детали ошибки, если что-то не так

Если видите ошибку типа "Unknown model 'Wallet'" или "prisma.wallet is not a function", значит Prisma Client точно не обновлен.


