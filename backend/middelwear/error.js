const ErrorHander = require("../utils/errorHandel");

const errorHandel = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHander(message, 400);
  }

  // mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate Email Entered`;
    err = new ErrorHander(message, 400);
  }

  // Wrong JWT Error

  if (err.name === "JsonWebTokenError") {
    const message = `Json web Token is invalid , try again`;
    err = new ErrorHander(message, 400);
  } 

  // JWT Expire Error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is inavlid , try again`;
    err = new ErrorHander(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHandel;
