const express = require('express');
const loadRouters = require('./loadRoutes'); // Adjust the path accordingly
const logger = require('./Helpers/logger');
var { expressjwt: jwt } = require("express-jwt");
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
// Other configurations...
app.use(
  jwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
  }).unless({ path: ["/api/login", "/api/jobs"] })
);
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

loadRouters(app);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
