const express = require('express');
const cors = require('cors');
const { requestLogger } = require('./middleware/requestLogger');
require('dotenv').config({ path: '../.env' }); // Assuming .env is in the root directory

const topicsRouter = require('./routes/topics');
const learningPathRouter = require('./routes/learningPath');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/topics', topicsRouter);
app.use('/api/learning-path', learningPathRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TechPath API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[req_${req.id || 'unknown'}] Error:`, err.message);
  if (err.stack) console.error(err.stack);
  
  res.status(err.status || 500).json({ 
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Something went wrong!',
      requestId: req.id
    }
  });
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
