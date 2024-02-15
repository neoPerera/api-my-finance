// homeRoute.js
const express = require("express");
const bodyParser = require("body-parser");
const pool = require("../../../Helpers/databaseHelper");
require("dotenv").config();
const router = express.Router();

router.get("/", routeFunction);

async function routeFunction(req, res) {
  const client = await pool.connect();
  try {
    // Begin the transaction
    const output = {};
    await client.query("BEGIN");

    // Call the stored procedure
    const rec = await client.query("CALL refsp_get_acc_list($1,$2)", [req.auth.username,output]);

    const rec2 = await client.query(
      `fetch all in "${rec.rows[0].result_cursor}"`
    );
    console.log(rec2.rows);

    // Commit the transaction
    await client.query("COMMIT");

    // Send the forms as a response
    res.status(200).json(rec2.rows);
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
