//操作用户的方法。
var models = require('../models');
var User = models.User;
var Commodity = models.Commodity;
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
*  @param {Number} phoneNum 用户手机号码
*  @param {String}  password 用户密码
*  @param {String} nickName 用户暱称
*  @param {Function} cb 回调函数
*  cb:
*  - err
*  - user
 */
exports.newAndSave = function(phoneNum,password,nickName,cb){
	var user = new User();
	user.phoneNum = phoneNum;
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
* getUserByphone 通过电话查找用户
* @param { Number} 查找的电话
* @param { Function} cb 回调函数
 */
exports.getUserByPhone = function(phoneNum,cb){
	User.findOne({phoneNum:phoneNum},cb);
};

/*
* getUserFocusById 通过用户id来获取用户关注的用户
* @param { String} 用户的id
* @param { Function} 回调函数
* cb:
*   - err
*   - document 查找返回的文档
*   	- follows
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
*  cb:
*   - err
*   - document 查找返回的文档
*   	- follows
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
* cb:
*  - err
*  - document 查找返回的文档
*  	 -  myCommodity {array}  可以理解为id被id对应的对象取代
*  	 -  hostId {array}
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
		visitedCount:1,
	},options:{sort:{
		updateTime:-1
	}}})
	.exec(cb)
};

/*
*getCommodityHosterById 通过商品id 查找用户信息
* @params {Number} 商品id
* @params {Function} 回调函数
* - err/null
* - user 返回的用户
 */
exports.getCommodityHosterById = function(id,cb){
	Commodity.findOne({_id:id},function(err,commodity){
		if(err){
			cb(err)
		}
		var hostId = commodity.hostId;
		exports.getUserById(hostId,cb);
	});
};
/*
* getTopUser 获取前30名用户
*
* @param {Function} 回调函数
* - err
* - users  返回的用户
 */
exports.getTopUser = function(cb){
	User.find({})
	.sort({level:-1})  //level降序
	.limit(30)
	.exec(cb)
};

/*
* addFollow添加关注用户
* @param {Number} 被更新帐号id
* @param {Number} 需要添加的用户id
* @param {Function} 回调
*
* @link unique array values in Mongoose
* http://stackoverflow.com/questions/9640233/unique-array-values-in-mongoose
* https://docs.mongodb.org/manual/reference/operator/update/addToSet/
 */
exports.addFocus = function(id,userId,cb){
	User.update({_id:id},
		{$addToSet: {focus:userId}},function(err){
			if(err){
				return console.log(err)
			}
			// 更新被关注者的follows
			User.update({_id:userId},
				{$addToSet:{follows:id}},cb)
		});
};

/*
* rmFocus 取消关注用户
* @param {Number} 被更新帐号id
* @param {Number} 取消关注的用户id
* @param {Function} 回调
 */
exports.rmFocus = function(id,userId,cb){
	User.update({_id:id},
		//先将取消关注的id添加到hadFocus 字段里
		{$addToSet: {hadFocus:userId}},function(err){
			if(err){
				return console.log(err)
			}
			// 再将该id从focus里面删除
			User.update({_id:id},
				{$pull:{focus:userId}},function(err){
					if(err){
						return console.log(err)
					}
					// 再用户从原来被关注的人的follows字段里删除
					User.update({_id:userId},
						{$pull:{follows:id}},cb)
				});
		});
};

/*
* updateUserInfo 用户基本资料更新
* @param { String} 更新用户的id
* @param { Object} 更新用户的信息对象
* @param { Function} 回调函数
 */
exports.updateUserInfo = function(id,obj,cb){
	User.update({_id:id},
		{$set:{
			birthday:obj.birthday,
			nickName:obj.nickName,
			phoneNum:obj.phoneNum,
			realName:obj.realName,
			weChat:obj.weChat,
			sex:obj.sex,
			qq:obj.qq,
		}},
		{ upsert:true, multi: true },cb);
};
/*
* updateUserPass 根据id更新密码
* @param { String} 用户id
* @param { String} 用户新密码
* @param { Function} 回调函数
*   - err
*   - info 操作结果信息
 */
exports.updateUserPass = function(id,newPass,cb){
	User.update({_id:id},
		{$set:{
			password:newPass
		}},cb);
};

/*
*addMyCommodity 用户发布新商品之后 将商品id更新到myCommodity字段里面来
* @param {String} 用户的id
* @param {String} 新添加商品的id
* @param { Function} 回调函数
 */
exports.addMyCommodity = function(userId,commodityId,cb){
	User.update({_id:userId},
		{$addToSet: {myCommodity:commodityId}},cb);
}

 /*
 * updateUserHeader 根据id更新用户头像
 * @param { String} 用户id
 * @param { String} 用户头像路径
 * @param { Function} 回调函数
 *   - err
 *   - info 操作结果信息
  */
 exports.updateUserHeader= function(id,headerSrc,cb){
 	User.update({_id:id},
 		{$set:{
 			header:headerSrc
 		}},cb);
 };
