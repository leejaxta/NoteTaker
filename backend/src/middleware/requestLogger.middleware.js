const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  const userId = req.user?.id || "anonymous";

  logger.info("%s %s | user=%s", req.method, req.originalUrl, userId);
  next();
};
