#!/bin/bash

# Скрипт для обновления Prisma Client
# Использование: ./update-prisma.sh

echo "🔄 Обновление Prisma Client..."
cd "$(dirname "$0")"

# Проверяем наличие node_modules
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules не найден. Запустите: npm install"
    exit 1
fi

# Обновляем Prisma Client
if [ -f "node_modules/.bin/prisma" ]; then
    echo "📦 Генерация Prisma Client..."
    ./node_modules/.bin/prisma generate
    if [ $? -eq 0 ]; then
        echo "✅ Prisma Client успешно обновлен!"
        echo ""
        echo "⚠️  Не забудьте перезапустить сервер:"
        echo "   npm run dev"
    else
        echo "❌ Ошибка при обновлении Prisma Client"
        exit 1
    fi
else
    echo "❌ Prisma CLI не найден в node_modules"
    exit 1
fi


