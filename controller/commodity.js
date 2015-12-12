var validator = require('validator'); // 验证
var config = require('../config');
var Commodity = require('../proxy').Commodity;
var User = require('../proxy').User;
var fs = require('fs');
var path = require('path');
var authMiddleWare = require('../middlewares/auth');
/*
* showIndex 显示首页
 */
exports.showIndex = function(req,res,next){
	var p = req.params.page||0;
	var limit = 10;
	var skip = p*limit;
	Commodity.getCommodities(skip,limit,function(err,commodities){
		var getUserInfo = function(item){
			var promise = new Promise(function(resolve,reject){
				var hostId = item.hostId[0];
				User.getUserById(hostId,function(err,user){
					if(err){
						reject(err);
						return console.log(err);
					}
					resolve(user);
				});
			});
			return promise;
		};
		var promises = commodities.map(function(item){
			return getUserInfo(item)
		})
		Promise.all(promises).then(function(users){
			res.render('commodityList/index',{
				user:req.session.user,
				commodities:commodities,
				users:users
			});
			console.log(users)
			// console.log(commodities)
		}).catch(function(err){
			return console.log(err)
		})
	});
};
/*
* showPublish 发布商品页面
 */
exports.showPublish = function(req,res,next){
	res.render('commodityShow/publish',{
		user:req.session.user,
	});
};
/*
* 发布商品 请求
 */
exports.publish = function(req,res,next){
	var body = req.body;
	var user = req.session.user;
	var userId = user._id;
	console.log(body);
	console.log(req.files);
	var filename =Date.now()+req.files.coverImage.originalFilename;
	var targetPath = './public/upload/images/coverImage/'+filename;
	fs.createReadStream(req.files.coverImage.path).pipe(fs.createWriteStream(targetPath));
	var coverImage =  '/upload/images/coverImage/'+filename;
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
		coverImage : validator.trim(coverImage),
		gotTime : validator.trim(body.gotTime),
		gotPrice : validator.trim(body.gotPrice),
		phoneNum : validator.trim(body.phoneNum),
		userName : validator.trim(body.userName),
		qq : validator.trim(body.qq),
		weChat : validator.trim(body.wechat),
		content : validator.trim(body.content),
		hostId : userId
	};
	console.log('publishObj');
	console.log(publishObj);
	Commodity.newAndSave(publishObj,function(err,commodity){
		if(err){
			return console.log(err);
		}
		var commodityId = commodity._id;
		// 更新User将新添加的commodity传入user的myCommodity字段
		User.addMyCommodity(userId,commodityId,function(err,info){
			if(err){
				return console.log(err);
			}
			req.session.user = user;
			res.redirect('/commodity/'+commodityId);
		});
	});
};

/*
* editCommodity 编辑商品
 */

exports.showEditCommodity = function(req,res,next){
	var commodityId = req.params.id;
	var userId = req.session.user._id;
	Commodity.getCommodityById(commodityId,function(err,commodity){
		if(err){
			return console.log(err)
		}
		var hostId = commodity.hostId[0];
		if(userId!=hostId){
			console.log('没有权限')
			return res.redirect('back');
		}
		res.render('commodityShow/edit',{
			user:req.session.user,
			commodity:commodity
		})
	})
};
//
//
//  编辑商品内容的时候 拆分为多个表单了
//
//
exports.edit = function(req,res,next){
	// 处理 编辑上传的form 表单
	var body = req.body;
	var commodityId = req.params.id;
	var hostId = req.params.hostId;
	// console.log(commodityId,hostId);
	var userId = req.session.user._id;
	if(hostId!=userId){
		return console.log('不是本人提交 无权修改');
	}
	var obj = {
		//title:validator.trim(body.title),
		// content:validator.trim(body.content),
		// category:validator.trim(body.category),
		// howNew:validator.trim(body.howNew),
		// price:validator.trim(body.price),
		// gotPrice:validator.trim(body.gotPrice),
		// gotTime:validator.trim(body.gotTime),
		// phoneNum:validator.trim(body.phoneNum),
		// weChat:validator.trim(body.weChat),
		// sex:validator.trim(body.sex),
		// qq:validator.trim(body.qq),
	};
	Commodity.updateByCommodityId(commodityId,obj,function(err){
		if(err){
			return console.log(err)
		}
		console.log('更新成功');
	});
};

