// 回复消息的方法
var Reply = require('../models').Reply;

/*
 * newAndSave 创建新的一个回复内童
 * @param { String } 回复文本内容
 * @param { String } 评论的商品 id
 * @param { String } 创建评论的用户 id
 * @param { String } 回复某条评论的 id，一级评论该值为空字符串
 * @param { Function } 回调函数
 */

exports.newAndSave = function(content, commodityId, senderId, replyId, cb) {
  var reply = new Reply();
  reply.content = content;
  reply.commodityId = commodityId;
  reply.senderId = senderId;
  reply.replyId = replyId;
  reply.save(cb);
};

/*
 * getReplyById 根据 id 返回回复信息
 * @param { String } reply 的 id
 * @param { Function } 回调函数
 *
 */
exports.getReplyById = function(id, cb) {
  if (!id) {
    return cb(null, null);
  }
  Reply.findOne({ _id: id }, cb);
};

/*
 * updateReply 更新 reply 的一些信息,
 * @param { String }需要更新信息的 repy id
 * @param { Object } 需要更新的一个字段与值的对象, reply 可以更新 content uodateTime deleted 字段
 * @param { Function } 回调函数
 */
exports.updateReply = function(id, obj, cb) {
  // 处理 obj 中的数据
  // 数据安全控制

  // obj 对象不存在的字段 不需要更新, 所以这里的数据库更新写法可能有待改进
  Reply.findByIdAndUpdate(id, {
    $set: obj
  }, cb);
};
