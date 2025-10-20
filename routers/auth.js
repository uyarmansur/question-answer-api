const express = require("express");
const {
  register,
  getuser,
  login,
  logout,
  imageUpload,
  forgotPassword,
} = require("../controllers/auth");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");
const router = express.Router();

router.post("/register", register);
router.get("/profile", getAccessToRoute, getuser);
router.post("/login", login);
router.get("/logout", getAccessToRoute, logout);
router.post(
  "/upload",
  [getAccessToRoute, profileImageUpload.single("profile_image")],
  imageUpload
);
router.post("/forgotPassword", forgotPassword);
module.exports = router;
