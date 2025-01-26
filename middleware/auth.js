const { db } = require('../database');

const sendUnauthorized = (res) => {
  res.status(401).json({ error: 'Unauthorized' });
};

const authenticate = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) return sendUnauthorized(res);

    const user = await db.get(
      `SELECT users.* FROM sessions
      JOIN users ON sessions.user_id = users.id
      WHERE sessions.id = ? AND sessions.expires_at > datetime('now', '+5 minutes')`,
      [sessionId]
    );

    if (!user) {
      res.clearCookie('sessionId');
      return sendUnauthorized(res);
    }

    await db.run(
      `UPDATE sessions SET expires_at = datetime('now', '+1 hour')
      WHERE id = ?`,
      [sessionId]
    );

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    sendUnauthorized(res);
  }
};

module.exports = { authenticate };