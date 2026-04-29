const db = require('../db');
const { v4: uuid } = require('uuid');

// Upload and store asset
async function createAsset(projectId, assetData) {
  const assetId = uuid();

  await db('assets').insert({
    id: assetId,
    project_id: projectId,
    type: assetData.type,
    name: assetData.name,
    url: assetData.url,
    metadata: assetData.metadata || {},
    created_at: new Date(),
  });

  return getAsset(assetId);
}

// Get asset
async function getAsset(assetId) {
  return db('assets').where('id', assetId).first();
}

// Get project assets
async function getProjectAssets(projectId, type = null) {
  let query = db('assets').where('project_id', projectId);

  if (type) {
    query = query.where('type', type);
  }

  return query.orderBy('created_at', 'desc');
}

// Delete asset
async function deleteAsset(assetId, projectId) {
  await db('assets')
    .where({ id: assetId, project_id: projectId })
    .del();
}

module.exports = {
  createAsset,
  getAsset,
  getProjectAssets,
  deleteAsset,
};
