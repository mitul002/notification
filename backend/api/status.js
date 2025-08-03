module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    
    if (!vapidPublicKey) {
      return res.status(500).json({ 
        error: 'VAPID configuration missing',
        message: 'VAPID_PUBLIC_KEY environment variable not set'
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        activeSubscriptions: 0, // Serverless functions don't maintain state
        subscriptions: []
      },
      vapidPublicKey: vapidPublicKey,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Status error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
