const User = require("../models/Users");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenhelpers");
const {
  validateInputHelper,
  comparePasswords,
} = require("../helpers/input/validateInputHelper.js");

const CustomError = require("../helpers/error/CustomError");

const register = asyncErrorWrapper(async (req, res, next) => {
  const { name, email, password, role, profile_image, blocked } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
    profile_image,
    blocked,
  });
  sendJwtToClient(user, res);
});

const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!validateInputHelper(email, password)) {
    return next(
      new CustomError("Please provide valid email and password", 400)
    );
  }
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!comparePasswords(password, user.password)) {
    return next(new CustomError("password is incorrect", 400));
  }

  return sendJwtToClient(user, res, "User logged in successfully")
});

const getuser = (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
    },
  });
};

const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;
  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profile_image: req.savedProfileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Profile image uploaded successfully",
    data: user,
  });
});


const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const user = await user.findOne({ email: req.body.mail })

  if (!user) {
    return next(new CustomError("There is no user with this email", 400));
  }


  const resetPasswordToken = user.getResetPasswordTokenFromUser();
  await user.save();


  res.json({
    success: true,
    message: "Reset password token sent to email",
    data: resetPasswordToken,
  })
});

module.exports = {
  register,
  getuser,
  login,
  logout,
  imageUpload,
  forgotPassword,
};
