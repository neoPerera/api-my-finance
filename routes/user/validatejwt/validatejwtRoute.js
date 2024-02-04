// homeRoute.js
const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
// const pool = require('./../../Helpers/databaseHelper');
require('dotenv').config();
const router = express.Router();

router.get('/', routeGet);

function routeGet(req, res) {
    console.log("JWT VALIDATION ROUTE");
    res.status(200).send({isValid:true});
    // setTimeout(() => {
    //     //(); // Pass control to the next middleware or route handler after 2 seconds
    //     res.status(200).send({isValid:true}); // Return status 200
    
    // }, 2000)
    
}

module.exports = router;

