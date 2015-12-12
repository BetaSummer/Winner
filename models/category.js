var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Mixed = Schema.Types.Mixed;
var CategorySchema = new Schema({
  firstNav:[String],
  secondNav:[Mixed],
});
//"firstNav" : [ "闲置商品" ],
//"secondNav" : [ { "secondNav" : "笔记本", "firstNav" : "闲置商品" } ]
var Category = mongoose.model('Category',CategorySchema);
module.exports = Category;
