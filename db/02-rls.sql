ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY user_can_view_own_data
ON users
FOR SELECT
TO app_user
USING (id = CAST(current_setting('app.current_user_id', TRUE) AS UUID));

CREATE POLICY user_can_see_all_users
ON users
FOR SELECT
TO auth_user
USING (true);

CREATE POLICY user_can_insert_own_data
ON users
FOR INSERT
TO auth_user
WITH CHECK(true);

-- Enable and enforce Row-Level Security (RLS) on the expenses table
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses FORCE ROW LEVEL SECURITY;

-- 🔹 Users can only view their own expenses
CREATE POLICY user_can_view_own_expenses
ON expenses
FOR SELECT
TO app_user
USING (user_id = CAST(current_setting('app.current_user_id', TRUE) AS UUID));

-- 🔹 Users can only insert expenses for themselves
CREATE POLICY user_can_insert_expense
ON expenses
FOR INSERT
TO app_user
WITH CHECK (user_id = CAST(current_setting('app.current_user_id', TRUE) AS UUID));

-- 🔹 Users can only update their own expenses
CREATE POLICY user_can_update_own_expenses
ON expenses
FOR UPDATE
TO app_user
USING (user_id = CAST(current_setting('app.current_user_id', TRUE) AS UUID));

-- 🔹 Users can only delete their own expenses
CREATE POLICY user_can_delete_own_expenses
ON expenses
FOR DELETE
TO app_user
USING (user_id = CAST(current_setting('app.current_user_id', TRUE) AS UUID));