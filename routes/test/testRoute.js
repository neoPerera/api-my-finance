// homeRoute.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');

const pool = require("./../../Helpers/databaseHelper");
const {
  getMessaging,
  getToken,
  onMessage,
} = require("firebase-admin/messaging");
const { io } = require("socket.io-client");

//const cors = require('cors');
//app.use(cors);
require("dotenv").config();
const router = express.Router();
router.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'me@chanuthperera.com',
    pass: 'n30p3r3r4@zoho.COM',
  },
});

router.get("/", routeFunction);

async function routeFunction(req, res) {
  // const registrationToken = "dnOHtv7GOQhniSivYIblYV:APA91bFAQOF25-nryKa3LjDT1MhwaG6bXhLBQ0iC7RMZA8OKyxiRLHT7GSPGP7mzRq8iAMjF59F9C_wHNb4GSEKT9fQbJKSauecoS-v_3zVAGO1WoACxWogA2Se-1KC-yAQj9uQWxQPH";

  // const message = {
  //   data: {
  //     title: "Test Title",
  //     message: "Test Message",
  //   },
  //   token: registrationToken,
  // };

  // // Send a message to the device corresponding to the provided
  // // registration token.
  // getMessaging()
  //   .send(message)
  //   .then((response) => {
  //     // Response is a message ID string.
  //     console.log("Successfully sent message:", response);
  //   })
  //   .catch((error) => {
  //     console.log("Error sending message:", error);
  //   });

  // let socket = io(process.env.NOTIFICATION_API);
  // socket.emit("notification", {
  //   to_user: "chanuth",
  //   data: { title: "This is a test notification", message: "test" },
  // });
  // socket.on('notification',(props)=>{
  //   console.log("GOT MESSAGE==>"+ props);
  // });
  // socket.disconnect()

  const mailOptions = {
    from: 'me@chanuthperera.com',
    to: 'chanuthnilushan@gmail.com',
    subject: 'test',
    text: 'text',
    attachments: [
      {
        filename: 'CHA05214.JPG', // Change the filename as needed
        path: 'C:/Users/Chanuthp/Desktop/CHA05214.JPG', // Provide the correct path to your file
        // You can also use a Buffer or a stream instead of a file path
      },
    ],
  };

  // Send email
  await transporter.sendMail(mailOptions);
  res.status(200).json({ message: "Notification successful" });
}

module.exports = router;
