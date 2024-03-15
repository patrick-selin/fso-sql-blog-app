const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres", // Specify the dialect explicitly
  host: "database", // Use the service name from docker-compose.yml
  port: 5432,
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
  },
});
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  await sequelize.close();
};

module.exports = {
  sequelize,
  connectDatabase,
  disconnectDatabase,
};
