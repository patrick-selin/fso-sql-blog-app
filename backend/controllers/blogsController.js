// controller
const blogsRouter = require("express").Router();
const { Blog, User } = require("../models");
const { blogFinder } = require("../utils/middleware");
const { Op } = require("sequelize");

blogsRouter.get("/", async (req, res) => {
  const where = {};

  // search blogs
  if (req.query.search) {
    const queryTerm = `%${req.query.search}%`;

    where[Op.or] = [
      { title: { [Op.iLike]: queryTerm } },
      { author: { [Op.iLike]: queryTerm } },
    ];
  }

  // get all blogs
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["id", "name", "username"],
    },
    order: [["likes", "DESC"]],
    where,
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

  console.log(`BLOG is :::: ${JSON.stringify(req.body)}`);
  return res.json(blog);
});

blogsRouter.delete("/:id", blogFinder, async (req, res) => {
  console.log(`huu is :::: ${JSON.stringify(req.blog)}`);
  if (!req.blog) {
    return res.status(404).send({ error: "Blog not found" });
  }

  if (req.blog.userId !== req.decodedToken.id) {
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
