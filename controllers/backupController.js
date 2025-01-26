const { db } = require('../database');

exports.createBackup = async (req, res) => {
  try {
    const streams = await db.all('SELECT * FROM streams');
    res.setHeader('Content-Disposition', 'attachment; filename="iptv-backup.json"');
    res.json(streams);
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
};

exports.restoreBackup = async (req, res) => {
  try {
    await db.run('DELETE FROM streams');
    const insertPromises = req.body.map(stream => 
      db.run('INSERT INTO streams (name, url, category) VALUES (?, ?, ?)', 
        [stream.name, stream.url, stream.category])
    );
    await Promise.all(insertPromises);
    res.json({ restored: req.body.length });
  } catch (error) {
    console.error('Restore error:', error);
    res.status(400).json({ error: 'Invalid backup file' });
  }
};