const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.all("*", (req, res, next) => {
  // all for all http method (get, post, patch, ... )
  next((`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
