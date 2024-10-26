// Creating Routes
const express = require("express");

const {
  availableSeats,
  bookSeats,
  clearSeats,
} = require("../controller/bookSeat");

const router = new express.Router();

router.get("/available", availableSeats);
router.post("/book-seats", bookSeats);
router.post("/clear-seats", clearSeats);
module.exports = router;
