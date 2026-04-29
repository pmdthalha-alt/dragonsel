const knex = require('knex');
const config = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const database = knex(config[environment]);

async function seed() {
  try {
    console.log('🌱 Seeding data...');
    await database.seed.run();
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
