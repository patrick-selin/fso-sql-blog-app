const config = require("./utils/config");
//
const express = require("express");
const app = express();
const cors = require("cors");
require("express-async-errors");
//
const blogsRouter = require("./controllers/blogsController");
const usersRouter = require("./controllers/usersController");
const loginRouter = require("./controllers/loginController");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
//
const { connectDatabase, disconnectDatabase } = require("./utils/db");

const connectToDb = async () => {
  await connectDatabase();
};

connectToDb();
//

logger.info("connecting to MongoDB...");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });
//

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.morganLogs);
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);
//
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
//
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testingController");
  app.use("/api/testing", testingRouter);
}
//
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.on("close", () => {
  disconnectDatabase();
});

module.exports = app;
