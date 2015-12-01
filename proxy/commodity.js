//处理商品的数据库方法
var models = require('../models');
var Commodity = models.Commodity;

/*
* @param {Object} 上传对象
* - {title:xxx,price:xxx}
* @param {Function} cb 回调函数
 */
exports.newAndSave = function(obj,cb){
	console.log('objobjobjobjobjobjobj');
	console.log(obj);
	var commodity = new Commodity();
	commodity.title = obj.title;
	commodity.category = obj.category;
	commodity.name = obj.name;
	commodity.howNew = obj.howNew;
	commodity.price = obj.price;
	commodity.coverImg = obj.coverImg;
	commodity.getTime = obj.getTime;
	commodity.getPrice = obj.getPrice;
	commodity.phoneNum = obj.phoneNum;
	commodity.userName = obj.userName;
	commodity.qq = obj.qq;
	commodity.weChat = obj.weChat;
	commodity.content = obj.content;
	commodity.hostId = obj.hostId;
	commodity.save(cb);
}
