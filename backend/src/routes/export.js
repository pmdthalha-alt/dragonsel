const express = require('express');
const router = express.Router();

// Export project
router.post('/:projectId/package', async (req, res, next) => {
  try {
    const { formats } = req.body; // ['slides', 'video', 'website', 'brand-kit']
    res.json({ status: 'packaging', formats });
  } catch (err) {
    next(err);
  }
});

// Download export
router.get('/:projectId/download/:format', async (req, res, next) => {
  try {
    // TODO: Stream file to client
    res.json({ status: 'download-ready' });
  } catch (err) {
    next(err);
  }
});

// Create share link
router.post('/:projectId/share', async (req, res, next) => {
  try {
    const shareLink = `https://dragonsel.io/share/${require('uuid').v4()}`;
    res.json({ shareLink });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
