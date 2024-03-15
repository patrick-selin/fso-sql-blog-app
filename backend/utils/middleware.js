const morgan = require("morgan");
const User = require("../models/userModel");
const logger = require("./logger");
const jwt = require("jsonwebtoken");

// eslint-disable-next-line no-unused-vars
morgan.token("req-body", (req, res) => JSON.stringify(req.body));

const morganLogs = morgan(
  ":method :url :status :res[content-length] - :response-time ms :req-body"
);

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "expired token" });
  }

  logger.error(error.message);

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  console.log(`AUTHH: ${authorization}`);
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    req.user = user;
  }

  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  morganLogs,
  tokenExtractor,
  userExtractor,
};
