var validator = require('validator'); // 验证
var crypto = require('crypto');
var User = require('../proxy').User;

// 通用加密密码函数
var hash = function(psw) {
  return crypto.createHash('sha1').update(psw).digest('hex');
};

exports.showReg = function(req, res) {
  res.render('signInOut/reg');
};

exports.reg = function(req, res, next) {
  // 注册 post 请求
  // 表单验证
  var body = req.body;
  var phoneNum = validator.trim(body.phoneNum);
  var password = validator.trim(body.password);
  var rePassword = validator.trim(body.rePassword);
  var nickName = validator.trim(body.nickName);
  if ([phoneNum, password, rePassword, nickName].some(function(item) {
      return item === '';
    })) {
    return console.log('信息填写不完整');
  }

  if (!validator.isMobilePhone(phoneNum, 'zh-CN')) {
    return console.log('对不起，仅支持中国大陆手机号码');
  }

  if (password !== rePassword) {
    return console.log('两次密码输入不一致');
  }

  // 检测注册用户手机号是否已经存在数据库
  User.getUserByPhone(phoneNum, function(err, user) {
    if (err) {
      return console.log(err);
    }

    if (user) {
      return console.log('手机号码已经被使用');
    }

    password = hash(password); // 密码加密
    User.newAndSave(phoneNum, password, nickName, function(err, user) {
      if (err) {
        console.log(err);
      }
      req.session.user = user;
      // 这边重定向地址需要做一下优化, 因为用户可能是点击某个商品,被要求注册/登录的
      return res.redirect('/');
    });
  });
};

exports.showLogin = function(req, res) {
  res.render('signInOut/login', {
    user: req.session.user
  });
};

exports.login = function(req, res, next) {
  // 登录 请求
  var body = req.body;
  var phoneNum = validator.trim(body.phoneNum);
  var password = validator.trim(body.password);
  if ([phoneNum, password].some(function(item) {
      return item === '';
    })) {
    return console.log('信息填写不完整');
  }
  if (!validator.isMobilePhone(phoneNum, 'zh-CN')) {
    return console.log('对不起，仅支持中国大陆手机号码');
  }
  User.getUserByPhone(phoneNum, function(err, user) {
    if (err) {
      return console.log(err);
    }
    if (!user) {
      return console.log('该手机号还没有注册');
    }
    password = hash(password); // 密码加密
    if (user.password === password) {
      req.session.user = user;
      // 当然这边冲顶要链接也要做相应的优化
      return res.redirect('/');
    }
  });
};
exports.logout = function(req, res, next) {
  // 登出请求
  req.session.destroy();
  res.redirect('/');
};
exports.activeAccount = function(req, res, next) {
  // 邮箱激活
};
exports.showForgetPass = function(req, res) {
  // 找回密码页面
  res.render('signInOut/forgetPass');
};
exports.updateForgetPass = function(req, res, next) {
  // 处理找回密码页面  更新密码
};
