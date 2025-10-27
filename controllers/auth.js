const User = require("../models/Users");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenhelpers");
const {
  validateInputHelper,
  comparePasswords,
} = require("../helpers/input/validateInputHelper.js");

const sendEmail = require('../helpers/libraries/sendEmail.js')

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

  const resetEmail = req.body.email
  const user = await User.findOne({ email: resetEmail })
  if (!user) {
    return next(new CustomError("There is no user with this email", 400));
  }


  const resetPasswordToken = user.getResetPasswordTokenFromUser();
  await user.save({ validateBeforeSave: false });



  const resetPasswordUrl = `http://localhost:5000/api/auth/resetPassword?resetPasswordToken=${resetPasswordToken}`

  const emailTemplate = `
  <h3>Reset Your Password</h3>
  <p>This <a href='${resetPasswordUrl}' target='_blank'>link</a> will expire in 1 hour</p>
  `;
  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "Reset Your Password",
      html: emailTemplate
    });
    return res.status(200).json({
      success: true,
      message: "Reset password token sent to email",
    })
  } catch (err) {
    console.error("💥 Email gönderim hatası:", err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false })

    return next(new CustomError("Email could not be sent!", 500))
  }

});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query
  const { password } = req.body

  if (!resetPasswordToken) {
    return new CustomError("Please provide a valid token", 400)
  }

  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    //gt = greater than which comes from monfoDB
    resetPassswordExpire: { $gt: Date.now() }
  })

  if (!user) {
    return next(new CustomError("INvalid token or session expired", 404))
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined
  user.save({ validateBeforeSave: true })
  return res.json({
    success: true,
    message: "Reset password process successful"
  })
})

const editDetails = asyncErrorWrapper(async (req, res, next) => {
  const editInformation = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, editInformation, { new: true, runValidators: true })

  res.status(200).json({
    success: true,
    data: user
  })
})


module.exports = {
  register,
  getuser,
  login,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
  editDetails
};
