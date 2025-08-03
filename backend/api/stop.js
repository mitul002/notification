module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscriptionId } = req.body;
    
    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID required' });
    }

    // Note: In serverless, active subscriptions are not persistent
    // In a production app, you'd store this in a database and clear the scheduled jobs
    console.log(`🛑 Stop request received for subscription ID: ${subscriptionId}`);

    res.status(200).json({ 
      success: true,
      message: `Stop request processed for subscription ${subscriptionId}`,
      note: 'In serverless environment, intervals are cleared when function ends'
    });

  } catch (error) {
    console.error('❌ Stop notifications error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
