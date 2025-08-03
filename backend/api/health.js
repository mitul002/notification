const express = require('express');
const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    res.status(200).json({
      status: 'OK',
      message: 'Service is healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.2',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'production'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Service health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = app;
