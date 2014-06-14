var winston = require('winston');
var Logger = winston.Logger,
    config = require('../config/logger.conf');

var logger = new Logger();
logger.add(winston.transports.File, {
  filename: config.LOG_FILE,
  level: config.LOG_LEVEL,
  handleExceptions: true
});
logger.add(winston.transports.Console, {
  level: config.LOG_LEVEL,
  handleExceptions: true
});
logger.exitOnError = false;

// must be last
module.exports = logger;