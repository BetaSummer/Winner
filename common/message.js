// 向用户推送消息的内容
var Message = require('./../proxy/').Message;

/*
 * sendReplyMessage 向用户发送被回复的消息
 * @param { String } 消息发送者 id
 * @param { String } 消息接受者 id
 * @param { String } 消息关联的商品 id
 * @param { String } 消息关联的评论 id
 * @param { Function } 回调函数
 *  - err 数据库异常错误
 *  - message 保存的消息 obj
 */
exports.sendReplyMessage = function(senderId, targetId, commodityId, replyId, cb) {
  Message.newAndSave('reply', senderId, targetId, commodityId, replyId, cb);
};

/*
 * sendFollowMessage 向用户发送被关注的消息
 * @param { String } 消息发送者 id
 * @param { String } 消息接受者 id
 * @param { String } 消息关联的商品 id
 * @param { String } 消息关联的评论 id
 * @param { Function } 回调函数
 *  - err 数据库异常错误
 *  - message 保存的消息 obj
 */
exports.sendFollowMessage = function(senderId, targetId, commodityId, replyId, cb) {
  Message.newAndSave('follow', senderId, targetId, commodityId, replyId, cb);
};


/*
 * sendAtMessage 向用户发送被 at 的消息
 * @param { String } 消息发送者 id
 * @param { String } 消息接受者 id
 * @param { String } 消息关联的商品 id
 * @param { String } 消息关联的评论 id
 * @param { Function } 回调函数
 *  - err 数据库异常错误
 *  - message 保存的消息 obj
 */
exports.sendAtMessage = function(senderId, targetId, commodityId, replyId, cb) {
  Message.newAndSave('at', senderId, targetId, commodityId, replyId, cb);
};

/*
 * sendNoticeMessage 向用户发送通知的消息
 * @param { String } 消息发送者 id
 * @param { String } 消息接受者 id
 * @param { String } 消息关联的商品 id
 * @param { String } 消息关联的评论 id
 * @param { Function } 回调函数
 *  - err 数据库异常错误
 *  - message 保存的消息 obj
 */

exports.sendNoticeMessage = function(senderId, targetId, commodityId, replyId, cb) {
  Message.newAndSave('notice', senderId, targetId, commodityId, replyId, cb);
};


