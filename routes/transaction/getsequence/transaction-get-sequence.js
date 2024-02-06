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
      await client.query("BEGIN");

      // Call the stored procedure
      const rec = await client.query("CALL refsp_get_trn_sequence($1)", [
        output,
      ]);

      // const rec2 = await client.query(
      //   `fetch all in "${rec.rows[0].result_cursor}"`
      // );
      //console.log(rec2s);
      // Access the result as needed
      // const output_val = output;

      // Commit the transaction
      await client.query("COMMIT");

      // Send the forms as a response
      const dataObject = {
        sequence_id: "",
        trans_types: []
      };
      dataObject.sequence_id =rec.rows[0].output_value;
      dataObject.trans_types.push({value:"INC",label:"Income"});
      dataObject.trans_types.push({value:"EXP",label:"Expense"});
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
