// homeRoute.js
const express = require('express');
const jwtMiddleware = require('../../Helpers/JWTMiddleware');
const router = express.Router();
require('dotenv').config();

 
router.get('/', (req, res) => {
  res.send({message: 'Home'});
});

module.exports = router;
