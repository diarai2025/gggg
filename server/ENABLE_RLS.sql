-- SQL скрипт для включения Row Level Security (RLS) в Supabase
-- Выполните этот скрипт в Supabase SQL Editor ПОСЛЕ создания таблиц

-- ============================================
-- ВАРИАНТ 1: RLS с использованием Supabase Auth
-- (Если вы используете Supabase Auth для аутентификации)
-- ============================================

-- Функция для получения user_id из Supabase Auth
-- Эта функция будет использоваться в политиках

-- Включаем RLS на всех таблицах
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "campaigns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "integrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "deals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ users
-- ============================================

-- Пользователи могут видеть только свой профиль
CREATE POLICY "Users can view own profile"
ON "users"
FOR SELECT
USING (auth.uid()::text = id::text);

-- Пользователи могут обновлять только свой профиль
CREATE POLICY "Users can update own profile"
ON "users"
FOR UPDATE
USING (auth.uid()::text = id::text);

-- Разрешаем создание новых пользователей (для регистрации)
CREATE POLICY "Allow insert for new users"
ON "users"
FOR INSERT
WITH CHECK (true);

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ clients
-- ============================================

-- Пользователи могут видеть только своих клиентов
CREATE POLICY "Users can view own clients"
ON "clients"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "clients"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут создавать клиентов для себя
CREATE POLICY "Users can create own clients"
ON "clients"
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "clients"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут обновлять только своих клиентов
CREATE POLICY "Users can update own clients"
ON "clients"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "clients"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут удалять только своих клиентов
CREATE POLICY "Users can delete own clients"
ON "clients"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "clients"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ messages
-- ============================================

-- Пользователи могут видеть сообщения своих клиентов
CREATE POLICY "Users can view messages of own clients"
ON "messages"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "clients"
    JOIN "users" ON "users"."id" = "clients"."userId"
    WHERE "clients"."id" = "messages"."clientId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут создавать сообщения для своих клиентов
CREATE POLICY "Users can create messages for own clients"
ON "messages"
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "clients"
    JOIN "users" ON "users"."id" = "clients"."userId"
    WHERE "clients"."id" = "messages"."clientId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут обновлять сообщения своих клиентов
CREATE POLICY "Users can update messages of own clients"
ON "messages"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "clients"
    JOIN "users" ON "users"."id" = "clients"."userId"
    WHERE "clients"."id" = "messages"."clientId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут удалять сообщения своих клиентов
CREATE POLICY "Users can delete messages of own clients"
ON "messages"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "clients"
    JOIN "users" ON "users"."id" = "clients"."userId"
    WHERE "clients"."id" = "messages"."clientId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ campaigns
-- ============================================

-- Пользователи могут видеть только свои кампании
CREATE POLICY "Users can view own campaigns"
ON "campaigns"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "campaigns"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут создавать кампании для себя
CREATE POLICY "Users can create own campaigns"
ON "campaigns"
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "campaigns"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут обновлять только свои кампании
CREATE POLICY "Users can update own campaigns"
ON "campaigns"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "campaigns"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут удалять только свои кампании
CREATE POLICY "Users can delete own campaigns"
ON "campaigns"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "campaigns"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ integrations
-- ============================================

-- Пользователи могут видеть только свои интеграции
CREATE POLICY "Users can view own integrations"
ON "integrations"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "integrations"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут создавать интеграции для себя
CREATE POLICY "Users can create own integrations"
ON "integrations"
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "integrations"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут обновлять только свои интеграции
CREATE POLICY "Users can update own integrations"
ON "integrations"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "integrations"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут удалять только свои интеграции
CREATE POLICY "Users can delete own integrations"
ON "integrations"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "integrations"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ leads
-- ============================================

-- Пользователи могут видеть только своих лидов
CREATE POLICY "Users can view own leads"
ON "leads"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "leads"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут создавать лидов для себя
CREATE POLICY "Users can create own leads"
ON "leads"
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "leads"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут обновлять только своих лидов
CREATE POLICY "Users can update own leads"
ON "leads"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "leads"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут удалять только своих лидов
CREATE POLICY "Users can delete own leads"
ON "leads"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "leads"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ deals
-- ============================================

-- Пользователи могут видеть только свои сделки
CREATE POLICY "Users can view own deals"
ON "deals"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "deals"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут создавать сделки для себя
CREATE POLICY "Users can create own deals"
ON "deals"
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "deals"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут обновлять только свои сделки
CREATE POLICY "Users can update own deals"
ON "deals"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "deals"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут удалять только свои сделки
CREATE POLICY "Users can delete own deals"
ON "deals"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "deals"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- ============================================
-- ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ tasks
-- ============================================

-- Пользователи могут видеть только свои задачи
CREATE POLICY "Users can view own tasks"
ON "tasks"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "tasks"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут создавать задачи для себя
CREATE POLICY "Users can create own tasks"
ON "tasks"
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "tasks"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут обновлять только свои задачи
CREATE POLICY "Users can update own tasks"
ON "tasks"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "tasks"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

-- Пользователи могут удалять только свои задачи
CREATE POLICY "Users can delete own tasks"
ON "tasks"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "users"
    WHERE "users"."id" = "tasks"."userId"
    AND "users"."id"::text = auth.uid()::text
  )
);

