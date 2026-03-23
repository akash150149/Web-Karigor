const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { getAvailability, handleBookingSubmission } = require('../controllers/bookingController');

// Rate limit: max 20 requests per 15 min per IP
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit submissions more strictly: 3 per 15 min per IP
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many booking attempts. Please wait a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/availability', bookingLimiter, getAvailability);
router.post('/', submissionLimiter, handleBookingSubmission);

module.exports = router;
