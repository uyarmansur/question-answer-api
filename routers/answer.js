const express = require("express")
const { getAccessToRoute, getAnswerOwnerAccess } = require("../middlewares/authorization/auth")

const { addNewAnswerToQuestion, getAllAnswerByQuestion, getSingleAnswer, editAnswer } = require("../controllers/answer")

const { checkQuestionAndAnswerExist } = require("../middlewares/database/databaseErrorHelpers")

const router = express.Router({ mergeParams: true })


router.post("/", getAccessToRoute, addNewAnswerToQuestion)
router.get("/", getAllAnswerByQuestion)
router.get("/:answer_id", checkQuestionAndAnswerExist, getSingleAnswer)
router.get("/:answer_id/edit", [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], editAnswer)


module.exports = router












