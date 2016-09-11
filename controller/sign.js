var validator = require('validator'); // 验证
var User = require('../proxy').User;
var hash = require('../common/helper').hash;

exports.showReg = function(req, res) {
  var redirectTo = req.query.redirectTo ? req.query.redirectTo : '/';
  res.render('auth/reg', {
    redirectTo: redirectTo
  });
};

exports.reg = function(req, res, next) {
  var body = req.body;
  var redirectTo = req.query.redirectTo ? req.query.redirectTo : '/';
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

  User.getUserByPhone(phoneNum, function(err, user) {
    if (err) {
      return console.log(err);
    }

    if (user) {
      return console.log('手机号码已经被使用');
    }

    password = hash(password);
    User.newAndSave(phoneNum, password, nickName, function(err, user) {
      if (err) {
        console.log(err);
      }
      req.session.user = user;
      return res.redirect(redirectTo);
    });
  });
};

exports.showLogin = function(req, res) {
  var redirectTo = req.query.redirectTo ? req.query.redirectTo : '/';
  res.render('auth/login', {
    user: req.session.user,
    redirectTo: redirectTo
  });
};

exports.login = function(req, res, next) {
  var body = req.body;
  var redirectTo = req.query.redirectTo ? req.query.redirectTo : '/';
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
    password = hash(password);
    if (user.password === password) {
      req.session.user = user;
      res.redirect(redirectTo);
    } else {
      return console.log('密码错误')
    }
  });
};

exports.logout = function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    }
    return res.redirect('/');
  });
};

exports.activeAccount = function(req, res, next) {
  // 邮箱激活
};

exports.showForgetPass = function(req, res) {
  res.render('user/forgetPass');
};

exports.updateForgetPass = function(req, res, next) {
  // 处理找回密码页面  更新密码
};
