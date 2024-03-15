const testingRouter = require("express").Router();
const Blog = require("../models/blogPostModel");
const User = require("../models/userModel");

testingRouter.post("/reset", async (req, res) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

module.exports = testingRouter;
