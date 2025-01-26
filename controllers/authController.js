const { db } = require('../database');
const argon2 = require('argon2');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1
    });
    
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', 
      [username.toLowerCase().trim(), hashedPassword]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await db.get(
      'SELECT * FROM users WHERE username = ?',
      [username.toLowerCase().trim()]
    );

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const sessionId = crypto.randomBytes(16).toString('hex');
    await db.run(
      `INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?, ?, datetime('now', '+1 hour'))`,
      [sessionId, user.id]
    );

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};