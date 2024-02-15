// homeRoute.js
const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./../../Helpers/databaseHelper");
require("dotenv").config();
const router = express.Router();

router.get("/", routeGet);

async function routeGet(req, res) {
  const client = await pool.connect();
  try {
    // Begin the transaction
    const output = {};
    const dataObject = {
      chart1: [],
      chart2: [],
      chart3: [],
      chart4: [],
      chart4_cols: [],
    };
    await client.query("BEGIN");

    // Call the stored procedure
    const rec = await client.query(
      "CALL dashsp_get_dashbaord($1, $2,$3,$4,$5)",
      [req.auth.username, output, output, output, output]
    );

    var rec2 = await client.query(
      `fetch all in "${rec.rows[0].result_cursor1}"`
    );
    dataObject.chart1.push(
      rec2.rows.map((row) => {
        // Convert numerical values from string to number
        return {
          ...row,
          // Assuming 'value' is the key for the numerical value, modify it accordingly
          value: parseFloat(row.value),
          // Add more keys if needed
        };
      })
    );

    rec2 = await client.query(`fetch all in "${rec.rows[0].result_cursor2}"`);
    dataObject.chart2.push(
      rec2.rows.map((row) => {
        // Convert numerical values from string to number
        return {
          ...row,
          // Assuming 'value' is the key for the numerical value, modify it accordingly
          value: parseFloat(row.value),
          // Add more keys if needed
        };
      })
    );

    rec2 = await client.query(`fetch all in "${rec.rows[0].result_cursor3}"`);
    dataObject.chart3.push(
      rec2.rows.map((row) => {
        // Convert numerical values from string to number
        return {
          ...row,
          // Assuming 'value' is the key for the numerical value, modify it accordingly
          value: parseFloat(row.value),
          // Add more keys if needed
        };
      })
    );

    rec2 = await client.query(`fetch all in "${rec.rows[0].result_cursor4}"`);
    dataObject.chart4.push(
      rec2.rows.map((row) => {
        // Convert numerical values from string to number
        return {
          ...row,
          // Assuming 'value' is the key for the numerical value, modify it accordingly
          int_amount: parseFloat(row.int_amount),
          // Add more keys if needed
        };
      })
    );

    var balance = 0;
    rec2.rows.map((row) => {
      balance = balance + parseFloat(row.int_amount);
      // Add more keys if needed
    });

    // dataObject.chart4.push(balance);

    dataObject.chart4_cols.push(Object.keys(rec2.rows));

    // Commit the transaction
    await client.query("COMMIT");

    //additional testing
    const rows = rec2.rows;

    // Create an array to store objects with account names and balances
    const accountBalancesArray = [];

    // Iterate through rows and update balances
    rows.forEach((row) => {
      if ("account" in row && "int_amount" in row) {
        const account = row.account;
        const amount = parseFloat(row.int_amount);

        // Find the index of the account in the array
        const index = accountBalancesArray.findIndex(
          (item) => item.account_name === account
        );

        // Update balance for the current account or add a new object
        if (index !== -1) {
          accountBalancesArray[index].account_balance += amount;
        } else {
          accountBalancesArray.push({
            account_name: account,
            account_balance: amount,
          });
        }
      }
    });

    dataObject.chart4.push(accountBalancesArray);

    // Log the array of objects
    console.log(accountBalancesArray);

    // Send the forms as a response
    res.status(200).json(dataObject);
  } catch (error) {
    // Rollback the transaction on error
    await client.query("ROLLBACK");
    console.error("Error calling stored procedure:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    console.log("Client Release");
    client.release();
  }

  //res.send({message: 'test'});
}

module.exports = router;
