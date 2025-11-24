import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
// Explicitly import pg to ensure it's available when Sequelize loads the dialect
// This is required for ESM modules and serverless environments like Vercel
import pg from 'pg';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    // Serverless-optimized connection pool configuration
    pool: {
      max: 1, // Serverless functions should use minimal connections
      min: 0,
      acquire: 3000, // Maximum time (ms) to wait for a connection (3 seconds)
      idle: 10000, // Maximum time (ms) a connection can be idle before being released
      evict: 1000, // Interval (ms) to check for idle connections
    },
    // Connection timeout settings for serverless
    dialectOptions: {
      connectTimeout: 3000, // 3 seconds to establish connection
      statement_timeout: 5000, // 5 seconds for query execution
    },
    // Retry configuration
    retry: {
      max: 2, // Maximum retry attempts
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /ESOCKETTIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ]
    }
  }
);

export default sequelize;
