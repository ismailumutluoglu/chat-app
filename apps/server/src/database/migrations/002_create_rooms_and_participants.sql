CREATE TYPE room_type        AS ENUM ('direct', 'group');
CREATE TYPE participant_role AS ENUM ('owner', 'admin', 'member');

CREATE TABLE rooms (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    type        room_type   NOT NULL,
    name        VARCHAR(100),
    avatar_url  TEXT,
    created_by  UUID        REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_group_has_name
        CHECK ((type = 'group' AND name IS NOT NULL) OR type = 'direct')
);

CREATE TABLE room_participants (
    id           UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id      UUID             NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id      UUID             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role         participant_role NOT NULL DEFAULT 'member',
    joined_at    TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    last_read_at TIMESTAMPTZ,

    UNIQUE (room_id, user_id)
);

CREATE INDEX idx_rp_room ON room_participants(room_id);
CREATE INDEX idx_rp_user ON room_participants(user_id);