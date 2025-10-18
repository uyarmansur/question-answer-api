const express = require("express");
const questions = require("./questions");
const auth = require("./auth");
const routers = express.Router();

routers.use("/questions", questions);
routers.use("/auth", auth);

module.exports = routers;
