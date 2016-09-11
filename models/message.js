var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * type:
 * reply: xx 在哪件商品下面回复了你
 * follow: xx 关注了你
 * at: xx @了你
 * notice: xxx 干了些 xxx 事情
 */

var MessageSchema = new Schema({
  type: { type: String },
  senderId: { type: ObjectId }, // 这条消息关联的人
  targetId: { type: ObjectId }, // 接受这条消息的人 ( 比如: 某件商品的主人 )
  commodityId: { type: ObjectId },
  replyId: { type: ObjectId }, // 该字段是指回复的某个消息的 id, 只有 type 类型是 reply 的时候, 才有值, 回复内容对应存储在 reply 中
  hasRead: { type: Boolean, default: false },
  createTime: { type: Date, default: Date.now }
}, { autoIndex: false });
MessageSchema.index({ targetId: 1, hasRead: -1, createTime: -1 });

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
