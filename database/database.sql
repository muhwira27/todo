CREATE DATABASE todo;

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    description VARCHAR(500),
    done BOOLEAN
);