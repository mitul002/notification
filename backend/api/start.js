const webPush = require('web-push');
const { v4: uuidv4 } = require('uuid');

// Store active subscriptions (in production, use a database)
const activeSubscriptions = new Map();

const startNotifications = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Initialize web-push with VAPID details
    webPush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:admin@timenotification.app',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const { subscription, interval = 60 } = req.body;
    
    if (!subscription) {
      return res.status(400).json({ error: 'Push subscription required' });
    }

    // Validate interval (5 seconds to 1 hour)
    const notificationInterval = Math.max(5, Math.min(3600, parseInt(interval)));
    const subId = uuidv4();

    console.log(`Starting notifications for ${subId} every ${notificationInterval} seconds`);

    // Function to send time notification
    const sendTimeNotification = async () => {
      try {
        const now = new Date();
        const payload = JSON.stringify({
          title: '🕐 Current Time',
          body: `${now.toLocaleTimeString()}\n${now.toLocaleDateString()}`,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: 'time-notification',
          timestamp: now.getTime(),
          actions: [
            {
              action: 'stop',
              title: '⏹️ Stop Notifications'
            },
            {
              action: 'snooze',
              title: '😴 Snooze 5min'
            }
          ],
          data: {
            subscriptionId: subId,
            url: process.env.FRONTEND_URL || 'https://yourusername.github.io/notification'
          }
        });

        await webPush.sendNotification(subscription, payload);
        console.log(`✅ Notification sent for ${subId} at ${now.toLocaleTimeString()}`);
        
      } catch (error) {
        console.error(`❌ Push notification failed for ${subId}:`, error);
        
        // If subscription is invalid, remove it
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log(`🗑️ Removing invalid subscription ${subId}`);
          if (activeSubscriptions.has(subId)) {
            clearInterval(activeSubscriptions.get(subId).intervalId);
            activeSubscriptions.delete(subId);
          }
        }
      }
    };

    // Send immediate notification
    await sendTimeNotification();

    // Set up recurring notifications
    const intervalId = setInterval(sendTimeNotification, notificationInterval * 1000);

    // Store subscription info
    activeSubscriptions.set(subId, {
      subscription,
      intervalId,
      interval: notificationInterval,
      startTime: new Date(),
      lastNotification: new Date()
    });

    res.status(200).json({ 
      success: true,
      subscriptionId: subId,
      interval: notificationInterval,
      message: `Notifications started every ${notificationInterval} seconds`
    });

  } catch (error) {
    console.error('❌ Start notifications error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

module.exports = startNotifications;

// Export activeSubscriptions for other modules to access
global.activeSubscriptions = activeSubscriptions;