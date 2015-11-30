var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db,function(err){
	if(err){
		console.log('connect to %s error', config.db, err.message);
		process.exit(1);
	}
})
// models
/
require('./user');
require('./commodity');
require('./message');
require('./reply');

exports.User = mongoose.model('User');
exports.Commodity = mongoose.model('Commodity');
exports.Message = mongoose.model('Message');
exports.Reply = mongoose.model('Reply');
