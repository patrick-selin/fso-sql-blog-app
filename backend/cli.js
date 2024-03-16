require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  host: "database",
  port: 5432,
  dialectOptions: {
    ssl: false,
  },
});

const printBlogsCLI = async () => {
  try {
    await sequelize.authenticate();

    const blogs = await sequelize.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    });
    blogs.forEach((blog) => {
      console.log(`ID:${blog.id}, ${blog.author}: "${blog.title}", ${blog.likes} likes`);
    });

    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

printBlogsCLI();
