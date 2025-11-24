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
    logging: false
  }
);

export default sequelize;
