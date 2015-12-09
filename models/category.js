var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Mixed = Schema.Types.Mixed;
var CategorySchema = new Schema({
  firstNav:[String],
  secondNav:[String],
});

var Category = mongoose.model('Category',CategorySchema);
module.exports = Category;