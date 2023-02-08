const ErrorHander = require("../utils/errorHandel");
const catchAyncErrors = require("../middelwear/catchAsyncError");
const User = require("../model/usermodel");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");
// const sendEmail = require('../utils/sendEmail')

// Register a User
const RegisterUser = catchAyncErrors(async (req, res, next) => {
  // req.body.user=req.user.id
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
    // avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    avatar: { public_id: "public id", url: "simple url" },
  });
  // const token = user.getJWTToken();
  // res.status(201).json({
  //   success: true,
  //   token,
  // });
  sendToken(user, 201, res);
});

// login
const Loginuser = catchAyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHander("please Enter valid Email & Password", 400));
  } else {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHander("invalid email", 401));
    }
    const ispasswordMatch = await user.comparePassword(password);
    if (!ispasswordMatch) {
      return next(new ErrorHander("invalid  password", 401));
    }
    // const token = user.getJWTToken();
    // res.status(200).json({
    //   success: true,
    //   token,
    // });
    sendToken(user, 200, res);
  }
});

// logout
// const Logout = catchAyncErrors(async(req,res,next)=>{

//   await res.c

//   res.status(200).json({
//     succes :  true,
//     message:"Logged Out"
//   })
// })
const Logout = async (req, res) => {
  await res.clearCookie("token", { path: "/" });
  await res.status(200).send("user logout");
};

// Get user Details

const UserDetails = catchAyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    sucess: true,
    user,
  });
});

// update password

const UpdatUserPassword = catchAyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const ispasswordMatch = await user.comparePassword(req.body.oldPassword);
  if (!ispasswordMatch) {
    return next(new ErrorHander("old Password is invalid", 400));
  }
  if (req.body.newPassword !== req.body.confimPassword) {
    return next(new ErrorHander("Password did not matched", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// update Profile

const UpdatUserProfile = catchAyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ succes: true, user });
});

// get all User details -Admin
const GetAllUser = catchAyncErrors(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    succes: true,
    user,
  });
});

// get Single User details -Admin
const GetsingleUser = catchAyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHander(`User does not exist with id ${req.params.id}`)
    );
  }
  res.status(200).json({
    succes: true,
    user,
  });
});

// update user role --Admin
const UpdatUserrolebyadmin = catchAyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ succes: true, user });
});

// Deleter user user role --Admin
const DeleteUservyAdmin = catchAyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with id :${req.params.id}`)
    );
  }

  await user.remove();

  res
    .status(200)
    .json({ succes: true, message: "user Delete sucesfull", user });
});

module.exports = {
  RegisterUser,
  Logout,
  Loginuser,
  //  ForgotPassword
  UserDetails,
  UpdatUserPassword,
  UpdatUserProfile,
  GetAllUser,
  GetsingleUser,
  UpdatUserrolebyadmin,
  DeleteUservyAdmin,
};

/*
// forgot pass
const ForgotPassword = catchAyncErrors(async(req,res,next)=>{
  const user = await User.findOne({email : req.body.email})

  if(!user){
    return next(new ErrorHander("User not found",404))
  }

  // get ResetPassword Token
const resetToken =   user.getResetPasswordtoken()
await user.save({validateBeforeSave:false})

const resetpasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

const message = `Your Password reset token is :- \n\n %{resetpasswordURL} \n\n If you have not requested this email the, ignore it `;
try{
  await sendEmail({
    email : user.email,
    subject : `Ecomerce Password Recovery`,
    message
  })
  res.status(200).json({
    success : true ,
    message  : `Email sent to ${user.email} successfully`
  })

}catch(error){
  user.resetPasswordToken= undefined;
  user.resetPasswordExpire = undefined
await user.save({ validateBeforeSave: false });

return next(new ErrorHander(error.message,500))
// return next(
//   res.json(error)
// );

}

})
*/
