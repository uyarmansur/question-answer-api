const express = require("express");
const { askNewQuestion, getAllQuestions, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion, undoQuestion } = require("../controllers/questions");

const { getAccessToRoute, getQuestionOwnerAccess } = require("../middlewares/authorization/auth");
const { checkQuestionExist } = require("../middlewares/database/databaseErrorHelpers");

const router = express.Router();


router.get(':id/like', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], likeQuestion)
router.get(':id/undo_like', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], undoQuestion)
router.get("/", getAllQuestions);
router.get("/:id", checkQuestionExist, getSingleQuestion);
router.post("/ask", getAccessToRoute, askNewQuestion);
router.put("/:id/edit", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);
router.delete("/:id/delete", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion)



module.exports = router;



