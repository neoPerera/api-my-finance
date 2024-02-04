// authenticateUser.js
const { Pool } = require('pg');
require('dotenv').config();

async function authenticateUser(username, password) {
  try {
    // Connect to the database
    const user_pool = new Pool({
      user: username,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: password,
      port: 5432, // default PostgreSQL port
      ssl: true,
    });

    // Attempt to connect to the database
    try {
      const client = await user_pool.connect();
      console.log('Connection test successful');
      client.release();
      client.end();
      console.log('Authentication successful');
    return true;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }

  } catch (error) {
    console.error('Error during user authentication:', error);
    return false;
  }
}

module.exports = authenticateUser;
