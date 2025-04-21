const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');
const { getIO } = require('../socket'); // Add this import

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {

        const fare = await rideService.getFare(pickup, destination);
        // Create the ride with captain field set to null initially
        // Create the ride with fare
        const ride = await rideModel.create({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
            captain: null,
            type: 'regular',
            status: 'pending',
            fare: fare[vehicleType], // Set fare based on vehicle type
            otp: Math.floor(100000 + Math.random() * 900000).toString()
        });

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user').lean();

        // Notify available captains
        captainsInRadius.forEach(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data:{ 
                    ...rideWithUser,
                    fare: fare[vehicleType]
                }
            });
        });

        res.status(201).json(ride);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        // Update the ride with captain information
        const ride = await rideModel.findByIdAndUpdate(
            rideId,
            {
                captain: req.captain._id,
                status: 'accepted'
            },
            { new: true }
        ).populate('user').populate('captain');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Notify the user
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.completeRide = async (req, res) => {
    const { rideId } = req.body;
    try {
        const ride = await rideModel.findById(rideId);
        
        // Calculate half of the fare for rideshare
        const captainShare = Math.floor(ride.fare * 0.5);
        
        // Update captain's earnings and stats
        await captainModel.findByIdAndUpdate(
            ride.captain,
            {
                $inc: { 
                    earnings: captainShare,
                    totalRides: 1,
                    completedRides: 1,
                    totalSavings: captainShare // New field for tracking savings from ridesharing
                }
            }
        );

        // Update ride status and split details
        ride.status = 'completed';
        ride.fareDetails = {
            total: ride.fare,
            captainShare: captainShare,
            passengerShare: ride.fare - captainShare
        };
        await ride.save();

        // Emit socket event for real-time update
        sendMessageToSocketId(ride.captain.socketId, {
            event: 'earnings-updated',
            data: { 
                earnings: captainShare,
                rideId,
                fareDetails: ride.fareDetails
            }
        });

        return res.status(200).json({ 
            message: 'Ride completed',
            fareDetails: ride.fareDetails
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error completing ride' });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


//from captain side ride creation
exports.createRideShare = async (req, res) => {
    try {
        const {pickup, destination, maxPassengers, pricePerSeat, departureTime} = req.body;
        
        if(!pickup || !destination || !maxPassengers || !pricePerSeat || !departureTime) {
            return res.status(400).json({message: "All fields are required"});
        }

        // Ensure captain exists in request
        if (!req.captain || !req.captain._id) {
            return res.status(401).json({message: "Captain not authenticated"});
        }

        const rideshare = await rideModel.create({
            captain: req.captain._id,
            pickup,
            destination,
            maxPassengers,
            pricePerSeat,
            departureTime,
            type: "rideshare",
            status: "available",
            fare: Number(pricePerSeat) // Ensure fare is set as number
        });


        await rideshare.save();
        await rideshare.populate('captain');

        const io = getIO();
        io.emit('new-rideshare-available', rideshare);

        res.status(201).json(rideshare);

    } catch (error) {
        console.error('Rideshare creation error:', error);
        res.status(500).json({message: error.message});
    }
};


exports.getRecentRides = async (req, res) => {
    try {
        // Get all available rideshares with future departure time
        const recentRides = await rideModel.find({
            type: 'rideshare',
            status: 'available',
            departureTime: { $gt: new Date() }
        })
        .populate({
            path: 'captain',
            select: 'fullname profileImage rating vehicle totalRides'
        })
        .sort({ createdAt: -1 }) // Sort by creation date, newest first
        .limit(6);

        // Add debug logs
        console.log('Recent rides found:', recentRides.length);
        
        res.status(200).json(recentRides);
    } catch (error) {
        console.error('Error fetching recent rides:', error);
        res.status(500).json({ message: error.message });
    }
};


exports.joinRideshare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { rideshareId } = req.body;
      console.log(rideshareId);
      
      // Find the rideshare and check if seats are available
      const rideshare = await rideModel.findById(rideshareId);
      if (!rideshare) {
        return res.status(404).json({ message: 'Rideshare not found' });
      }
      const numericOtp = Math.floor(100000 + Math.random() * 900000).toString();
      // Update the rideshare with user information
      const updatedRide = await rideModel.findByIdAndUpdate(
        rideshareId,
        {
            user: req.user._id,
            status: 'pending',
            otp: numericOtp,
            fare: rideshare.pricePerSeat // Ensure fare is set from pricePerSeat
        },
        { 
            new: true,
            // Ensure all fields are populated
            populate: [
                { path: 'user', select: 'fullname profileImage' },
                { path: 'captain', select: 'fullname socketId vehicle' }
            ]
        }
    );
  
    if (!updatedRide) {
        return res.status(404).json({ message: 'Failed to update rideshare' });
    }
    const io = getIO();
    if (updatedRide.captain?.socketId) {
        io.to(updatedRide.captain.socketId).emit('new-ride', {
            event: 'new-ride',
            data: {
                ...updatedRide.toObject(),
                fare: updatedRide.fare,
                otp: updatedRide.otp
            }
        });
    }

    res.status(200).json(updatedRide);
    } catch (error) {
      console.error('Error joining rideshare:', error);
      res.status(500).json({ message: error.message });
    }
  };

exports.getAvailableRides = async (req, res) => {
    try {
      const availableRides = await rideModel.find({
        type: 'rideshare',
        status: 'available',
        departureTime: { $gt: new Date() }
      }).populate('captain');
      
      res.status(200).json(availableRides);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };