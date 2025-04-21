const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)

router.get('/recent-rides',
    authMiddleware.authUser,
    rideController.getRecentRides
);


//from captain side ride creation
router.post('/create-rideshare', 
    authMiddleware.authCaptain ,
    rideController.createRideShare
);
router.post('/join-rideshare',
    authMiddleware.authUser,
    [
      body('rideshareId').isMongoId().withMessage('Invalid rideshare ID')
    ],
    rideController.joinRideshare
  );

router.get('/available-rides',
    authMiddleware.authUser,
    [
        body('pickup').notEmpty().withMessage('Pickup location is required'),
        body('destination').notEmpty().withMessage('Destination is required'),
        body('maxPassengers').isInt({min: 1, max: 4}).withMessage('Max passengers must be between 1 and 4'),
        body('pricePerSeat').isFloat({min: 0}).withMessage('Price per seat must be positive'),
        body('departureTime').isISO8601().withMessage('Valid departure time is required')
    ],
    rideController.getAvailableRides
)


module.exports = router;