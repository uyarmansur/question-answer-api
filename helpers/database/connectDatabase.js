const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
    });
};

module.exports = {
  connectDatabase,
};
