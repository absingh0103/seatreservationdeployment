const Seat = require("../Model/seats");

// Get All The Available In This Coach
// Return Both Booked and Unbooked

exports.availableSeats = async (req, res) => {
  const seats = await Seat.find().sort({ seatNumber: 1 });
  res.json(seats);
};

// Route To Book Seats
exports.bookSeats = async (req, res) => {
  // Get No of Seats User Want To BOOK
  const { numSeats } = req.body;
  // Maximum A User Can Book 7 seats at a time
  if (numSeats < 1 || numSeats > 7) {
    return res
      .status(400)
      .json({ message: "You can book between 1 and 7 seats at a time." });
  }

  // This bookedSeats Array Stores The SeatNumber That Is Booked In Each Request So That It get Returned to Frontend To
  // Display User
  const bookedSeats = [];

  // Try to book seats in a single row first
  // get No Of Rows  ceil() 80/7 = 12 Rows

  const rows = Math.ceil(80 / 7); // 11 Rows With 7 Seats Ans 12th Row With 3 Seats
  let rowFound = false; // to mark whether a Row Found With Sufficient Empty Seats

  // iterate Over Each Row
  for (let row = 0; row < rows; row++) {
    const rowSeats = await Seat.find({
      // get seats In A Partcular Row
      //Example => check in First Row Whether 6 seats Are Available or Not
      // gte 0*7+1 less then eq 0*7+7  => 1 to 7  and booked stats =false
      // Return Only upto limit of reuested Seats
      seatNumber: { $gte: row * 7 + 1, $lte: row * 7 + 7 },
      isBooked: false,
    })
      .sort({ seatNumber: 1 })
      .limit(numSeats);
    //here we Sort The Data So That We First Occupy Lower No Seats So That It Match With Ui Update
    // seats Found
    if (rowSeats.length === numSeats) {
      // Book all seats in this row
      for (const seat of rowSeats) {
        seat.isBooked = true;
        await seat.save();
        // Put The Seat Number In bookedSeatsArray So that We Send It To Frontend
        bookedSeats.push(seat.seatNumber);
      }
      // Mark it As Aready Found And Booked Seats
      rowFound = true;
      break;
    }
  }

  // If Request Seats Not Found In A Single Row
  // then book closest available seats in Multiple Rows

  if (!rowFound) {
    // Check For Whether requested No Of Seats Are Availabe In Multiple Rows Or Not
    // If Available retuurn Those Seats
    const availableSeats = await Seat.find({ isBooked: false }).limit(numSeats);
    if (availableSeats.length < numSeats) {
      return res.status(400).json({ message: "Not enough seats available." });
    }
    // Book Seats
    for (const seat of availableSeats) {
      seat.isBooked = true;
      await seat.save();
      // Store Seat No TO BookSeat Array
      bookedSeats.push(seat.seatNumber);
    }
  }
  // Send The Booked Seat Number To Frontend To Update The UI
  res.json({ bookedSeats });
};

// Route to clear all seats To Recheck Functionality
exports.clearSeats = async (req, res) => {
  await Seat.updateMany({}, { isBooked: false });
  res.json({ message: "All seats have been reset to available." });
};
