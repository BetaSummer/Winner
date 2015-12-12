// 操作商品目录的一些操作
var Category = require('../models').Category;
var validator = require('validator');
/*
* checkCatetory 检测category 是否已经存在
* @param { String} 第一级目录
* @param { String} 第二级目录
 */
var checkCatetory = function(f,s){
	Category.find({},function(err,category){
		if(err){
			cb(err)
		}
		var hadFirst = category.firstNav.some(function(item){
			return item == f
		});
		var hadSecond = category.secondNav.some(function(item){
			return item.secondNav == s
		});
	});
	if(hadFirst&&!hadSecond){
		// 应该更新 第二个导航
	}
	if(hadFirst&&hadSecond){
		//一级标签个 二级标签都已经存在
	}
	if(!hadFirst){
		// 新插入 一级标签和 二级标签
	}
};
/*
* newAndSave 创建第一个的目录
* @param {Object} 要存的目录对象
* @param {Function} 回调函数
 */
exports.newAndSave = function(categoryObj,cb){
	var category = new Category();
	var firstNav = categoryObj.firstNav;
	var secondNav = {
		firstNav:firstNav,
		secondNav:categoryObj.secondNav
	};
	category.firstNav = firstNav;
	category.secondNav = secondNav;
	category.save(cb)
};
