var express = require('express');
var router = express.Router();
var admin = require('./admin/');

module.exports = function(app) {
  var user = require('./user');
  var auth = require('./auth');
  var commodity = require('./commodity');
  var commodities = require('./commodities');
  var category = require('./category');

  // 用户界面 及 api 接口
  var index = [
    { path: '', router: commodities },
    { path: 'auth', router: auth },
    { path: 'user', router: user },
    { path: 'commodity', router: commodity },
    { path: 'category', router: category }
  ];

  index.forEach(function(route) {
    app.use('/' + route.path, route.router);
    // api 的 支持需要加入 api 的请求 或者 xhr 请求的判断
    // 默认 res.render 是去渲染模板
    // app.use('/api/' + route.path, route.router);
  });

  // 后台管理路由
  // admin(app);
}
