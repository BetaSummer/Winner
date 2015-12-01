var validator = require('validator'); // 验证
var config = require('../config');
var Commodity = require('../proxy').Commodity;
var authMiddleWare = require('../middlewares/auth');
var commodity = require('../proxy/commodity');
/*
* showIndex 显示首页
 */
exports.showIndex = function(req,res,next){
	res.render('commodityList/index',{
		user:req.session.user,

	});
};
/*
* showPublish 发布商品页面
 */
exports.showPublish = function(req,res,next){
	res.render('commodityShow/publish',{
		user:req.session.user
	});
}
/*
* 发布商品 请求
 */
exports.publish = function(req,res,next){
	var body = req.body;
  console.log('body');
	console.log(body);
	var user = req.session.user;
	var userId = user._id;
	var publishObj = {
		title : validator.trim(body.title),
		category : {
			firstNav: validator.trim(body.firstNav),
			secondNav:validator.trim(body.secondNav)
		},
		// 商品名称
		name: validator.trim(body.name),
		howNew: validator.trim(body.howNew),
		price : validator.trim(body.price),
		coverImage : validator.trim(body.coverImage),
		getTime : validator.trim(body.getTime),
		getPrice : validator.trim(body.getPrice),
		phoneNum : validator.trim(body.phoneNum),
		userName : validator.trim(body.userName),
		qq : validator.trim(body.qq),
		weChat : validator.trim(body.wechat),
		content : validator.trim(body.content),
		hostId : userId
	};
	Commodity.newAndSave(publishObj,function(err,commodity){
		if(err){
			return console.log(err);
		}
		req.session.user = user;
		req.session.commodity = commodity;
		res.redirect('/commodity/'+commodity._id);
	})
};

/*
* editCommodity 编辑商品
 */

exports.editCommodity = function(req,res,next){
	res.render('commodityShow/edit',{
		user:req.session.user,
		commodity:req.session.commodity
	});
}

exports.edit = function(req,res,next){
	// 处理 编辑上传的form 表单
	console.log('edit');
	res.redirect('/');
};

/*
* commodityDetail 商品详情
 */
exports.commodityDetail = function(req,res,next){
	res.render('commodityShow/detail',{
		user:req.session.user,
		commodity:req.session.commodity
	});
}
