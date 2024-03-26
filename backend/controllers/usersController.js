const bcryptjs = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");
const ReadingList = require("../models/readingList");

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "username"],
    include: {
      model: Blog,
      attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
    },
  });
  res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
  // const user = await User.findByPk(req.params.id);

  const where = {};
  console.log(`this is READ::  ${JSON.stringify(req.query.read)}`);
  if (req.query.read) {
    where.isRead = req.query.read === "true";
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["createdAt", "updatedAt", "id", "passwordHash"] },
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: {
          exclude: ["userId", "createdAt", "updatedAt"],
        },
        through: {
          as: "reading_list",
          attributes: { exclude: ["userId", "blogId, createdAt, updatedAt"] },
          where,
        },
      },
    ],
  });

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
