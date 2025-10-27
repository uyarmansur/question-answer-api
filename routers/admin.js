const express = require('express')

const { getAccessToRoute, getAdminAccess } = require("../middlewares/authorization/auth")
const { blockUser,deleteUser } = require('../controllers/admin')
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers.js")
const router = express.Router()



// Block User


router.use([getAccessToRoute, getAdminAccess])
router.get("/block/:id", checkUserExist, blockUser)
router.get("/delete/:id", checkUserExist, deleteUser)

module.exports = router