const readingListsRouter = require("express").Router();
const { ReadingList } = require("../models");

readingListsRouter.post("/", async (req, res) => {
  const { blogId, userId } = req.body;
  const readingList = await ReadingList.create({ blogId, userId });

  return res.status(200).send(readingList);
});

readingListsRouter.put("/:id", async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id);
  console.log(`this is huu ::  ${JSON.stringify(req.body.isRead)}`);
  await readingList.update({ isRead: req.body.isRead });
  res.json(readingList);
});

module.exports = readingListsRouter;
