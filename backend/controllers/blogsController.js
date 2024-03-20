// controller

const blogsRouter = require("express").Router();
// const Blog = require("../models/blogPostModel");
const { Blog, User } = require("../models");
const { blogFinder } = require("../utils/middleware");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
    },
  });

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
//
blogsRouter.post("/", async (req, res) => {
  console.log(`REG.TOKEN:::: ${JSON.stringify(req.token)}`);

  const user = await User.findByPk(req.user.id);
  console.log(`USER is :::: ${user}`);
  const blog = await Blog.create({ ...req.body, userId: req.user.id });
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
