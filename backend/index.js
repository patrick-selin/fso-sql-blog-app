const app = require("./app");
const http = require("http");
const config = require("./utils/config");
//
const logger = require("./utils/logger");
//
const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(process.env.NODE_ENV);
  console.log(process.env.PORT);
  logger.info(`Server running on port ${config.PORT}`);
});
