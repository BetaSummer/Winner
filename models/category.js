var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 * leavel
 *    0  一级类别
 *    1  二级类别
 */
var CategorySchema = new Schema({
  leavel: { type: Number },
  name: { type: String },
  parent: { type: String, default: '' }, // 父级类别
  isBlock: { type: Boolean, default: false }
});

CategorySchema.index({ name: 1 });

var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
