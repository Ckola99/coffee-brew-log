require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const brewsRouter = require('./routes/brews');

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/brews', brewsRouter);

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // creates the brews table if it doesn't exist yet
    app.listen(PORT, () => {
      console.log(`Coffee Brew Log API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
