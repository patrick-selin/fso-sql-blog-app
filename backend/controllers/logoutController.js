const loginRouter = require("express").Router();
const Session = require("../models/session");

loginRouter.delete("/", async (req, res) => {
  console.log(`this is huu ::  ${JSON.stringify(req.user)}`);

  await Session.destroy({
    where: {
      id: req.user.sessionId,
    },
  });
  res.status(204).send();
});

module.exports = loginRouter;
