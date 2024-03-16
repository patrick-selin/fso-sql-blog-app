const Blog = require("../models/blogPostModelSQL");

Blog.sync();

module.exports = {
  Blog,
};
