const authorsRouter = require("express").Router();
const Blog = require("../models/blog");
const { sequelize } = require("../utils/db");

authorsRouter.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("id")), "articles"],
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    group: "author",
    order: [[sequelize.fn("SUM", sequelize.col("likes")), "DESC"]],
  });

  console.log(`this is AUTHORS ::  ${JSON.stringify(authors)}`);
  res.json(authors);
});

module.exports = authorsRouter;
