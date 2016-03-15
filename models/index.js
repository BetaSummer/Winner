var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function(err) {
  if (err) {
    console.log('connect to %s error', config.db, err.message);
    process.exit(1);
  }
});

exports.User = require('./user');
exports.Commodity = require('./commodity');
exports.Message = require('./message');
exports.Reply = require('./reply');
exports.Category = require('./category');
