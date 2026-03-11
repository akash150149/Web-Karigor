const express = require('express');
const router = express.Router();
const { handleBookingSubmission } = require('../controllers/bookingController');

router.post('/', handleBookingSubmission);

module.exports = router;
