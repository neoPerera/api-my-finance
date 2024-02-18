// loginRouter.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./../../Helpers/databaseHelper');
const authenticateUser = require('../../Helpers/authenticateUser');
const jwt = require('jsonwebtoken');

const router = express.Router();
router.use(cors());
router.use(bodyParser.json());

router.get('/', (req, res) => {
  res.send({ message: 'login' });
});

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const authenticate = await authenticateUser(username.toLowerCase(), password);

    if (authenticate) {
      // Authentication successful, generate a JWT token
      const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
      console.log(`${username} was successfully logged in!`);
      res.status(200).json({ message: 'Login successful', token });
    } else {
      // Authentication failed
      res.status(401).json({ message: 'Login unsuccessful' });
    }

  } catch (error) {
    console.error('Error executing login query:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
