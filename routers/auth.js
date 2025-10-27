const express = require("express");
const {
  register,
  getuser,
  login,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
  editDetails
} = require("../controllers/auth");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post(
  "/upload",
  [getAccessToRoute, profileImageUpload.single("profile_image")],
  imageUpload
);
router.get("/profile", getAccessToRoute, getuser);
router.get("/logout", getAccessToRoute, logout);

router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);
router.put("/edit", getAccessToRoute, editDetails)
module.exports = router;
