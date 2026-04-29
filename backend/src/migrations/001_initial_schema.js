exports.up = function (knex) {
  return knex.schema
    // Users table
    .createTable('users', (table) => {
      table.uuid('id').primary();
      table.string('email').unique().notNullable();
      table.string('name');
      table.string('password_hash').notNullable();
      table.string('avatar_url');
      table.timestamps(true, true);
    })
    // Projects table
    .createTable('projects', (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
      table.string('title').notNullable();
      table.text('description');
      table.text('prompt');
      table.jsonb('goals').defaultTo('{}');
      table.string('audience');
      table.jsonb('brand_rules').defaultTo('{}');
      table.string('status').defaultTo('draft');
      table.timestamps(true, true);
      table.index('user_id');
    })
    // Assets table
    .createTable('assets', (table) => {
      table.uuid('id').primary();
      table.uuid('project_id').notNullable().references('projects.id').onDelete('CASCADE');
      table.string('type').notNullable();
      table.string('name').notNullable();
      table.text('url').notNullable();
      table.jsonb('metadata').defaultTo('{}');
      table.timestamps(true, true);
      table.index('project_id');
      table.index('type');
    })
    // Module data table
    .createTable('module_data', (table) => {
      table.uuid('id').primary();
      table.uuid('project_id').notNullable().references('projects.id').onDelete('CASCADE');
      table.string('module').notNullable();
      table.jsonb('data').notNullable();
      table.integer('version').defaultTo(1);
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.unique(['project_id', 'module']);
      table.index('project_id');
    })
    // Generation jobs table
    .createTable('generation_jobs', (table) => {
      table.uuid('id').primary();
      table.uuid('project_id').notNullable().references('projects.id').onDelete('CASCADE');
      table.string('module').notNullable();
      table.string('status').notNullable().defaultTo('queued');
      table.text('prompt');
      table.jsonb('result');
      table.text('error');
      table.timestamps(true, true);
      table.index('project_id');
      table.index('status');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('generation_jobs')
    .dropTableIfExists('module_data')
    .dropTableIfExists('assets')
    .dropTableIfExists('projects')
    .dropTableIfExists('users');
};
