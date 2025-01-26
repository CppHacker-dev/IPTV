const { db } = require('../database');

exports.getStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      db.get("SELECT COUNT(*) as total FROM streams"),
      db.get("SELECT COUNT(DISTINCT category) as categories FROM streams"),
      db.get("SELECT COUNT(*) as today FROM streams WHERE DATE(created_at) = DATE('now')"),
      db.get("SELECT COUNT(DISTINCT user_id) as active FROM sessions WHERE expires_at > datetime('now')")
    ]);
    
    res.json({
      totalStreams: stats[0].total,
      totalCategories: stats[1].categories,
      streamsToday: stats[2].today,
      activeUsers: stats[3].active
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to load statistics' });
  }
};