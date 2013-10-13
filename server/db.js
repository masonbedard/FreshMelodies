var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');

var Song = require('./song');

module.exports.Song = Song;
