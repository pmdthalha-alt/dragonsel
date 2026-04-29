const db = require('../db');

// Get all projects for a user
async function getUserProjects(userId) {
  return db('projects')
    .where('user_id', userId)
    .orderBy('updated_at', 'desc');
}

// Get single project with all module data
async function getProject(projectId, userId) {
  const project = await db('projects')
    .where({ id: projectId, user_id: userId })
    .first();

  if (!project) return null;

  // Get all module data for this project
  const modules = await db('module_data')
    .where('project_id', projectId)
    .select('module', 'data', 'version', 'updated_at');

  return {
    ...project,
    modules: modules.reduce((acc, mod) => {
      acc[mod.module] = mod;
      return acc;
    }, {}),
  };
}

// Create new project
async function createProject(userId, projectData) {
  const projectId = require('uuid').v4();
  
  await db('projects').insert({
    id: projectId,
    user_id: userId,
    title: projectData.title,
    description: projectData.description,
    prompt: projectData.prompt,
    goals: projectData.goals || {},
    audience: projectData.audience || '',
    brand_rules: projectData.brandRules || {},
    status: 'draft',
    created_at: new Date(),
    updated_at: new Date(),
  });

  return getProject(projectId, userId);
}

// Update project metadata
async function updateProject(projectId, userId, updates) {
  await db('projects')
    .where({ id: projectId, user_id: userId })
    .update({
      ...updates,
      updated_at: new Date(),
    });

  return getProject(projectId, userId);
}

// Delete project
async function deleteProject(projectId, userId) {
  await db('projects')
    .where({ id: projectId, user_id: userId })
    .del();
}

module.exports = {
  getUserProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
