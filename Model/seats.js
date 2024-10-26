const mongoose = require("mongoose");
const seatSchema = new mongoose.Schema({
  seatNumber: Number,
  isBooked: { type: Boolean, default: false },
});

const Seat =new mongoose.model("Seat", seatSchema);

module.exports = Seat;
