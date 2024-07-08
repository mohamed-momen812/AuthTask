const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const AppError = require('./utils/appError');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public'))); //path.join takes multiple path segments as arguments and joins them into a single path. It ensures that the correct path separators (/ or \) are used, depending on the operating system.

app.use('/api/auth', authRoutes);

// If url can't reach eny of above route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Error handeler route is the last part of route
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Operational error: send message to clint
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) Log error
    console.error('Error:', err.name);

    // 2) Send error
    res.status(500).json({
      stats: 'error',
      message: 'Something went very wrong!',
    });
  }
});

module.exports = app;
