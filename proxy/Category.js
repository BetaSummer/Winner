// 操作商品类别的一些操作
var Category = require('../models').Category;

/*
 * newAndSave 创建一个的类别
 * @param { String } 父级类别名称, 如果是一级类别, 则父级类别为空字符串
 * @param { String } 类别级别
 * @param { String } 类别名称
 * @param {Function} 回调函数
 */
exports.newAndSave = function(parent, leavel, name, cb) {
  // 先检查是否已经存在商品类别
  Category.findOne({ name: name }, function(err, category) {
    if (err) {
      return cb(err);
    }
    if (category) {
      // 如果已经存在该商品类别, 这里输出的提示信息应该详细一些, 比如已经在哪个类别下存在该类别, 该类别是第几级别的类别.
      return console.log('该类别已经存在');
    }
    var newCategory = new Category();
    newCategory.parent = parent;
    newCategory.leavel = leavel;
    newCategory.name = name;
    newCategory.save(cb);
  });
};

/*
 getAllCategory 获取所有的 category 好像有点冗余
 @param { String } [ 可选 ] 要查找的 category id
 @param { Function } 回调函数
 */
exports.getAllCategory = function(categoryId, cb) {
  if (typeof categoryId === 'function') {
    cb = categoryId;
    categoryId = null;
  }
  var query = categoryId ? { _id: categoryId } : {};
  Category.find(query, cb);
};

/*
 getCategoryNameById 通过 id 查询标签名
 @param { String } 标签 id
 @param { Function } 回调函数
 */
exports.getCategoryNameById = function(id, cb) {
  Category.findOne({ _id: id }, cb);
};

/*
 * findCategoryByLeavel 找到相同级别的类别
 * @param { Number } 类别级数 0 是代表一级类目, 依次类推
 * @param {Function} 回调函数
 */
exports.findCategoryByLeavel = function(leavel, cb) {
  Category.find({ leavel: leavel }, function(err, categories) {
    if (err) {
      return cb(err);
    }
    cb(null, categories);
  });
};

/*
 * getCatedoryByParent 获取父级的所有子级
 * @param { String } 父级名称
 * @param { Function } 回调函数
 */
exports.getCatedoryByParent = function(parent, cb) {
  Category.find({ parent: parent }, function(err, categories) {
    if (err) {
      return cb(err);
    }
    cb(null, categories);
  });
};

