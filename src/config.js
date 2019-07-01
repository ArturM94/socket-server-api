require('dotenv')
  .config();

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || '3000',
  db: {
    URI: process.env.DB_URI || 'mongodb://localhost:27017/socketApiDB',
  },
  auth: {
    JWT_SECRET: process.env.JWT_SECRET || 'UnS3CuR3_S1Gn@tUr3',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
  },
};

export default config;
