const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [20, "Name can not excied 20 charecter"],
    minLength: [4, "Name Should be more then 4 charecter"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    validate: [validator.isEmail, "Please enter valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your password"],
    minLength: [8, "Password Should be more then 8 charecter"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    // required: [true, "Please Enter Your role"],

    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
// 123 bkajbkihhh43b3#ijk
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// compare Password
userSchema.methods.comparePassword = async function (enterpassword) {
  return await bcrypt.compare(enterpassword, this.password);
};

// genrate forgot password
userSchema.methods.getResetPasswordtoken = function () {
  // gentrating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and haddding restpasswordToken to useSchema
  this.resetPasswordtoken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
