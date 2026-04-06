const db = require('./db');

const create = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  name TEXT,
  password TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  start_ts INTEGER,
  end_ts INTEGER,
  notes TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS recordings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  filename TEXT,
  created_ts INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`;

db.exec(create, (err) => {
  if (err) {
    console.error('DB init error', err);
  } else {
    console.log('Database initialized.');
  }
  db.close();
});
