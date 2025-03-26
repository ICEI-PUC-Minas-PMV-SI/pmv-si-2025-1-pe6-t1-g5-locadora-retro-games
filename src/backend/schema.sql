-- CREATE TABLE IF NOT EXISTS users (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100),
--     email VARCHAR(100) UNIQUE,
--     cpf VARCHAR(11) UNIQUE
-- );

-- CREATE TABLE IF NOT EXISTS addresses (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id),
--     street VARCHAR(100),
--     number INTEGER,
--     neighborhood VARCHAR(100),
--     city VARCHAR(100),
--     state VARCHAR(2),
--     zip_code VARCHAR(8)
-- );

-- CREATE TABLE IF NOT EXISTS consoles {
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100)
-- };

-- CREATE TABLE IF NOT EXISTS games (
--     id SERIAL PRIMARY KEY,
--     console_id INTEGER REFERENCES consoles(id),
--     name VARCHAR(100),
--     price DECIMAL(10, 2),
--     description TEXT
-- );

-- CREATE TABLE IF NOT EXISTS reserves {
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id),
--     game_id INTEGER REFERENCES games(id),
--     status_reserve_id INTEGER,
--     reserve_date DATE,
--     approve_date DATE,
--     return_date DATE
-- }

-- CREATE TABLE IF NOT EXISTS status_reserves {
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100)
-- }

-- INSERT INTO users (name, email) VALUES
-- ('Admin', 'admin@nintendin.com', '12345678901');

-- INSERT INTO status_reserves (name, email) VALUES
-- ('Reservado'),
-- ('Devolvido'),
-- ('Cancelado'),
-- ('Pendente');