const knex = require('knex');
const config = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const database = knex(config[environment]);

async function runMigrations() {
  try {
    console.log('🔄 Running migrations...');
    await database.migrate.latest();
    console.log('✅ Migrations completed successfully');
    
    // Run seeds
    console.log('🌱 Seeding data...');
    await database.seed.run();
    console.log('✅ Seeding completed successfully');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

runMigrations();
