var validator = require('validator'); // 验证
var crypto = require('crypto');
var config = require('../config');
var User = require('../proxy').User;
var mail = require('../common/mail');
var authMiddleWare = require('../middlewares/auth');
var hash = function(psw){
	return crypto.createHash('sha1').update(psw).digest('hex');
}
exports.showReg = function(req,res){
	res.render('signInOut/reg');
};

exports.reg = function(req,res,next){
	// 注册 post 请求
	// 表单验证
	var body = req.body;
	var phone = validator.trim(body.phone),
			password = validator.trim(body.password),
			rePassword = validator.trim(body.rePassword),
			nickName = validator.trim(body.nickName);
	if([phone,password,rePassword,nickName].some(function(item){return item === ''})){
		return console.log('信息填写不完整');
	}
	if(!validator.isMobilePhone(phone,'zh-CN')){
		return console.log('对不起，仅支持中国大陆手机号码');
	}
	if(password !== rePassword){
		return console.log('两次密码输入不一致');
	};
	// 检测注册用户手机号是否已经存在数据库
	User.getUserByPhone(phone,function(err,user){
		if(err){
			return console.log(err);
		}
		if(user){
		  return console.log('手机号码已经被使用')
		}
		password = hash(password);  // 密码加密
		User.newAndSave(phone,password,nickName,function(err,user){
			if(err){
				console.log(err);
			}
			req.session.user = user;
			return res.redirect('/');
		})
	});
};

exports.showLogin = function(req,res){
	res.render('signInOut/login',{
		user:req.session.user
	})
};

exports.login = function(req,res,next){
	// 登录 请求
	var body = req.body;
	var phone = validator.trim(body.phone),
			password = validator.trim(body.password);
	if([phone,password].some(function(item){return item === ''})){
		return console.log('信息填写不完整');
	}
	if(!validator.isMobilePhone(phone,'zh-CN')){
		return console.log('对不起，仅支持中国大陆手机号码');
	}
	User.getUserByPhone(phone,function(err,user){
		if(err){
			return console.log(err);
		}
		if(!user){
			return console.log('该手机号还没有注册')
		}
		password = hash(password);  // 密码加密
		if(user.password === password){
			req.session.user = user;
			return res.redirect('/');
		}
	});
};
exports.logout = function(req,res,next){
	// 登出请求
	req.session.destroy();
	res.redirect('/')
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
