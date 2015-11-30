var config = require('../config');
var User = require('../proxy').User;
var mail = require('../common/mail');
var authMiddleWare = require('../middlewares/auth');

exports.showReg = function(req,res){
	res.render('signInOut/reg')
};

exports.reg = function(req,res,next){
	// 注册 post 请求
	// 表单验证
};

exports.showLogin = function(req,res){
	res.render('signInOut/login')
};

exports.login = function(req,res,next){
	// 登录 请求
	// 表单验证
};
exports.logout = function(req,res,next){
	// 登出请求
};
exports.activeAccount = function(req,res,next){
	// 邮箱激活
};
exports.showForgetPass = function(req,res){
	// 找回密码页面
	res.render('signInOut/forgetPass');
};
exports.updateForgetPass = function(req,res,next){
	// 处理找回密码页面  更新密码
};
