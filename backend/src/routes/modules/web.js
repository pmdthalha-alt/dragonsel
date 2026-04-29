const express = require('express');
const router = express.Router();
const Module = require('../../models/Module');

// Get website pages
router.get('/:projectId', async (req, res, next) => {
  try {
    const data = await Module.getModuleData(req.params.projectId, 'web');
    res.json(data || { module: 'web', data: { pages: [] } });
  } catch (err) {
    next(err);
  }
});

// Save website pages
router.post('/:projectId', async (req, res, next) => {
  try {
    const data = await Module.saveModuleData(
      req.params.projectId,
      'web',
      req.body
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Create new page
router.post('/:projectId/pages', async (req, res, next) => {
  try {
    const { title, url } = req.body;
    const page = {
      id: require('uuid').v4(),
      title,
      url,
      sections: [],
    };
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
});

// Generate page from prompt
router.post('/:projectId/pages/generate', async (req, res, next) => {
  try {
    const { prompt } = req.body;
    // TODO: Call AI to generate page structure
    res.json({ status: 'generating', prompt });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
