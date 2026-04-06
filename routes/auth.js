const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'no auth' });
  const token = h.replace('Bearer ', '');
  try { req.user = require('jsonwebtoken').verify(token, JWT_SECRET); next(); } catch (e) { res.status(401).json({ error: 'invalid' }); }
}

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing' });
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (email, name, password) VALUES (?, ?, ?)', [email, name || '', hashed], function (err) {
    if (err) return res.status(400).json({ error: 'user exists' });
    const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET);
    res.json({ token });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing' });
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err || !row) return res.status(400).json({ error: 'invalid' });
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(400).json({ error: 'invalid' });
    const token = jwt.sign({ id: row.id, email: row.email }, JWT_SECRET);
    res.json({ token });
  });
});

// Check email availability (for realtime signup validation)
router.get('/check-email', (req, res) => {
  const email = (req.query.email || '').toLowerCase();
  if (!email) return res.json({ available: false });
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: 'db' });
    res.json({ available: !row });
  });
});

// Get current user profile
router.get('/me', auth, (req, res) => {
  db.get('SELECT id, email, name FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  });
});

// Update profile (name/email)
router.put('/me', auth, (req, res) => {
  const { name, email } = req.body;
  db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name || '', email || '', req.user.id], function (err) {
    if (err) return res.status(500).json({ error: 'db' });
    res.json({ ok: true });
  });
});

// Change password
router.put('/me/password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ error: 'missing' });
  db.get('SELECT password FROM users WHERE id = ?', [req.user.id], async (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'not found' });
    const ok = await bcrypt.compare(oldPassword, row.password);
    if (!ok) return res.status(400).json({ error: 'invalid' });
    const hashed = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id], function (err2) {
      if (err2) return res.status(500).json({ error: 'db' });
      res.json({ ok: true });
    });
  });
});

module.exports = router;
