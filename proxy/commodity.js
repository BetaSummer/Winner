//处理商品的数据库方法
var validator = require('validator'); // 验证
var models = require('../models');
var Commodity = models.Commodity;
var User = models.User;

/*
* getCommodityById 通过id获取商品
* @param {String} 商品id
* @param {Function} 回调函数
*  - err
*  - obj
 */
exports.getCommodityById = function(id,cb){
	Commodity.findOne({_id:id},cb)
}


/*
* @param {Object} 上传对象
* - {title:xxx,price:xxx}
* @param {Function} cb 回调函数
* - err
* - commodity {object}
 */
exports.newAndSave = function(obj,cb){
	var commodity = new Commodity();
	Object.keys(obj).forEach(function(k){
		commodity[k] = obj[k];
	});
	commodity.save(cb);
};



/*
*  getCommodities 根据更新时间排序，
*  然后从第skip开始取limit个commodity
*  @param {Number}  skip 跳过的值
*  @param {Number}  limit 取的值
*  @param {Function} 回调函数
*  - err
*  - commodities {Array}
 */
exports.getCommodities = function(skip,limit,cb){
	Commodity.find({})
	.sort({updateTime:-1})
	.skip(skip)
	.limit(limit)
	.exec(cb);
};

/*
* getCommodityHoster 根据商品来获取主人的头像，暱称，id
* @param {Number}  商品id
* @param {Number}  回调函数
*  - err
*  - doc {object}
 */
exports.getCommodityHoster = function(commodityId,cb){
	Commodity.findOne({_id:commodityId})
	.populate({path:'hostId',select:{
		_id:1,
		header:1,
		nickName:1
	}})
	.exec(cb);
};

/*
* updateByCommodityId 根据商品id更新商品信息
* @param {String} 商品id
* @param {Object} 需要更新的信息内容
* @param {Function} 回调函数
*  - err
*  - info
 */
exports.updateByCommodityId = function(id,obj,cb){
	Commodity.update({_id:id},
		{$set:obj},
		// {$set:{
		// 	title:obj.title,
		// 	content:obj.content,
		// 	category:obj.category,
		// 	howNew:obj.howNew,
		// 	price:obj.price,
		// 	gotPrice:obj.gotPrice,
		// 	gotTime:obj.gotTime,
		// 	phoneNum:obj.phoneNum,
		// 	weChat:obj.weChat,
		// 	sex:obj.sex,
		// 	qq:obj.qq,
		// }},
		{ upsert:true, multi: true },cb);
};

/*
* addCommodityVisited 添加浏览量
 */
exports.addCommodityVisited = function(id,visitedCount,cb){
	Commodity.update({_id:id},
		{$set:{visitedCount:visitedCount+1}},cb);
}
