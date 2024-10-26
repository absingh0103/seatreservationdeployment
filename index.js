const express = require("express");
const cors = require("cors");
const BookSeatRouter = require("./Router/BookSeat");
const app = express();
app.use(express.json());
app.use(cors());
const path=require("path")
const config = require("dotenv").config;
config({ path: "./config/config.env" });
require("./dbConnection/connection");
// All Routes
app.use("/seats", BookSeatRouter);

// Deployment
app.use(express.static(path.join(__dirname,"./client/dist")));
app.get("*",function(_,resp){
  resp.sendFile(path.join(__dirname,"./client/dist/index.html"),function(err){
    resp.status(500).send(err);
  })
})

app.listen(process.env.PORT || 8080, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
