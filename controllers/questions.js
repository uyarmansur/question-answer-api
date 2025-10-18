const getAllQuestions = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "All questions retrieved successfully",
  });
};

module.exports = {
  getAllQuestions,
};
