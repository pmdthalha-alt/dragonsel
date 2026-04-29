const express = require('express');
const router = express.Router();
const Module = require('../../models/Module');

// Get research data
router.get('/:projectId', async (req, res, next) => {
  try {
    const data = await Module.getModuleData(req.params.projectId, 'research');
    res.json(data || { module: 'research', data: { sources: [] } });
  } catch (err) {
    next(err);
  }
});

// Save research data
router.post('/:projectId', async (req, res, next) => {
  try {
    const data = await Module.saveModuleData(
      req.params.projectId,
      'research',
      req.body
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Upload source document
router.post('/:projectId/sources', async (req, res, next) => {
  try {
    // TODO: Handle file upload, parsing, embedding
    res.json({ status: 'pending' });
  } catch (err) {
    next(err);
  }
});

// Query research sources
router.post('/:projectId/query', async (req, res, next) => {
  try {
    const { question } = req.body;
    // TODO: Implement semantic search over embeddings
    res.json({ query: question, results: [] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
