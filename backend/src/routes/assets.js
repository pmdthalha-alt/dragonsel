const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

// Get project assets
router.get('/:projectId', async (req, res, next) => {
  try {
    const { type } = req.query;
    const assets = await Asset.getProjectAssets(req.params.projectId, type);
    res.json(assets);
  } catch (err) {
    next(err);
  }
});

// Upload asset
router.post('/:projectId', async (req, res, next) => {
  try {
    const { type, name, url, metadata } = req.body;
    const asset = await Asset.createAsset(req.params.projectId, {
      type,
      name,
      url,
      metadata,
    });
    res.status(201).json(asset);
  } catch (err) {
    next(err);
  }
});

// Delete asset
router.delete('/:projectId/:assetId', async (req, res, next) => {
  try {
    await Asset.deleteAsset(req.params.assetId, req.params.projectId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
