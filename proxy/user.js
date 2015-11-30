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
*  @param {String} nickName 用户暱称
*  @param {String}  password 用户密码
*  @param {Function} cb 回调函数
*  cb:
*  - err
*  - user
 */
exports.newAndSave = function(phone,nickName,password,cb){
	var user = new User();
	user.nickName = nickName;
	user.phone = phone;
	user.password = password;
	user.save(cb);
};
