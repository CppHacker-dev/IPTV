const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createBackup, restoreBackup } = require('../controllers/backupController');

router.get('/', authenticate, createBackup);
router.post('/restore', authenticate, restoreBackup);

module.exports = router;