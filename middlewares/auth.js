/**
 * adminRequired 需要管理员权限
 */
exports.adminRequired = function(req, res, next) {
  if (!req.session && !req.session.user) {
    var redirectTo = req.url;
    var redirect = redirectTo ? '/admin/auth/login?redirectTo=' + redirectTo : '/login';
    res.redirect(redirect);
  }
  if (!req.session.user.isAdmin) {
    console.log('需要管理员权限');
  }
  next();
};


/**
 * loginRequired 需要登录
 */
exports.loginRequired = function(req, res, next) {
  console.log(req.session)
  if (!req.session || !req.session.user) {
    var redirectTo = req.url;
    var redirect = redirectTo ? '/auth/login?redirectTo=' + redirectTo : '/login';
    res.redirect(redirect);
  }

  next();
};

/**
 * notLoginRequired 登录无法访问
 */
exports.notLoginRequired = function(req, res, next) {
  if (req.session && req.session.user) {
    res.redirect('back');
  }
  next();
};
