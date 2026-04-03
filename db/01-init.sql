-- Drop and recreate the database
-- DROP DATABASE IF EXISTS expense_tracker;
-- CREATE DATABASE expense_tracker;

-- Connect to the newly created database
\c expense_tracker

-- Drop and recreate the authentication role (for login/signup)
DROP ROLE IF EXISTS auth_user;
CREATE ROLE auth_user WITH LOGIN PASSWORD 'secure-auth-password';

-- Drop and recreate the application user role (for app usage)
DROP ROLE IF EXISTS app_user;
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure-app-password';

-- Restrict public access to prevent unintended exposure
REVOKE ALL ON DATABASE expense_tracker FROM PUBLIC;
GRANT CONNECT ON DATABASE expense_tracker TO auth_user;
GRANT CONNECT ON DATABASE expense_tracker TO app_user;

-- Grant restricted access to the public schema
GRANT USAGE ON SCHEMA public TO auth_user;
GRANT USAGE ON SCHEMA public TO app_user;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prevent `auth_user` from accessing the full users table
REVOKE ALL ON users FROM auth_user;
GRANT SELECT, INSERT ON users TO auth_user;

-- Create Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restrict table access from public users
REVOKE ALL ON users FROM PUBLIC;
REVOKE ALL ON expenses FROM PUBLIC;

-- Prevent unauthorized discovery of database schema
REVOKE USAGE ON SCHEMA pg_catalog FROM auth_user;
REVOKE USAGE ON SCHEMA pg_catalog FROM app_user;

-- Grant necessary permissions to `app_user`
GRANT SELECT, INSERT, UPDATE, DELETE ON expenses TO app_user;
GRANT SELECT (id, email, created_at) ON users TO app_user;