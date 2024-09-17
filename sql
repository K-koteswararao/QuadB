CREATE DATABASE crypto_db;

\c crypto_db

CREATE TABLE crypto_data (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  last NUMERIC,
  buy NUMERIC,
  sell NUMERIC,
  volume NUMERIC,
  base_unit VARCHAR(10)
);
