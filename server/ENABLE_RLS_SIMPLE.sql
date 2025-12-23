-- УПРОЩЕННАЯ ВЕРСИЯ: RLS без Supabase Auth
-- Используйте эту версию, если вы используете свою систему аутентификации (JWT)
-- В этом случае RLS будет работать только для прямых SQL запросов через Supabase

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
-- БАЗОВЫЕ ПОЛИТИКИ (для защиты от прямого доступа через Supabase API)
-- ============================================

-- Политики для users: разрешаем все операции (контроль через ваше приложение)
CREATE POLICY "Allow all operations on users"
ON "users"
FOR ALL
USING (true)
WITH CHECK (true);

-- Политики для clients: разрешаем все операции
CREATE POLICY "Allow all operations on clients"
ON "clients"
FOR ALL
USING (true)
WITH CHECK (true);

-- Политики для messages: разрешаем все операции
CREATE POLICY "Allow all operations on messages"
ON "messages"
FOR ALL
USING (true)
WITH CHECK (true);

-- Политики для campaigns: разрешаем все операции
CREATE POLICY "Allow all operations on campaigns"
ON "campaigns"
FOR ALL
USING (true)
WITH CHECK (true);

-- Политики для integrations: разрешаем все операции
CREATE POLICY "Allow all operations on integrations"
ON "integrations"
FOR ALL
USING (true)
WITH CHECK (true);

-- Политики для leads: разрешаем все операции
CREATE POLICY "Allow all operations on leads"
ON "leads"
FOR ALL
USING (true)
WITH CHECK (true);

-- Политики для deals: разрешаем все операции
CREATE POLICY "Allow all operations on deals"
ON "deals"
FOR ALL
USING (true)
WITH CHECK (true);

-- Политики для tasks: разрешаем все операции
CREATE POLICY "Allow all operations on tasks"
ON "tasks"
FOR ALL
USING (true)
WITH CHECK (true);

-- ⚠️ ВАЖНО: Эти политики разрешают все операции через Supabase API
-- Безопасность обеспечивается вашим backend приложением через JWT аутентификацию
-- Если вы планируете использовать Supabase Auth, используйте файл ENABLE_RLS.sql


