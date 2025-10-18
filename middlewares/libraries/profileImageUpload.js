const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/CustomError");

// Storage, FileFilter

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rootDirectory = path.dirname(require.main.filename);
    cb(null, path.join(rootDirectory, "/public/uploads"));
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    req.savedProfileImage = "image_" + req.user.id + "." + extension;
    cb(null, req.savedProfileImage);
  },
});

const fileFilter = (req, file, cb) => {
  let allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new CustomError("Please upload a valid image file", 400), false);
  }
  return cb(null, true);
};

const profileImageUpload = multer({ storage, fileFilter });

module.exports = profileImageUpload;
