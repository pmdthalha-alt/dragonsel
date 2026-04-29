require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'dragonsel',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'dragonsel_dev',
      port: process.env.DB_PORT || 5432,
    },
    migrations: {
      directory: './src/migrations',
    },
    seeds: {
      directory: './src/migrations/seeds',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'dragonsel_test',
      password: 'test_password',
      database: 'dragonsel_test',
      port: 5432,
    },
    migrations: {
      directory: './src/migrations',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/migrations',
    },
  },
};
