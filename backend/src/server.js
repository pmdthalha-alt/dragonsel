// Main Express server setup
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const researchRoutes = require('./routes/modules/research');
const designRoutes = require('./routes/modules/design');
const videoRoutes = require('./routes/modules/video');
const webRoutes = require('./routes/modules/web');
const assetRoutes = require('./routes/assets');
const exportRoutes = require('./routes/export');
const aiRoutes = require('./routes/ai');


// Middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Security middleware
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/assets', authMiddleware, assetRoutes);
app.use('/api/research', authMiddleware, researchRoutes);
app.use('/api/design', authMiddleware, designRoutes);
app.use('/api/video', authMiddleware, videoRoutes);
app.use('/api/web', authMiddleware, webRoutes);
app.use('/api/export', authMiddleware, exportRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

// WebSocket events

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    io.to(`project-${projectId}`).emit('user-joined', { userId: socket.id });
  });

  socket.on('module-update', (data) => {
    io.to(`project-${data.projectId}`).emit('module-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Dragonsel server running on port ${PORT}`);
});

module.exports = { app, io };
