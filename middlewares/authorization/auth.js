const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler")
const jwt = require("jsonwebtoken");
const User = require("../../models/Users")
const Question = require('../../models/Question')
const Answer = require("../../models/Answer");

const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../helpers/authorization/tokenhelpers");


const getAccessToRoute = (req, res, next) => {
  const { JWT_SECRET_KEY } = process.env;
  console.log(JWT_SECRET_KEY, "jwtsecret")


  if (!isTokenIncluded(req)) {
    console.log(req?.headers?.authorization?.split(" ")[1], "token bu");
    return next(
      new CustomError("You are not authorized to access this route", 401)
    );
  }

  const accessToken = getAccessTokenFromHeader(req);
  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(req.headers.authorization.split(" ")[1], "tokenla");
      console.log(err, "error");
      return next(
        new CustomError("you are not authorized to access this route", 401)
      );
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    next();
  });
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {

  const { id } = req.user;

  const user = await User.findById(id)
  if (user.role !== "admin") {
    return next(new CustomError("Only admin can access here", 403))
  }
  next()
})

const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {

  const userId = req.user.id;
  const questionId = req.params.id;

  const question = await Question.findById(questionId)

  if (question.user != userId) {
    return next(new CustomError("Only owner of this question can make changes", 403))
  }

  next()
})

const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {

  const userId = req.user.id;
  const answerId = req.params.id;

  const answer = await Answer.findById(answerId)

  if (answer.user != userId) {
    return next(new CustomError("Only owner of this answer can make changes", 403))
  }

  next()
})


module.exports = {
  getAccessToRoute,
  getAdminAccess,
  getQuestionOwnerAccess,
  getAnswerOwnerAccess
};
