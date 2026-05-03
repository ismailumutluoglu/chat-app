CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE presence_status AS ENUM ('online', 'away', 'offline');

CREATE TABLE users (
    id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(32)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    status_text     VARCHAR(140) NOT NULL DEFAULT '',
    presence        presence_status NOT NULL DEFAULT 'offline',
    last_seen_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email    ON users(email);
CREATE INDEX idx_users_username ON users(username);