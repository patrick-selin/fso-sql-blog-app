const jwt = require("jsonwebtoken");
// eslint-disable-next-line no-unused-vars
const config = require("../utils/config");
const bcryptjs = require("bcryptjs");
const loginRouter = require("express").Router();
// const User = require("../models/userModel");
const User = require("../models/userModelSQL");

const LONG_TIME = 60 * 60 * 600;

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username
    }
  });

  const passwordCorrect =
    user === null ? false : bcryptjs.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: LONG_TIME,
  });

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
