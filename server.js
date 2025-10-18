const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routers/index");
const { connectDatabase } = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler.js");
const path = require("path");
//environment variables
dotenv.config({ path: "./config/env/config.env" });

//MongoDB connection
connectDatabase();
//
const app = express();
const port = process.env.PORT;
//json body parser
app.use(express.json());
//routers middleware
app.use("/api", routers);
app.use(customErrorHandler);

app.get("/", (req, res) => {
  res.send("Hello Bbba, World!");
});

//STATIC FILES
app.use(express.static(path.join(__dirname,"public")))

app.listen(port, () => {
  console.log(`Server is running on port ${port}:${process.env.NODE_ENV}`);
});
