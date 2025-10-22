const User = require("../models/Users")

const asyncErrorWrapper = require("express-async-handler");


const getSingleUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    console.log(id, "id")
    const user = await User.findById(id)

    return res.json({
        success: true,
        data: user
    })
})
const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find()

    return res.json({
        success: true,
        data: users
    })
})

module.exports = {
    getSingleUser, getAllUsers
}