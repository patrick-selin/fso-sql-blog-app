const readingListsRouter = require("express").Router();
const { ReadingList } = require("../models");

readingListsRouter.post("/", async (req, res) => {
  const { blogId, userId } = req.body;
  const readingList = await ReadingList.create({ blogId, userId });

  return res.status(200).send(readingList);
});

module.exports = readingListsRouter;

