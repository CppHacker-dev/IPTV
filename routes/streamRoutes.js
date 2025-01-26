const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getStreams,
  createStream,
  updateStream,
  deleteStream
} = require('../controllers/streamController');

router.get('/', authenticate, getStreams);
router.post('/', authenticate, createStream);
router.put('/:id', authenticate, updateStream);
router.delete('/:id', authenticate, deleteStream);

module.exports = router;