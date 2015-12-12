var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var UserSchema = new Schema({
	name: { type: String},
	email: { type: String},
	nickName: { type: String},
	realName: { type: String},
	password: { type: String},
	header: { type: String, default:'/dist/images/nan.jpg'},
	qq: { type: Number},
	weChat: { type: String},
	sex: { type: String},
	birthday: { type: String},
	studentId: { type: Number},
	location: { type: String},
	phoneNum: { type: Number},
	createTime: { type: Date, default:Date.now()},
	focus: [{ type: ObjectId, ref:'User'}],
	follows: [{ type: ObjectId, ref:'User'}],
	hadFocus: [{ type: ObjectId, ref:'User'}], //取消关注的
	myCommodity: [{type: ObjectId, ref:'Commodity'}],
	reply: [{ type:ObjectId, ref:'Commodity'}],
	active: { type:Boolean, default:false},
	level: { type: Number, default:1},
	is_block: { type: Boolean, default: false}, // 是否被禁止
},{autoIndex: false})
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({level: -1});
var User = mongoose.model('User',UserSchema);
module.exports = User;
