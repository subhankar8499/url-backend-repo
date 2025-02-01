const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { createUrl, deleteUrl, getAllUrls, trackClick } = require('../controllers/urlController');

router.get('/', auth, getAllUrls);
router.post('/', auth, createUrl);
router.delete('/:id', auth, deleteUrl);
router.get('/:shortCode', trackClick); // Add this line

module.exports = router;