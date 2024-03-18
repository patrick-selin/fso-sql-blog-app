// controller

const blogsRouter = require("express").Router();
// const jwt = require("jsonwebtoken");
// const Blog = require("../models/blogPostModel");
const Blog = require("../models/blog");
const { blogFinder } = require("../utils/middleware");
// const User = require("../models/userModel");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.findAll();

  console.log(JSON.stringify(blogs));
  res.json(blogs);
});

blogsRouter.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

// POST new blog
blogsRouter.post("/", async (req, res) => {
  console.log("huu");
  const blog = await Blog.create(req.body);
  console.log(blog);
  return res.json(blog);
});

blogsRouter.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

blogsRouter.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    const updatedBlog = await req.blog.update({ likes: req.body.likes });
    res.json(updatedBlog);
  }
  res.status(404).end();
});

module.exports = blogsRouter;
