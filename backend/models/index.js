const Blog = require("../models/blogPostModelSQL");
const User = require("../models/userModelSQL");

Blog.sync();
User.sync();

module.exports = {
  Blog,
  User,
};
