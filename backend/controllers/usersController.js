// const config = require("../utils/config");
// const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");
//
const usersRouter = require("express").Router();
// const User = require("../models/userModel");
const User = require("../models/userModelSQL");
// const { User } = require('../models');

usersRouter.get("/", async (req, res) => {
  // SQL version
  const users = await User.findAll();
  res.json(users);

  // const allUsers = await User.find({}).populate("blogPosts", {
  //   title: 1,
  //   author: 1,
  //   url: 1,
  // });

  // res.json(allUsers);
});

usersRouter.get("/:id", async (req, res) => {
  // SQL version
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

usersRouter.post("/", async (req, res) => {
  // SQL version
  //
  // const user = await User.create(req.body);
  // res.status(201).json(user);

  const { username, name, password } = req.body;

  if (!username || !password || username.length <= 3 || password.length <= 3) {
    return res.status(400).json({
      error: "Both username and password must be at least 3 characters long.",
    });
  }

  // const existingUser = await User.findOne({ username });
  // if (existingUser) {
  //   return res.status(400).json({ error: "Username already exists" });
  // }

  const SALTROUNDS = 10;
  const passwordHash = await bcryptjs.hash(password, SALTROUNDS);

  const user = await User.create({
    username,
    name,
    passwordHash,
  });

  res.status(201).json(user);

  // const savedUser = await newUser.save();
  // res.status(201).json(savedUser);
});

usersRouter.put("/:username", async (req, res) => {
  // SQL version
  const user = await User.findOne({ where: { username: req.params.username } });

  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(404).send("User doesn't exist");
  }
});

module.exports = usersRouter;
