// Minimal smoke test for API endpoints
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
(async () => {
  const base = 'http://localhost:4000/api';
  // Register
  let r = await fetch(base+'/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email:'testuser@example.com', password:'testpass', name:'Test User' }) });
  let j = await r.json();
  if (!j.token) { console.error('Register failed', j); process.exit(1); }
  const token = j.token;
  // Progress
  r = await fetch(base+'/progress', { headers:{ Authorization:'Bearer '+token }});
  j = await r.json();
  if (!('total_ms' in j)) { console.error('Progress failed', j); process.exit(1); }
  // Start/stop session
  r = await fetch(base+'/session/start', { method:'POST', headers:{ Authorization:'Bearer '+token }});
  j = await r.json();
  const sessionId = j.sessionId;
  r = await fetch(base+'/session/stop', { method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer '+token }, body: JSON.stringify({ sessionId, notes:'smoke test' }) });
  j = await r.json();
  if (!j.ok) { console.error('Session stop failed', j); process.exit(1); }
  console.log('Smoke test passed');
  process.exit(0);
})();