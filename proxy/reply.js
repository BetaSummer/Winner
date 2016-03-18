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

exports.newAndSave = function(content, commodityId, authorId, replyId, cb) {
  var reply = new Reply();
  reply.content = content;
  reply.commodityId = commodityId;
  reply.authorId = authorId;
  reply.replyId = replyId;
  reply.save(cb);
};
