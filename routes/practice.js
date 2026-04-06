const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: uploadDir, filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage });

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'no auth' });
  const token = h.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) { res.status(401).json({ error: 'invalid' }); }
}

router.post('/session/start', auth, (req, res) => {
  const now = Date.now();
  db.run('INSERT INTO sessions (user_id, start_ts) VALUES (?, ?)', [req.user.id, now], function (err) {
    if (err) return res.status(500).json({ error: 'db' });
    res.json({ sessionId: this.lastID, start_ts: now });
  });
});

router.post('/session/stop', auth, (req, res) => {
  const { sessionId, notes } = req.body;
  const end = Date.now();
  db.run('UPDATE sessions SET end_ts = ?, notes = ? WHERE id = ? AND user_id = ?', [end, notes || '', sessionId, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: 'db' });
    res.json({ ok: true, end_ts: end });
  });
});

router.get('/progress', auth, (req, res) => {
  db.all('SELECT * FROM sessions WHERE user_id = ? AND end_ts IS NOT NULL', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db' });
    const total = rows.reduce((s, r) => s + (r.end_ts - r.start_ts), 0);
    // daily summary (simple)
    const byDay = {};
    rows.forEach(r => {
      const day = new Date(r.start_ts).toISOString().slice(0,10);
      byDay[day] = (byDay[day] || 0) + (r.end_ts - r.start_ts);
    });
    res.json({ total_ms: total, daily: byDay });
  });
});

// List sessions (full)
router.get('/sessions', auth, (req, res) => {
  db.all('SELECT id, start_ts, end_ts, notes FROM sessions WHERE user_id = ? ORDER BY start_ts DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db' });
    res.json(rows);
  });
});

// Get a single session
router.get('/sessions/:id', auth, (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM sessions WHERE id = ? AND user_id = ?', [id, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'db' });
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  });
});

router.post('/uploadRecording', auth, upload.single('recording'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'no file' });
  const ts = Date.now();
  db.run('INSERT INTO recordings (user_id, filename, created_ts) VALUES (?, ?, ?)', [req.user.id, file.filename, ts], function (err) {
    if (err) return res.status(500).json({ error: 'db' });
    res.json({ ok: true, filename: file.filename });
  });
});

router.get('/recordings', auth, (req, res) => {
  db.all('SELECT * FROM recordings WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db' });
    res.json(rows);
  });
});

module.exports = router;
