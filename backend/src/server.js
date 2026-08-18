const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({ path: '../.env' }); // Assuming .env is in the root directory

const topicsRouter = require('./routes/topics');
const learningPathRouter = require('./routes/learningPath');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/topics', topicsRouter);
app.use('/api/learning-path', learningPathRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TechPath API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
