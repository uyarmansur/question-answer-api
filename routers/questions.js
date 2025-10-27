const express = require("express");
const { askNewQuestion } = require("../controllers/questions");

const { getAccessToRoute } = require("../middlewares/authorization/auth")

const router = express.Router();

router.post("/ask", getAccessToRoute, askNewQuestion);

module.exports = router;
