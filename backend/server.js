const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import API routes
console.log('Loading start module...');
const startApi = require('./api/start');
console.log('Start API loaded:', typeof startApi, startApi);

console.log('Loading stop module...');
const stopApi = require('./api/stop');
console.log('Stop API loaded:', typeof stopApi);

console.log('Loading status module...');
const statusApi = require('./api/status');
console.log('Status API loaded:', typeof statusApi);

// Routes
app.post('/api/start', startApi);
app.post('/api/stop', stopApi);
app.get('/api/status', statusApi);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Time Notification Backend API',
        version: '1.0.0',
        endpoints: [
            'POST /api/start - Start notifications',
            'POST /api/stop - Stop notifications', 
            'GET /api/status - Get server status',
            'GET /api/health - Health check'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Time Notification Backend running on port ${PORT}`);
    console.log(`🔑 VAPID Public Key: ${process.env.VAPID_PUBLIC_KEY ? 'Loaded' : 'Missing'}`);
    console.log(`🌐 CORS enabled for all origins`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
