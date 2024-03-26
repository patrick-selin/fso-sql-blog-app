const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const loginRouter = require("express").Router();
const User = require("../models/user");
const Session = require("../models/session");

const LONG_TIME = 60 * 60 * 600;

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  const passwordCorrect =
    user === null ? false : bcryptjs.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }
  if (user.disabled) {
    return res.status(401).json({
      error: "Disabled user - no access",
    });
  }

  console.log(`this is ID ::  ${JSON.stringify(user.id)}`);
  await Session.destroy({
    where: {
      userId: user.id,
    },
  });

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: LONG_TIME,
  });

  await Session.create({
    userId: user.id,
    token: token,
    active: true,
  });

  res
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user.id });
});

module.exports = loginRouter;
