var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// reply 模块只处理商品消息回复这块
// 管理员 审核不通过的评论

var ReplySchema = new Schema({
  content: { type: String },
  commodityId: { type: ObjectId },
  authorId: { type: ObjectId },
  replyId: { type: ObjectId }, // 回复某条 reply
  createTime: { type: Date, default: Date.now() },
  updateTime: { type: Date, default: Date.now() },
  deleted: { type: Boolean, default: false }
  // 被回复的 ids ？
}, { autoIndex: false });

ReplySchema.index({ commodityId: 1 });

ReplySchema.index({ authorId: 1, createTime: -1 });

var Reply = mongoose.model('Reply', ReplySchema);
module.exports = Reply;
