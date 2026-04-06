const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// This creates the database file automatically
const db = new sqlite3.Database('./data.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite.');
});

// This creates the table automatically
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// Make sure it is app.post and the word is '/register'
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // Check if the table name is 'users' (plural)
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function(err) {
        if (err) {
            console.error("Database Error:", err.message);
            return res.status(400).json({ error: "User already exists or database error" });
        }
        console.log(`Successfully registered: ${username}`);
        res.json({ message: "Registration successful" });
    });
});
// --- ADD THIS LOGIN SECTION ---
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // We search the database for a user with this username AND password
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (row) {
            // If a row is found, the credentials match!
            console.log(`User logged in: ${username}`);
            res.json({ 
                message: "Login successful", 
                user: { id: row.id, username: row.username } 
            });
        } else {
            // If no row is found, either the username or password is wrong
            res.status(401).json({ error: "Invalid username or password" });
        }
    });
});
// ------------------------------
app.listen(5000, () => console.log('Server live on port 5000'));