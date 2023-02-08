const ErrorHander = require("../utils/errorHandel");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/usermodel");

const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHander("Please login to access this resource", 401));
  } else {
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodeData.id);
    next();
  }
});

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role : ${req.user.role} is not allowed to access this resouces`,
          403
        )
      );
    }
  next();
  };
};

module.exports = { isAuthenticatedUser, authorizeRole };
