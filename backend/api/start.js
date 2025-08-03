const webPush = require('web-push');
const { v4: uuidv4 } = require('uuid');

// Initialize web-push
webPush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:you@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const activeSubscriptions = new Map();

module.exports = async (req, res) => {
  try {
    const { subscription, interval = 10000 } = req.body;
    
    if (!subscription) {
      return res.status(400).json({ error: "Subscription required" });
    }

    const subId = uuidv4();
    const notificationInterval = Math.max(5000, parseInt(interval));

    const intervalId = setInterval(() => {
      webPush.sendNotification(subscription, JSON.stringify({
        title: "Push Notification",
        body: `Received at ${new Date().toLocaleTimeString()}`,
        icon: "/icon-192x192.png"
      })).catch(err => {
        console.error("Push error:", err);
        if (err.statusCode === 410) {
          clearInterval(intervalId);
          activeSubscriptions.delete(subId);
        }
      });
    }, notificationInterval);

    activeSubscriptions.set(subId, { intervalId, subscription });
    
    res.status(200).json({ 
      success: true,
      interval: notificationInterval
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};