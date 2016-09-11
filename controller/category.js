// 商品类别管理
var Category = require('../proxy').Category;
var validator = require('validator'); 

// 显示添加商品类别
exports.showAddCategory = function(req, res, next) {
  res.render('admin/addCategory', {
    user: req.session.user
  });
};

// 处理添加商品类别请求
exports.addCategory = function(req, res, next) {
  var categoryObj = req.body;
  var parent = validator.trim(categoryObj.parent);
  var leavel = validator.trim(categoryObj.leavel);
  var name = validator.trim(categoryObj.name);
  Category.newAndSave(parent, leavel, name, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('类目保存成功');
  });
};

// 显示编辑商品类别
exports.showEditCategory = function(req, res, next) {
  res.render();
};

// 处理编辑商品类别请求
exports.editCategory = function(req, res, next) {

};
