const { activeSubscriptions } = require('./start');

module.exports = async (req, res) => {
  try {
    const { subscription } = req.body;
    
    for (const [subId, subData] of activeSubscriptions) {
      if (subData.subscription.endpoint === subscription?.endpoint) {
        clearInterval(subData.intervalId);
        activeSubscriptions.delete(subId);
        return res.json({ success: true });
      }
    }
    
    res.status(404).json({ error: "Subscription not found" });
  } catch (error) {
    console.error("Stop error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};