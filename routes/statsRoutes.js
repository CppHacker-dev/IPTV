const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getStats } = require('../controllers/statsController');

router.get('/', authenticate, getStats);

module.exports = router;