const bcryptjs = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !password || username.length <= 3 || password.length <= 3) {
    return res.status(400).json({
      error: "Both username and password must be at least 3 characters long.",
    });
  }

  const SALTROUNDS = 10;
  const passwordHash = await bcryptjs.hash(password, SALTROUNDS);

  const user = await User.create({
    username,
    name,
    passwordHash,
  });

  res.status(201).json(user);
});

usersRouter.put("/:username", async (req, res) => {
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
