var Admin = require('../proxy').Admin;
var validator = require('validator'); // 验证
exports.showAddAdminUser = function(req, res) {
  res.render('admin/addAdminUser');
};

exports.addAdminUser = function(req, res) {
  var body = req.body;
  console.log(body);

  var newObj = {
    name: validator.trim(body.name),
    email: validator.trim(body.email),
    password: validator.trim(body.password),
    phoneNum: validator.trim(body.phoneNum),
    root: validator.trim(body.root)
  };
  Admin.newAndSave(newObj, function(err, newAdminUser) {
    if (err) {
      return console.log(err);
    }
    // 新用户创建成功
    console.log(newAdminUser);
  });
};

exports.showCommodityAdmin = function(req, res) {
  res.render('admin');
};
