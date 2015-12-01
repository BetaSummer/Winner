//操作用户的方法。
var models = require('../models');
var User = models.User;
/*
* 根据用户id 返回用户
*  @param {String} id 用户id
*  @param {Function} cb 回调函数
*  cb:
*  - err
*  - user 用户
 */
exports.getUserById = function(id,cb){
	if(!id){
		return cb();
	}
	User.findOne({_id:id},cb);
};

/*
* 创建新用户
*  @param {Number} phone 用户手机号码
*  @param {String}  password 用户密码
*  @param {String} nickName 用户暱称
*  @param {Function} cb 回调函数
*  cb:
*  - err
*  - user
 */
exports.newAndSave = function(phone,password,nickName,cb){
	var user = new User();
	user.phone = phone;
	user.password = password;
	user.nickName = nickName;
	user.save(cb);
};
/*
* getUserByEmail 通过邮箱查找用户
* @param { String} 查找的邮箱
* @param { Function} cb 回调函数
 */
exports.getUserByEmail = function(email,cb){
	User.finfOne({email:email},cb);
};
/*
* getUserByPhone 通过电话查找用户
* @param { Number} 查找的电话
* @param { Function} cb 回调函数
 */
exports.getUserByPhone = function(phone,cb){
	User.findOne({phone:phone},cb);
};

/*
* getUserFocusById 通过用户id来获取用户关注的用户
* @param { String} 用户的id
* @param { Function} 回调函数
 */
exports.getUserFocusById = function(id,cb){
	User.findOne({_id:id})
	.populate({path:'focus',select:{
		_id:1,
		nickName:1,
		header:1,
		location:1
	},options:{sort:{level:-1}}})
	.exec(cb)
};
/*
* getUserFollowsById 通过用户id来获取用户的粉丝
* @param { String} 用户的id
* @param { Function} 回调函数
 */
exports.getUserFollowsById = function(id,cb){
	User.findOne({_id:id})
	.populate({path:'follows',select:{
		_id:1,
		nickName:1,
		header:1,
		location:1
	},options:{sort:{level:-1}}})
	.exec(cb)
};

/*
* getUserCommoditiesById 通过用户id获取商品
* @param { String} id
* @param { Function} 回调函数
*/
exports.getUserCommoditiesById = function(id,cb){
	User.findOne({_id:id})
	.populate({path:'myCommodity',select:{
		_id:1,
		price:1,
		title:1,
		coverImg:1,
		updateTime:1,
		replyCount:1,
		visitedCount:1
	},options:{sort:{
		updateTime:-1
	}}})
	.exec(cb)
}
