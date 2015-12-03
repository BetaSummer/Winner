var config = require('../config');
var user = require('../proxy/user');
var auth = require('../middlewares/auth');

/*
* showUserCenterIndex 显示用户个人中心的首页 最新动态
 */
exports.showUserCenterIndex = function(req,res,next){
	var userId = req.params.id;
	var isSelf = userId === req.session.user._id ? true : false;
	user.getUserById(userId,function(err,user){
		if(err){
			console.log(err)
		}
		res.render('userCenter/news',{
			user:req.session.user,
			theUser:user,
			isSelf:false
		});
	});
}
/*
* showUserTop 首页显示优质用户
 */
exports.showTopUser= function(req,res,next){
	user.getUserById(function(err,users){
		if(err){
			return console.log(err)
		}
		res.render('topUser',{
			user:req.session.user,
			users:users
		});
	});
	
}
/*
* showMyFollows 显示用户个人中心 我的粉丝
 */
exports.showMyFollows = function(req,res,next){
	var userId = req.params.id;
	var isSelf = userId === req.session.user._id ? true : false;
	user.getUserFollowsById(userId,function(err,user){
		console.log(user);
		res.render('userCenter/myFollows',{
			user:req.session.user,
			theUser:user,
			isSelf:isSelf
		});
	});
}
/*
* showMyFocus 显示用户个人中心的首页 我的关注
 */
exports.showMyFocus = function(req,res,next){
	var userId = req.params.id;
	console.log(userId)
	var isSelf = userId === req.session.user._id ? true : false;
	user.getUserFocusById(userId,function(err,user){
		if(err){
			return console(err);
		}
		res.render('userCenter/myFocus',{
			user:req.session.user,
			theUser:user,
			isSelf:isSelf
		});
	});
};
/*
* 处理关注和取消关注请求
 */
exports.addFocus = function(req,res,next){
	var selfId = req.session.user._id;
	var userId = req.params.id;
	user.addFocus(selfId,userId,function(err){
		if(err){
			return console.log(err)
		}
		//  数据操作之后应该及时更新session
		console.log('关注成功');
	})
};
exports.rmFocus = function(req,res,next){
	var selfId = req.session.user._id;
	var userId = req.params.id;
	console.log(selfId);
	console.log(userId);
	user.rmFocus(selfId,userId,function(err){
		if(err){
			return console.log(err)
		}
		//数据操作之后应该及时更新session
		console.log('取消关注成功');
	})
}


/*
* showMyCommodity 显示用户个人中心的首页 我的闲置
 */
exports.showMyCommodity = function(req,res,next){
	var userId = req.params.id;
	var isSelf = userId === req.session.user._id ? true : false;
	user.getUserCommoditiesById(userId,function(err,doc){
		if(err){
			return console.log(err);
		}
		console.log(doc.myCommodity);// 商品信息
		//查找卖家信息。
		user.getUserById(userId,function(err,user){
			res.render('userCenter/myCommodity',{
				user:req.session.user,
				theUser:user,
				commodity:doc.myCommodity,
				isSelf:isSelf
			});
		});
	});
};
/*
* showSettingIndex 显示用户信息设置首页
 */
exports.showSettingIndex = function(req,res,next){
	res.render('setting/userSettingBase',{
		user:req.session.user
	})
};

/*
* 个人资料更新
 */
exports.settingIndex = function(req,res,next){
	var body = req.body;
	console.log(body);
};

/*
* showSettingHeader 显示用户信息设置头像
 */
exports.showSettingHeader = function(req,res,next){
	res.render('setting/userSettingHeader',{
		user:req.session.user
	})
};
/*
* 头像更新
 */
exports.settingHeader = function(req,res,next){
	
};

/*
* showSettingPass 显示用户信息设置密码
 */
exports.showSettingPass = function(req,res,next){
	res.render('setting/userSettingPassword',{
		user:req.session.user
	})
};
/*
* 密码更新
 */
exports.settingPass = function(req,res,next){
	
};
/*
* showSettingBind 显示用户信息设置绑定
 */
exports.showSettingBind = function(req,res,next){
	res.render('setting/userSettingBind',{
		user:req.session.user
	})
};
/*
* 帐号绑定更新
 */
exports.settingBind = function(req,res,next){
	
};
