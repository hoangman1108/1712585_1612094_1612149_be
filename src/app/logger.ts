import pino from 'pino';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const logger = pino({
  safe: true,
  prettyPrint: env === 'development',
});

export default logger;
