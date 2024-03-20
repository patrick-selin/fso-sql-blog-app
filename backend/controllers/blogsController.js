// controller
const blogsRouter = require("express").Router();
const { Blog, User } = require("../models");
const { blogFinder } = require("../utils/middleware");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["id", "name", "username"],
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
  const user = await User.findByPk(req.decodedToken.id);
  // console.log(`USER is :::: ${user}`);
  const blog = await Blog.create({ ...req.body, userId: user.id });

  return res.json(blog);
});

blogsRouter.delete("/:id", blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).send({ error: "Blog not found" });
  }

  if (req.blog.userId !== req.user.id) {
    return res.status(401).send({ error: "Unauthorized to delete this blog" });
  }

  await req.blog.destroy();
  res.status(204).end();
});

blogsRouter.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    const updatedBlog = await req.blog.update({ likes: req.body.likes });
    res.json(updatedBlog);
  }
  res.status(404).end();
});

module.exports = blogsRouter;
