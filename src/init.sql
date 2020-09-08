CREATE TABLE my_content (
    ID SERIAL PRIMARY KEY,
    public_id VARCHAR,
    content VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_id VARCHAR,
    mime_type VARCHAR
);

CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    email VARCHAR,
    created_at TIMESTAMP
);

