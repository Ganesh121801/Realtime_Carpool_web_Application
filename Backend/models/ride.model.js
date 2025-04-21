const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required:false
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "captain",
    required: function () {
      return this.type !== "regular";
    },
  },
  type: {
    type: String,
    enum: ["regular", "rideshare"],
    default: "regular",
  },
  pickup: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required:true,
    min:0
  },

  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "ongoing",
      "completed",
      "cancelled",
      "available",
    ],
    default: function() {
      return this.type === 'rideshare' ? 'available' : 'pending';
    },
  },

  duration: {
    type: Number,
  }, // in seconds

  distance: {
    type: Number,
  }, // in meters

  paymentID: {
    type: String,
  },
  orderId: {
    type: String,
  },
  signature: {
    type: String,
  },

  otp: {
    type: String,
    required: function () {
      return this.type !== "rideshare";
    },
  },
  // Add rideshare specific fields
  maxPassengers: {
    type: Number,
    required: function () {
      return this.type === "rideshare";
    },
  },
  pricePerSeat: {
    type: Number,
    required: function () {
      return this.type === "rideshare";
    },
  },
  departureTime: {
    type: Date,
    required: function () {
      return this.type === "rideshare";
    },
  },
});

module.exports = mongoose.model("ride", rideSchema);
