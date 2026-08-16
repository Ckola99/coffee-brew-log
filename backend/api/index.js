// Vercel serverless entry point. Vercel treats any file under /api as a
// function, and knows how to call an exported Express app directly.
//
// Serverless functions are stateless between cold starts, so we cache the
// "is the DB ready" check on the module scope — it only re-runs on a fresh
// cold start, not on every request within the same warm instance.
const app = require('../app');
const sequelize = require('../config/database');

let dbReadyPromise = null;

function ensureDbReady() {
  if (!dbReadyPromise) {
    dbReadyPromise = sequelize.authenticate().then(() => sequelize.sync());
  }
  return dbReadyPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureDbReady();
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ error: 'Database connection failed' });
    return;
  }
  app(req, res);
};
