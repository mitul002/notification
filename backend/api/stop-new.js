async function stopNotifications(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { subscription, subscriptionId } = req.body;
    const activeSubscriptions = global.activeSubscriptions;
    
    if (!activeSubscriptions) {
      return res.status(500).json({ error: 'Active subscriptions not initialized' });
    }
    
    let found = false;
    
    // Try to find by subscription ID first (more reliable)
    if (subscriptionId && activeSubscriptions.has(subscriptionId)) {
      const subData = activeSubscriptions.get(subscriptionId);
      clearInterval(subData.intervalId);
      activeSubscriptions.delete(subscriptionId);
      found = true;
      console.log(`🛑 Stopped notifications for subscription ID: ${subscriptionId}`);
    } 
    // Fallback: find by subscription endpoint
    else if (subscription?.endpoint) {
      for (const [subId, subData] of activeSubscriptions) {
        if (subData.subscription.endpoint === subscription.endpoint) {
          clearInterval(subData.intervalId);
          activeSubscriptions.delete(subId);
          found = true;
          console.log(`🛑 Stopped notifications for endpoint: ${subscription.endpoint}`);
          break;
        }
      }
    }
    
    if (found) {
      res.json({ 
        success: true,
        message: 'Notifications stopped successfully'
      });
    } else {
      res.status(404).json({ 
        error: 'Subscription not found',
        message: 'No active notification found for this subscription'
      });
    }
    
  } catch (error) {
    console.error('❌ Stop notifications error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

module.exports = stopNotifications;
