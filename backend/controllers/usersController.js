// const config = require("../utils/config");
// const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");
//
const usersRouter = require("express").Router();
const User = require("../models/userModel");

usersRouter.get("/", async (req, res) => {
  const allUsers = await User.find({}).populate("blogPosts", {
    title: 1,
    author: 1,
    url: 1,
  });

  res.json(allUsers);
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !password || username.length <= 3 || password.length <= 3) {
    return res.status(400).json({
      error: "Both username and password must be at least 3 characters long.",
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const SALTROUNDS = 10;
  // change to bcryptJS
  const passwordHash = await bcryptjs.hash(password, SALTROUNDS);
  // const passwordHash = await bcrypt.hash(password, SALTROUNDS);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  console.log(`this is newUser : ${JSON.stringify(newUser)}`);

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

module.exports = usersRouter;
