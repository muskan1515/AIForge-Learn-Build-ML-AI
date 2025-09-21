const { createLogger, transports, format } = require("winston");
const { config } = require("./envConfig");

const logger = createLogger({
  level: config.winston.level,
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
  transports: [new transports.Console()],
});

module.exports = { logger };
