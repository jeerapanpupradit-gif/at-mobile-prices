DROP TABLE IF EXISTS phones;
CREATE TABLE IF NOT EXISTS phones (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  color TEXT NOT NULL,
  selling_prices TEXT NOT NULL,
  repairs TEXT NOT NULL
);
