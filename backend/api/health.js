// Health check endpoint for Vercel serverless function
module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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
};
