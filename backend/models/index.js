const Blog = require("../models/blogPostModelSQL");
const User = require("../models/userModelSQL");

Blog.sync();
User.sync({ force: true });

module.exports = {
  Blog,
  User,
};
