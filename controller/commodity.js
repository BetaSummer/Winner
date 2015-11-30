var config = require('../config');
var authMiddleWare = require('../middlewares/auth');
var commodity = require('../proxy/commodity');
/*
* showIndex 显示首页
 */
exports.showIndex = function(req,res,next){
	res.render('commodityList/index');
};
/*
* showPublish 发布商品
 */
exports.showPublish = function(req,res,next){
	res.render('commodityShow/publish');
}
/*
* editCommodity 编辑商品
 */
exports.editCommodity = function(req,res,next){
	res.render('commodityShow/edit');
}
/*
* commodityDetail 商品详情
 */
exports.commodityDetail = function(req,res,next){
	res.render('commodityShow/detail');
}
