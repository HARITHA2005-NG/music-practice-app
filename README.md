## Testing

To run a minimal API smoke test (requires node-fetch):

```bash
npm install node-fetch@2
node test_smoke.js
```

You should see `Smoke test passed` if the API is working.

## Manual Test Steps

1. Start the server: `npm start`
2. Open http://localhost:4000/auth and create a new account
3. Use the metronome, tuner, and record a session
4. Visit http://localhost:4000/dashboard to see your progress and recordings
5. Try the dark mode toggle and mobile view

## Deployment

1. Set your `JWT_SECRET` and `PORT` in a `.env` file
2. Run `npm install --production`
3. Start with `npm start` (use a process manager like pm2 for production)
4. Serve behind HTTPS (see Express docs for HTTPS setup)

# Music Practice Web Application

Minimal full-stack Music Practice app implementing the provided SRS.

Features:
- User register / login (JWT)
- Start/stop practice sessions with notes
- Simple metronome and basic tuner
- Record audio in browser and upload to server
- Progress summary (total and daily)

Setup

1. Install dependencies:

```bash
npm install
```

2. Initialize the database:

```bash
npm run init-db
```

3. Start the server:

```bash
npm start
```

4. Open http://localhost:4000

Notes
- This is a minimal prototype. For production use, set `JWT_SECRET` and add HTTPS, input validation, rate limits, and stronger security.

Environment

Create a `.env` file in the project root to override defaults. Example:

```
JWT_SECRET=your-strong-secret
PORT=4000
```

The server loads `.env` at startup (development convenience). Do not commit secrets to source control.