/*
* editInfo 设置商品信息字段
 */
exports.editInfo = function(req,res,next){
	var body = req.body;
	var commodityId = req.params.id;
	var hostId = req.params.hostId;
	var userId = req.session.user._id;
	if(hostId!=userId){
		return console.log('不是本人提交 无权修改');
	}
	var infoObj = {
		// 一些获取过来的数据
		// 好乱阿
		// 拉这么长的注释是想说
		// 这边是空的
		// 因为
		// 长
		// 一
		// 点
		// 比较
		// 容易发现
	};
	Commodity.updateByCommodityId(commodityId,infoObj,function(err,info){
		if(err){
			return console.log(err)
		}
		console.log(info)
		res.redirect('back');
	})
};
/*
* editConnect 设置商品用户联系方式
 */
exports.editConnect = function(req,res,next){
	var body = req.body;
	var commodityId = req.params.id;
	var hostId = req.params.hostId;
	var userId = req.session.user._id;
	if(hostId!=userId){
		return console.log('不是本人提交 无权修改');
	}
	var infoObj = {
		// 一些获取过来的数据
		// 好乱阿
		// 拉这么长的注释是想说
		// 这边是空的
		// 因为
		// 长
		// 一
		// 点
		// 比较
		// 容易发现
	};
	Commodity.updateByCommodityId(commodityId,infoObj,function(err,info){
		if(err){
			return console.log(err)
		}
		console.log(info)
		res.redirect('back');
	})
};
/*
* editImg 编辑商品 处理 上传封面
 */
exports.editImg = function(req,res,next){
	var body = req.body;
	var commodityId = req.params.id;
	var hostId = req.params.hostId;
	var userId = req.session.user._id;
	if(hostId!=userId){
		return console.log('不是本人提交 无权修改');
	}
	var isFormData = req.body.isFormData || false;
	var filename =Date.now()+req.files.coverImage.originalFilename;
	var targetPath = './public/upload/images/coverImage/'+filename;
	fs.createReadStream(req.files.coverImage.path).pipe(fs.createWriteStream(targetPath));
	;
	var coverImage =  '/upload/images/coverImage/'+filename;
	var obj = {
		coverImage:coverImage
	};
	Commodity.updateByCommodityId(commodityId,obj,function(err,info){
		if(err){
			return console.log(err);
		}
		console.log(info);
		console.log('更新成功');
		res.redirect('back');
	})
};
/*
* showCommodityDetail 展示商品详情
 */
exports.showCommodityDetail = function(req,res,next){
	var commodityId = req.params.id;
	var userId = req.session.user._id;
	Commodity.getCommodityById(commodityId,function(err,commodity){
		if(err){
			return console.log(err)
		}
		var visitedCount = commodity.visitedCount;
		var hostId = commodity.hostId[0];
		isSelf = hostId == userId ? true : false;
		// 取商品主人的信息  头像 信徒 闲置...
		User.getUserCommoditiesById(hostId,function(err,hoster){
			if(err){
				return console.log(err)
			}
			// console.log('商品拥有者  信息');
			// console.log(hoster);
			console.log(commodity)
			// 增加访问量
			Commodity.addCommodityVisited(commodityId,visitedCount,function(err){
				if(err){
					return console.log(err)
				}
				res.render('commodityShow/detail',{
					user:req.session.user,
					hoster:hoster,
					commodity:commodity,
					isSelf:isSelf
				})
			})
		})
	})
}
