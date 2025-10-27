const express = require("express");
const questions = require("./questions");
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin")
const routers = express.Router();

routers.use("/questions", questions);
routers.use("/auth", auth);
routers.use("/user", user);
routers.use("/admin", admin);
module.exports = routers;
