var config = require('../config');
var user = require('../proxy/user');
var auth = require('../middlewares/auth');

/*
* showUserCenterIndex 显示用户个人中心的首页 最新动态
 */
exports.showUserCenterIndex = function(req,res,next){
	res.render('userCenter/news');
}
/*
* showUserTop 首页显示优质用户
 */
exports.showTopUser= function(req,res,next){
	res.render('topUser');
}
/*
* showMyFollows 显示用户个人中心 我的粉丝
 */
exports.showMyFollows = function(req,res,next){
	res.render('userCenter/myFollows');
}
/*
* showMyFocus 显示用户个人中心的首页 我的关注
 */
exports.showMyFocus = function(req,res,next){
	res.render('userCenter/myFocus');
}
/*
* showMyCommodity 显示用户个人中心的首页 我的闲置
 */
exports.showMyCommodity = function(req,res,next){
	res.render('userCenter/myCommodity');
};
/*
* showSettingIndex 显示用户信息设置首页
 */
exports.showSettingIndex = function(req,res,next){
	res.render('setting/userSettingBase')
};

/*
* showSettingHeader 显示用户信息设置头像
 */
exports.showSettingHeader = function(req,res,next){
	res.render('setting/userSettingHeader')
};

/*
* showSettingPass 显示用户信息设置密码
 */
exports.showSettingPass = function(req,res,next){
	res.render('setting/userSettingPassword')
};

/*
* showSettingBind 显示用户信息设置绑定
 */
exports.showSettingBind = function(req,res,next){
	res.render('setting/userSettingBind')
};
