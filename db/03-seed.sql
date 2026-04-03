-- ==============================
-- Seed Data for Users and Expenses
-- ==============================

-- Insert test users and return their generated UUIDs
WITH inserted_users AS (
    INSERT INTO users (id, email, password_hash) VALUES
        (uuid_generate_v4(), 'pennywise@example.com', '$2b$12$sQDjRQRkMFrhqV7FmJrVFO7Bru3QyjkLio.7bOxhzTMLGxMxr.eNe'), -- Password: c3nt5
        (uuid_generate_v4(), 'buckaroo@example.com', '$2b$12$wl9XjgJ9oC6c85xV.MPJs.HoHjlf3Piq1KNyaWdJqoJOmSMlsCEl2'), -- Password: m0n3y
        (uuid_generate_v4(), 'centsible@example.com', '$2b$12$SjKUQUAVEdFpdKmZ2utlSerS7lJNT.W19QjUg5I6O6qLmu1LA7vhG') -- Password: d0ll4r
    ON CONFLICT DO NOTHING
    RETURNING id, email
)

-- ==============================
-- Insert test expenses using dynamically fetched user UUIDs
-- ==============================

INSERT INTO expenses (user_id, description, amount, category, date)
SELECT id, description, amount, category, date::DATE
FROM (
    VALUES
        -- Pennywise's Expenses
        ('pennywise@example.com', 'Supermarket', 50.00, 'Groceries', '2027-02-01'),
        ('pennywise@example.com', 'Gym Membership', 30.00, 'Fitness', '2027-02-02'),
        ('pennywise@example.com', 'Online Course', 120.00, 'Education', '2027-02-03'),

        -- Buckaroo's Expenses
        ('buckaroo@example.com', 'Netflix Subscription', 15.99, 'Entertainment', '2027-02-01'),
        ('buckaroo@example.com', 'Coffee', 4.50, 'Beverages', '2027-02-02'),
        ('buckaroo@example.com', 'New Phone', 699.00, 'Shopping', '2027-02-03'),

        -- Centsible's Expenses
        ('centsible@example.com', 'Hotel Booking', 200.00, 'Travel', '2027-02-01'),
        ('centsible@example.com', 'Flight Ticket', 450.00, 'Travel', '2027-02-02'),
        ('centsible@example.com', 'Concert Ticket', 80.00, 'Entertainment', '2027-02-03')
) AS expense_data (email, description, amount, category, date)
JOIN inserted_users u ON u.email = expense_data.email
ON CONFLICT DO NOTHING;
