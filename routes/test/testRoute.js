// homeRoute.js
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./../../Helpers/databaseHelper'); 
//const cors = require('cors');
//app.use(cors);
require('dotenv').config();
const router = express.Router();
router.use(bodyParser.json());

router.get('/', routeFunction);

function routeFunction(req,res){
  res.send({message: 'test'});
}

module.exports = router;
