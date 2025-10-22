const User = require("../../models/Users")
const CustomError = require("../../helpers/error/CustomError")
const asyncErrorWrapper = require("express-async-handler")

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params

    const user = await User.findById()

    if (!user) {
        return next(new CustomError("User is not exist"), 400)
    }
    next()

})

module.exports = {
    checkUserExist
}