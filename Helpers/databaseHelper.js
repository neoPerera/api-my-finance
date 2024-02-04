// databaseHelper.js
const { Pool } = require('pg');
require('dotenv').config();

let pool; // Declare the pool variable outside the try block

try {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false, // Adjust based on your security requirements
        },
    });
} catch (error) {
    console.error('Error creating the database pool:', error);
}

module.exports = pool;
