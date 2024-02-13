// homeRoute.js
const express = require("express");
const bodyParser = require("body-parser");
const pool = require("../../Helpers/databaseHelper");
const { io } = require("socket.io-client");

//const cors = require('cors');
//app.use(cors);
require("dotenv").config();
const router = express.Router();
router.use(bodyParser.json());

router.post("/", routeFunction);

function routeFunction(req, res) {
   
  // socket.disconnect()
  res.status(200).json({ message: "Notification successful" });
}

module.exports = router;
