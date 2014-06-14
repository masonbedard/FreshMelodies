var mongoose = require('mongoose'),
    logger = require('./logger');
try {
  mongoose.connect("mongodb://localhost");
} catch(err) {
  logger.err("Unable to connect to MongoDB");
}

module.exports.Song = require('./song');
