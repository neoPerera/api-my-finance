// homeRoute.js
const express = require("express");
const bodyParser = require("body-parser");
const pool = require("../../../../Helpers/databaseHelper");
//const cors = require('cors');
//app.use(cors);
require("dotenv").config();
const router = express.Router();

router.get("/", routeFunction);

async function routeFunction(req, res) {
  const client = await pool.connect();
  console.log(req.auth.username);
  try {
    // Begin the transaction
    const output = {};
    await client.query("BEGIN");

    // Call the stored procedure
    const rec = await client.query("CALL refsp_get_exm_sequence($1)", [output]);

    // const rec2 = await client.query(
    //   `fetch all in "${rec.rows[0].result_cursor}"`
    // );
    //console.log(rec2s);
    // Access the result as needed
    // const output_val = output;

    // Commit the transaction
    await client.query("COMMIT");

    // Send the forms as a response
    res.status(200).json(rec.rows[0]);
  } catch (error) {
    // Rollback the transaction on error
    await client.query("ROLLBACK");
    console.error("Error calling stored procedure:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    console.log("Client Release");
    client.release();
  }
 
}

module.exports = router;
