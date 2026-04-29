const express = require('express');
const router = express.Router();
const Module = require('../../models/Module');

// Get video timeline
router.get('/:projectId', async (req, res, next) => {
  try {
    const data = await Module.getModuleData(req.params.projectId, 'video');
    res.json(data || { module: 'video', data: { timelines: [] } });
  } catch (err) {
    next(err);
  }
});

// Save video timeline
router.post('/:projectId', async (req, res, next) => {
  try {
    const data = await Module.saveModuleData(
      req.params.projectId,
      'video',
      req.body
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Create timeline
router.post('/:projectId/timelines', async (req, res, next) => {
  try {
    const timeline = {
      id: require('uuid').v4(),
      duration: 60000,
      fps: 30,
      tracks: [],
    };
    res.status(201).json(timeline);
  } catch (err) {
    next(err);
  }
});

// Add clip to timeline
router.post('/:projectId/timelines/:timelineId/clips', async (req, res, next) => {
  try {
    const { sourceUrl, startTime, endTime } = req.body;
    const clip = {
      id: require('uuid').v4(),
      sourceUrl,
      startTime,
      endTime,
    };
    res.status(201).json(clip);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
