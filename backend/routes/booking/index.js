const express = require('express');
const { BookingCTRl } = require('../../controllers');
const { handleEsewaSuccess } = require('../../lib');
const router = express.Router();

// router.post('/:id/create', BookingCTRl.createBooking);
router.post('/order', BookingCTRl.createOrder);
router.post('/:id/create', handleEsewaSuccess, BookingCTRl.createBooking);

module.exports = router;