// 用户权限管理
// 后台权限管理

/*
 * adminRequired 需要管理员权限
 */
exports.adminRequired = function(req, res, next) {
  if (!req.session.user) {
    // 重定向登录页面
    return console.log('你还没有登录');
  }
  if (!req.session.user.isAdmin) {
    return console.log('需要管理员权限');
  }
};

/*
 * loginRequired 需要登录
 */
exports.loginRequired = function(req, res, next) {
  if (!req.session.user) {
    // 重定向登录页面
    return res.status(403).send('需要登录');
  }
  next();
};

/*
 * notLoginRequired 登录无法访问
 */
exports.notLoginRequired = function(req, res, next) {
  if (req.session && req.session.user) {
    // 返回上一页面
    return res.status(403).send('你已经登录');
  }
  next();
};
