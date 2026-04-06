const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) console.error("Database connection error:", err.message);
    else console.log("Connected to the SQLite database.");
});

// We use db.serialize to ensure these tables are created one by one
db.serialize(() => {
    // 1. Users Table (For Login/Register)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        xp INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0
    )`);

    // 2. Progress Table (To track Musicca-style exercises)
    db.run(`CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        exercise_name TEXT,
        score INTEGER,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
});

module.exports = db;