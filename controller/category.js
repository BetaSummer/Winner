// 商品类目管理
var Category = require('../proxy').Category;
var validator = require('validator');
exports.showAddCategory = function(req,res,next){
	res.render('admin/addCategory',{
		user:req.session.user
	})
};
// exports.createCategory = function(req,res,next){
// 	var categoryObj = req.body;
// 	Object.keys(categoryObj).forEach(function(k){
// 		if(categoryObj[k]==''){
// 			return cb('信息填写不完整');
// 		}
// 		categoryObj[k] = validator.trim(categoryObj[k]);
// 	});
// 	Category.newAndSave(categoryObj,function(err,category){
// 		if(err){
// 			return console.log(err)
// 		}
// 		console.log(category)
// 	});
// };

// 添加第一级导航
exports.addFirstNav = function(req,res,next){
	console.log(req.body)
};
// // 添加第二级导航
// exports.addSecondNav = function(req,res,next){
// 	console.log(req.body)
// };
// // 删除一级目录
// exports.deleteFirstNav = function(req,res,next){
// 	//同时删除对应的二级目录
// };
// // 删除二级目录
// exports.deleteSecondNav = function(req,res,next){
// };
// //获取所有的一级目录
// exports.getAllFirstNav = function(req,res,next){
// };
// // 获取所有的二级目录
// exports.getAllSecondNav = function(req,res,next){
// };
