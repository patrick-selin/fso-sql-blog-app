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
    console.log("Executing (default): SELECT * FROM blogs");

    const blogs = await sequelize.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    });
    console.log(blogs);

    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

printBlogsCLI();
