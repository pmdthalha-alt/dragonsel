const express = require('express');
const router = express.Router();
const Module = require('../../models/Module');

// Get design canvas
router.get('/:projectId', async (req, res, next) => {
  try {
    const data = await Module.getModuleData(req.params.projectId, 'design');
    res.json(data || { module: 'design', data: { canvases: [] } });
  } catch (err) {
    next(err);
  }
});

// Save design canvas
router.post('/:projectId', async (req, res, next) => {
  try {
    const data = await Module.saveModuleData(
      req.params.projectId,
      'design',
      req.body
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Create new canvas
router.post('/:projectId/canvases', async (req, res, next) => {
  try {
    const { type, width, height } = req.body;
    const canvas = {
      id: require('uuid').v4(),
      type,
      dimensions: { width, height },
      objects: [],
    };
    res.status(201).json(canvas);
  } catch (err) {
    next(err);
  }
});

// Update canvas objects
router.patch('/:projectId/canvases/:canvasId', async (req, res, next) => {
  try {
    const { objects } = req.body;
    res.json({ canvasId: req.params.canvasId, objects });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
