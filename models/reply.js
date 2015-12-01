var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ReplySchema = new Schema({
	content: { type: String},
	commodityId: {type: ObjectId},
	authorId: { type: ObjectId},
	replyId: { type: ObjectId},
	createTime: { type: Date, default: Date.now()},
	updateTime: { type: Date, default: Date.now()},
	deleted: { type: Boolean, default:false},
},{autoIndex: false});

ReplySchema.index({commodityId:1});
ReplySchema.index({authorId:1,createTime:-1});

var Reply = mongoose.model('Reply', ReplySchema);
module.exports = Reply;
