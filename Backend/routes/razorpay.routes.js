const express = require('express');
const { processPayment, getKey, paymentVerification } = require('../controllers/razorpay.controller.js');

const router = express.Router();

router.route('/process').post(processPayment);
router.route('/getKey').get(getKey);
router.route('/paymentverification').post(paymentVerification);
module.exports = router;

