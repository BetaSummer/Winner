var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/*
* type:
* reply: xx 在哪件商品下面回复了你
* follow: xx 关注了你
* at: xx @了你
 */

var MessageSchema = new Schema({
	type: { type:String},
	authorId: { type: ObjectId},
	commodityId: { type: ObjectId},
	replyId: { type: ObjectId},
	hasRead: { type: Boolean, default:false},
	createTime: { type: Date, default: Date.now()}
},{autoIndex: false});

MessageSchema.index({hasRead:-1,createTime:-1});

mongoose.model('Message',MessageSchema);
