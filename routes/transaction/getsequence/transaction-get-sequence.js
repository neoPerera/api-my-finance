// homeRoute.js
const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./../../../Helpers/databaseHelper");
//const cors = require('cors');
//app.use(cors);
require("dotenv").config();
const router = express.Router();

router.get("/", routeFunction);

async function routeFunction(req, res) {
  const client = await pool.connect();
  console.log(req.auth.username);
  console.log(req.query);
  if (req.query.type == "id") {
    try {
      // Begin the transaction
      const output = {};
      const dataObject = {
        sequence_id: "",
        trans_types: [],
        accounts: []
      };
      await client.query("BEGIN");

      // Call the stored procedure
      const rec = await client.query("CALL refsp_get_trn_sequence($1,$2,$3,$4)", [req.auth.username,output,output,
        output,
      ]);

      const rec2 = await client.query(
        `fetch all in "${rec.rows[0].result_cursor1}"`
      );
      dataObject.trans_types.push(rec2.rows);
      const rec3 = await client.query(
        `fetch all in "${rec.rows[0].result_cursor2}"`
      );
      dataObject.accounts.push(rec3.rows);
      dataObject.sequence_id =rec.rows[0].output_value;


      await client.query("COMMIT");

      // Send the forms as a response
      
      
      res.status(200).json(dataObject);
    } catch (error) {
      // Rollback the transaction on error
      await client.query("ROLLBACK");
      console.error("Error calling stored procedure:", error);
      res.status(500).json({ error });
    } finally {
      console.log("Client Release");
      client.release();
    }
  } else {
    res.status(500).json({ error: "Incorrect Query" });
  }
}

module.exports = router;
