// Local development entry point. Vercel doesn't use this file — it calls
// api/index.js instead, since serverless functions don't run app.listen().
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 4000;

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
