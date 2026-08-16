const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dialect === 'postgres') {
  // Production (e.g. Render Postgres) — reads the full connection string from ENV.
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set when DB_DIALECT=postgres');
  }
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === 'production'
          ? { require: true, rejectUnauthorized: false }
          : false,
    },
  });
} else {
  // Local development — a file-based SQLite database.
  const storagePath =
    process.env.DB_STORAGE || path.join(__dirname, '..', 'data', 'brewlog.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });
}

module.exports = sequelize;
