const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: "migrations/*.js",
    },
    storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });

  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  host: "database",
  port: 5432,
  dialectOptions: {
    ssl: false,
  },
  logging: console.log,
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
  return null;
};

const disconnectDatabase = async () => {
  await sequelize.close();
};

module.exports = {
  sequelize,
  connectDatabase,
  disconnectDatabase,
};
