const getStatus = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const activeSubscriptions = global.activeSubscriptions;
    
    const stats = {
      activeSubscriptions: activeSubscriptions ? activeSubscriptions.size : 0,
      subscriptions: []
    };

    // Add subscription details (without sensitive data)
    if (activeSubscriptions) {
      for (const [subId, subData] of activeSubscriptions) {
        stats.subscriptions.push({
          id: subId,
          interval: subData.interval,
          startTime: subData.startTime,
          lastNotification: subData.lastNotification,
          endpoint: subData.subscription.endpoint ? 
            subData.subscription.endpoint.substring(0, 50) + '...' : 'unknown'
        });
      }
    }

    res.json({
      success: true,
      stats,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY
    });
    
  } catch (error) {
    console.error('❌ Status check error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

module.exports = getStatus;
