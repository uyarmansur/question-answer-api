const express = require("express");
const questions = require("./questions");
const auth = require("./auth");
const user = require("./user")
const routers = express.Router();

routers.use("/questions", questions);
routers.use("/auth", auth);
routers.use("/user", user)
module.exports = routers;
