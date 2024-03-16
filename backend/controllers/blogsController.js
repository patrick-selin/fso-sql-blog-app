// controller

const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
// const Blog = require("../models/blogPostModel");
const Blog = require("../models/blogPostModelSQL");
const User = require("../models/userModel");

blogsRouter.get("/", async (req, res) => {
  // mongodb
  // const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  // SQL
  const blogs = await Blog.findAll();
  res.json(blogs);
});

// POST new blog
blogsRouter.post("/", async (req, res) => {
  const body = req.body;
  const userFromToken = req.user;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  // console.log(`this is decodedToken : ${JSON.stringify(decodedToken)}`);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: userFromToken._id,
  });

  const savedBlog = await newBlog.save();
  // console.log(`this is savedBlog : ${JSON.stringify(savedBlog._id)}`);
  await savedBlog.populate("user", { id: 1, name: 1, username: 1 });

  userFromToken.blogPosts.concat(savedBlog._id);
  await userFromToken.save();

  res.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  const token = req.token;
  const userFromToken = req.user;
  console.log(`TOKEN: ${token}`);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!req.token && decodedToken.id) {
    return res.status(401).json({ error: "token invalid or not found" });
  }

  const blog = await Blog.findById(postId);
  console.log(`this is blog : ${JSON.stringify(blog)}`);

  if (!blog) {
    res.status(400).json({ error: "not found" });
  }

  if (blog.user.toString() === userFromToken.id.toString()) {
    await Blog.deleteOne({ _id: postId });
    res.sendStatus(204).end();
  } else {
    res.status(401).json({ error: "unauthorized operation" });
  }
});

blogsRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const blogPostData = req.body;
  // console.log(body);

  const updatedBlogPost = await Blog.findByIdAndUpdate(id, blogPostData, {
    new: true,
  }).populate("user", { username: 1, name: 1 });

  updatedBlogPost
    ? res.status(200).json(updatedBlogPost.toJSON())
    : res.status(404).end();
});

module.exports = blogsRouter;
