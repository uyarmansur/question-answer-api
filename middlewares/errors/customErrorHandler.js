const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let customErr = err;

  if (err.name === "SyntaxError") {
    customErr = new CustomError("Invalid JSON syntax", 400);
  }
  if (err.name === "ValidationError") {
    customErr = new CustomError(err.message, 400);
  }
  res.status(customErr.status || 500).json({
    success: false,
    message: customErr.message || "Internal Server Error",
  });
};

module.exports = customErrorHandler;
