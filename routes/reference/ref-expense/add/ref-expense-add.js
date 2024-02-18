// ref-expense-add.js
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./../../../../Helpers/databaseHelper'); 
//const cors = require('cors');
//app.use(cors);

require('dotenv').config();
const router = express.Router();
router.use(bodyParser.json());
router.post('/', routeFunction);

async function routeFunction(req,res){
  //refsp_insert_expense_master
  console.log(req.body);
  const client = await pool.connect();
  try {
    // Begin the transaction
    const output = {};
    
    await client.query("BEGIN");

    // Call the stored procedure
    const rec = await client.query("CALL refsp_insert_expense_master($1, $2)", [req.body.strId, req.body.strName]);

    // const rec2 = await client.query(
    //   `fetch all in "${rec.rows[0].result_cursor}"`
    // );
    //console.log(rec2s);
    // Access the result as needed
    // const output_val = output;

    // Commit the transaction
    await client.query("COMMIT");

    // Send the forms as a response
    res.status(200).json({isValid: true});
  } catch (error) {
    // Rollback the transaction on error
    await client.query("ROLLBACK");
    console.error("Error calling stored procedure:", error);
    res.status(500).json({ isValid: false, error});
  } finally {
    console.log("Client Release");
    client.release();
  }
}

module.exports = router;
