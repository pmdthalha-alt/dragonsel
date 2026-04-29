const { v4: uuid } = require('uuid');
const bcryptjs = require('bcryptjs');

exports.seed = async function (knex) {
  // Delete existing entries
  await knex('generation_jobs').del();
  await knex('module_data').del();
  await knex('assets').del();
  await knex('projects').del();
  await knex('users').del();

  // Create test user
  const userId = uuid();
  const hashedPassword = await bcryptjs.hash('password123', 10);

  await knex('users').insert({
    id: userId,
    email: 'demo@dragonsel.io',
    name: 'Demo User',
    password_hash: hashedPassword,
    avatar_url: null,
    created_at: new Date(),
    updated_at: new Date(),
  });

  // Create sample projects
  const project1Id = uuid();
  const project2Id = uuid();

  await knex('projects').insert([
    {
      id: project1Id,
      user_id: userId,
      title: 'Gaming Brand Launch',
      description: 'Complete brand identity and launch campaign for a gaming studio',
      prompt: 'Create a gaming brand launch with research, design system, marketing video, and landing page',
      goals: {
        primary: 'Build awareness for gaming studio launch',
        secondary: ['Establish brand identity', 'Create marketing assets', 'Build landing page'],
      },
      audience: 'Gamers, gaming media, investors',
      brand_rules: {
        tone: 'Energetic, modern, gaming-focused',
        colors: ['#FF0066', '#00CCFF', '#1A1A2E'],
        fonts: ['Inter', 'JetBrains Mono'],
      },
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: project2Id,
      user_id: userId,
      title: 'SaaS Product Launch',
      description: 'Marketing campaign for B2B SaaS product',
      prompt: 'Create launch campaign for productivity SaaS tool',
      goals: {
        primary: 'Generate early user signups',
      },
      audience: 'Remote teams, project managers, SMBs',
      brand_rules: {
        tone: 'Professional, innovative, helpful',
        colors: ['#2563EB', '#10B981', '#F59E0B'],
      },
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Add sample module data for first project
  await knex('module_data').insert([
    {
      id: uuid(),
      project_id: project1Id,
      module: 'research',
      data: {
        sources: [
          {
            id: uuid(),
            type: 'article',
            title: 'Gaming Industry Trends 2024',
            url: 'https://example.com/gaming-trends',
            summary: 'Latest trends in gaming industry growth and market analysis',
          },
          {
            id: uuid(),
            type: 'document',
            title: 'Competitor Analysis',
            url: 'https://example.com/competitors',
            summary: 'Analysis of top 5 gaming studios',
          },
        ],
        insights: [
          'Mobile gaming growing 25% YoY',
          'Cross-platform play is critical',
          'Community engagement drives retention',
        ],
      },
      version: 1,
      updated_at: new Date(),
    },
    {
      id: uuid(),
      project_id: project1Id,
      module: 'design',
      data: {
        canvases: [
          {
            id: uuid(),
            type: 'logo',
            name: 'Studio Logo',
            dimensions: { width: 1024, height: 1024 },
            objects: [],
          },
        ],
        brandKit: {
          colors: ['#FF0066', '#00CCFF', '#1A1A2E'],
          fonts: ['Inter', 'JetBrains Mono'],
        },
      },
      version: 1,
      updated_at: new Date(),
    },
    {
      id: uuid(),
      project_id: project1Id,
      module: 'video',
      data: {
        timelines: [],
      },
      version: 1,
      updated_at: new Date(),
    },
    {
      id: uuid(),
      project_id: project1Id,
      module: 'web',
      data: {
        pages: [
          {
            id: uuid(),
            title: 'Home',
            url: '/',
            sections: [],
          },
        ],
      },
      version: 1,
      updated_at: new Date(),
    },
  ]);

  // Add sample assets
  await knex('assets').insert([
    {
      id: uuid(),
      project_id: project1Id,
      type: 'image',
      name: 'Gaming Screenshot 1',
      url: 'https://via.placeholder.com/1920x1080?text=Gaming+Screenshot+1',
      metadata: {
        width: 1920,
        height: 1080,
      },
      created_at: new Date(),
    },
    {
      id: uuid(),
      project_id: project1Id,
      type: 'image',
      name: 'Gaming Screenshot 2',
      url: 'https://via.placeholder.com/1920x1080?text=Gaming+Screenshot+2',
      metadata: {
        width: 1920,
        height: 1080,
      },
      created_at: new Date(),
    },
  ]);

  console.log('✅ Seed data created successfully');
};
