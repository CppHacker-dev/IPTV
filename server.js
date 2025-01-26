const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { initDatabase } = require('./database');
const limiter = require('./config/rateLimit');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: `http://localhost:${PORT}`, credentials: true }));
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/streams', require('./routes/streamRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/backup', require('./routes/backupRoutes'));

// Serve partials
app.use('/partials', express.static(path.join(__dirname, 'public', 'partials')));

// Error handling
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));