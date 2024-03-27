const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

// Blog.sync({ alter: true });
// User.sync({ alter: true });

User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList, as: "readers" });

Blog.hasMany(ReadingList);
ReadingList.belongsTo(Blog);

User.hasMany(Session);
Session.belongsTo(User);

module.exports = {
  Blog,
  User,
  ReadingList,
};
