require('dotenv').config();
const express = require('express');
const cors = require('cors');
const brewsRouter = require('./routes/brews');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/brews', brewsRouter);

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
