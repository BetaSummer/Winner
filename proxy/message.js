// 读消息内容的方法
var models = require('../models');
var Message = models.Message;
var User = require('./user');


/*
 * newAndSave 创建新的一条消息
 * @param { String } 消息类型
 * @param { String } 消息创建者 id
 * @param { Array } 消息被 @ 到的同学
 * @param { String } 消息接受者(商品拥有者) id
 * @param { String } 消息关联的商品 id
 * @param { String } 回复的某个消息 id
 * @param { Function } 回调函数
 */
exports.newAndSave = function(type, masterId, atId, authorId, commodityId, replyId, cb) {
  User.getUserById(masterId, function(err, master) {
    if (err) {
      return cb(err);
    }
    if (master.isBlock) {
      return console.log('你已经被管理员禁止发言, 请联系良品管理员 hbb@betahouse.us!');
    }
    var message = new Message();
    message.type = type;
    message.masterId = masterId;
    message.atId = atId;
    message.authorId = authorId;
    message.commodityId = commodityId;
    message.replyId = replyId;
    message.save(cb);
  });
};

/*
 * getMessageById 根据消息 id 查找
 * @param { String } 消息 id
 */
exports.getMessageById = function(id, cb) {
  Message.findOne({ _id: id }, cb);
};

/*
 * getMessageUnread 根据 id 查找没有被阅读的消息
 * @param { String } 接收者 id
 * @param { Function } 回调函数
 */

exports.getMessageUnread = function(authorId, cb) {
  Message.findOne({ authorId: authorId, hasRead: false }, cb);
};


/*
 * updateMessageAsRead 将某个消息更新为已读
 * @param { String } 消息 id
 * @param { Function } 回调函数
 */
var updateMessageAsRead = exports.updateMessageAsRead = function(id, cb) {
  Message.findOneAndUpdate({ _id: id },
    {
      $set: {
        hasRead: true
      }
    }, cb);
};

/*
 * updateMessageAsUnread 将某个消息更新为未读
 * @param { String } 消息 id
 * @param { Function } 回调函数
 */
exports.updateMessageAsUnread = function(id, cb) {
  Message.findOneAndUpdate({ _id: id },
    {
      $set: {
        hasRead: false
      }
    }, cb);
};

/*
 * updateMessagesAsRead 将几个消息更新为已读
 * @param { Array } 消息 id 数组
 * @param { Function } 回调函数
 */

exports.updateMessagesAsRead = function(idArr, cb) {
  if (!Array.isArray(idArr)) {
    updateMessageAsRead(idArr, cb);
  }
  idArr.forEach(function(index, item) {
    updateMessageAsRead(item, cb);
  });
};
