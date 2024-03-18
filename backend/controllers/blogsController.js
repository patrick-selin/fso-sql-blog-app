// controller

const blogsRouter = require("express").Router();
// const jwt = require("jsonwebtoken");
// const Blog = require("../models/blogPostModel");
const Blog = require("../models/blogPostModelSQL");
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

  // mongoDB
  // const body = req.body;
  // const userFromToken = req.user;

  // const decodedToken = jwt.verify(req.token, process.env.SECRET);
  // // console.log(`this is decodedToken : ${JSON.stringify(decodedToken)}`);
  // if (!decodedToken.id) {
  //   return res.status(401).json({ error: "token invalid" });
  // }

  // const newBlog = new Blog({
  //   title: body.title,
  //   author: body.author,
  //   url: body.url,
  //   likes: body.likes,
  //   user: userFromToken._id,
  // });

  // const savedBlog = await newBlog.save();
  // // console.log(`this is savedBlog : ${JSON.stringify(savedBlog._id)}`);
  // await savedBlog.populate("user", { id: 1, name: 1, username: 1 });

  // userFromToken.blogPosts.concat(savedBlog._id);
  // await userFromToken.save();

  // res.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }

  // mongoDB
  // const postId = req.params.id;
  // const token = req.token;
  // const userFromToken = req.user;
  // console.log(`TOKEN: ${token}`);

  // const decodedToken = jwt.verify(token, process.env.SECRET);

  // if (!req.token && decodedToken.id) {
  //   return res.status(401).json({ error: "token invalid or not found" });
  // }

  // const blog = await Blog.findById(postId);
  // console.log(`this is blog : ${JSON.stringify(blog)}`);

  // if (!blog) {
  //   res.status(400).json({ error: "not found" });
  // }

  // if (blog.user.toString() === userFromToken.id.toString()) {
  //   await Blog.deleteOne({ _id: postId });
  //   res.sendStatus(204).end();
  // } else {
  //   res.status(401).json({ error: "unauthorized operation" });
  // }
});

blogsRouter.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    const updatedBlog = await req.blog.update({ likes: req.body.likes });
    res.json(updatedBlog);
  }
  res.status(404).end();

  // mongoDB
  // const id = req.params.id;
  // const blogPostData = req.body;
  // // console.log(body);

  // const updatedBlogPost = await Blog.findByIdAndUpdate(id, blogPostData, {
  //   new: true,
  // }).populate("user", { username: 1, name: 1 });

  // updatedBlogPost
  //   ? res.status(200).json(updatedBlogPost.toJSON())
  //   : res.status(404).end();
});

module.exports = blogsRouter;
