const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  logger.error(
    "Error on %s %s | %s",
    req.method,
    req.originalUrl,
    err.stack || err.message
  );

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
  });
};
