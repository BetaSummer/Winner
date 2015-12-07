var config = require('../config');
var User = require('../proxy/user');
var auth = require('../middlewares/auth');
var path = require('path');
var fs = require('fs');
var validator = require('validator'); // 验证
var crypto = require('crypto');
var hash = function(psw){
	return crypto.createHash('sha1').update(psw).digest('hex');
};
/*
* showUserCenterIndex 显示用户个人中心的首页 最新动态
 */
exports.showUserCenterIndex = function(req,res,next){
	var userId = req.params.id;
	var isSelf = userId === req.session.user._id ? true : false;
	User.getUserById(userId,function(err,user){
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
	User.getUserById(function(err,users){
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
	User.getUserFollowsById(userId,function(err,user){
		// console.log(user);
		res.render('userCenter/myFollows',{
			user:req.session.user,
			follows:user.follows,
			isSelf:isSelf
		});
	});
}
/*
* showMyFocus 显示用户个人中心的首页 我的关注
 */
exports.showMyFocus = function(req,res,next){
	var userId = req.params.id;
	var isSelf = userId === req.session.user._id ? true : false;
	User.getUserFocusById(userId,function(err,user){
		/*
		focus:
   [ { header: '/dist/images/nan.jpg',
       nickName: '111',
       _id: 56614af2ce4976290de02140 },
     { header: '/dist/images/nan.jpg',
       nickName: '222',
       _id: 56614b06ce4976290de02141 },
     { header: '/dist/images/nan.jpg',
       nickName: '333',
       _id: 56614b1ace4976290de02142 } ],
		 */
		if(err){
			return console(err);
		}
		res.render('userCenter/myFocus',{
			user:req.session.user,
			focus:user.focus,
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
	User.addFocus(selfId,userId,function(err){
		if(err){
			return console.log(err)
		}
		//数据操作之后应该及时更新session
		//不过这里就前端模拟好了点一下关注就显示关注成功
		//如果后台关注成功请求执行没成功
		//再把没有关注成功信息返回  或者 重新刷新
		console.log('关注成功');
	})
};
exports.rmFocus = function(req,res,next){
	var selfId = req.session.user._id;
	var userId = req.params.id;
	console.log(selfId);
	console.log(userId);
	User.rmFocus(selfId,userId,function(err){
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
	User.getUserCommoditiesById(userId,function(err,doc){
		if(err){
			return console.log(err);
		}
		console.log('商品信息')
		console.log(doc.myCommodity);// 商品信息
		//查找卖家信息。
		User.getUserById(userId,function(err,user){
			console.log('查找卖家信息。')
			console.log(user)
			res.render('userCenter/myCommodity',{
				user:req.session.user,
				theUser:user,
				commodities:doc.myCommodity,
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
	var userId = req.session.user._id;
	var body = req.body;
	// if(!validator.isDate(body.brithday)){
	// 	return console.log('生日信息不合法')
	// }
	var userInfo = {
		nickName:validator.trim(body.nickName),
		phoneNum:validator.trim(body.phoneNum),
		realName:validator.trim(body.realName),
		qq:validator.trim(body.qq),
		weChat:validator.trim(body.weChat),
		sex:validator.trim(body.sex),
		birthday:validator.trim(body.birthday)
	};
	console.log(userInfo);
	User.updateUserInfo(userId,userInfo,function(err){
		if(err){
			return console.log(err)
		}
		console.log('信息更新成功')
	})
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
	var userId = req.session.user._id;
	var isFormData = req.body.isFormData || false;
	var filename =Date.now()+req.files.userHeader.originalFilename;
	var targetPath = './public/upload/images/userHeader/'+filename;
	fs.createReadStream(req.files.userHeader.path).pipe(fs.createWriteStream(targetPath));
	;
	var headerSrc =  '/upload/images/userHeader/'+filename;
	// 更新数据库图像
	User.updateUserHeader(userId,headerSrc,function(err){
		if(err){
			return console.log(err);
		}
		//及时更新session的头像
		req.session.user.header = headerSrc;
		if(!isFormData){
			// 如果不是formaData方式上传的话就跳转
			res.redirect('/settingHeader');
		}else {
			res.json({code: 200, msg: {url: 'http://' + req.headers.host + headerSrc}})
		}
	})
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
	var userId = req.session.user._id;
	var oldPass = validator.trim(req.body.oldPassword);
	var newPass = validator.trim(req.body.newPassword)
	var reNewPass = validator.trim(req.body.reNewPassword);
	if(newPass!==reNewPass){
		return console.log('两次密码输入不一致')
	}
	User.getUserById(userId,function(err,user){
		// 加密原密码
		oldPass = hash(oldPass);
		if(oldPass!==user.password){
			return console.log('原密码不正确')
		}
		//加密新密码
		newPass = hash(newPass);
		User.updateUserPass(userId,newPass,function(err,info){
			if(err){
				return console.log(err)
			}
			console.log(info);
			console.log('密码更新成功')
		});
	})
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
