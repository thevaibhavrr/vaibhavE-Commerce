// getting token and saving in cookies

const sendToken = (user, statuscode, res) => {
  // geeting tokrn from user model to controller
  const token = user.getJWTToken();

  //   option for coookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statuscode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
