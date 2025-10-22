const express = require('express')
const { getSingleUser,getAllUsers } = require("../controllers/user.js")
const router = express.Router()
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers.js")


router.get("/getAll",getAllUsers)
router.get("/:id", checkUserExist, getSingleUser)

module.exports = router