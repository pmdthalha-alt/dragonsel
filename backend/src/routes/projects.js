const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get user projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.getUserProjects(req.user.userId);
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// Get single project
router.get('/:projectId', async (req, res, next) => {
  try {
    const project = await Project.getProject(req.params.projectId, req.user.userId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
});

// Create project
router.post('/', async (req, res, next) => {
  try {
    const project = await Project.createProject(req.user.userId, req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

// Update project
router.patch('/:projectId', async (req, res, next) => {
  try {
    const project = await Project.updateProject(
      req.params.projectId,
      req.user.userId,
      req.body
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
});

// Delete project
router.delete('/:projectId', async (req, res, next) => {
  try {
    await Project.deleteProject(req.params.projectId, req.user.userId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
