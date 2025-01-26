const { db } = require('../database');

exports.getStreams = async (req, res) => {
  try {
    const streams = await db.dbAll('SELECT * FROM streams');
    res.json(streams);
  } catch (error) {
    console.error('Streams error:', error);
    res.status(500).json({ error: 'Failed to load streams' });
  }
};

exports.createStream = async (req, res) => {
  try {
    const { name, url, category } = req.body;
    await db.dbRun(
      'INSERT INTO streams (name, url, category) VALUES (?, ?, ?)',
      [name, url, category]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Add stream error:', error);
    res.status(400).json({ error: 'Failed to add stream' });
  }
};

exports.updateStream = async (req, res) => {
  try {
    const { name, url, category } = req.body;
    await db.dbRun(
      'UPDATE streams SET name = ?, url = ?, category = ? WHERE id = ?',
      [name, url, category, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Update stream error:', error);
    res.status(400).json({ error: 'Failed to update stream' });
  }
};

exports.deleteStream = async (req, res) => {
  try {
    await db.dbRun('DELETE FROM streams WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete stream error:', error);
    res.status(400).json({ error: 'Failed to delete stream' });
  }
};