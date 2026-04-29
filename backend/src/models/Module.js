const db = require('../db');
const { v4: uuid } = require('uuid');

// Get or create module data
async function getModuleData(projectId, module) {
  return db('module_data')
    .where({ project_id: projectId, module })
    .first();
}

// Save module data
async function saveModuleData(projectId, module, data) {
  const existing = await getModuleData(projectId, module);

  if (existing) {
    await db('module_data')
      .where({ project_id: projectId, module })
      .update({
        data,
        version: existing.version + 1,
        updated_at: new Date(),
      });
    return getModuleData(projectId, module);
  }

  const id = uuid();
  await db('module_data').insert({
    id,
    project_id: projectId,
    module,
    data,
    version: 1,
    updated_at: new Date(),
  });

  return getModuleData(projectId, module);
}

// Create generation job
async function createJob(projectId, module, prompt) {
  const jobId = uuid();

  await db('generation_jobs').insert({
    id: jobId,
    project_id: projectId,
    module,
    status: 'queued',
    prompt,
    created_at: new Date(),
  });

  return getJob(jobId);
}

// Get job
async function getJob(jobId) {
  return db('generation_jobs').where('id', jobId).first();
}

// Update job
async function updateJob(jobId, updates) {
  await db('generation_jobs')
    .where('id', jobId)
    .update({
      ...updates,
      updated_at: new Date(),
    });

  return getJob(jobId);
}

module.exports = {
  getModuleData,
  saveModuleData,
  createJob,
  getJob,
  updateJob,
};
