// 读消息内容的方法
var models = require('../models');
var Message = models.Message;
var User = require('./user');
var Reply = require('./reply');
var Commodity = require('./commodity');

/*
 * newAndSave 创建新的一条消息
 * @param { String } 消息类型
 * @param { String } 消息发送者 id
 * @param { String } 消息接受者 id
 * @param { String } 消息关联的商品 id
 * @param { String } 回复的某个消息 id
 * @param { Function } 回调函数
 */

exports.newAndSave = function(type, senderId, targetId, commodityId, replyId, cb) {
  User.getUserById(senderId, function(err, sender) {
    if (err) {
      return cb(err);
    }
    if (sender.isBlock) {
      return console.log('你已经被管理员禁止发言, 请联系良品管理员 hbb@betahouse.us!');
    }
    var message = new Message();
    message.type = type;
    message.senderId = senderId;
    message.targetId = targetId;
    message.commodityId = commodityId;
    message.replyId = replyId;
    message.save(function(err, message) {
      if (err) {
        cb(err);
      }
      cb(null, message);
    });
  });
};

/*
 * getUnreadMessageCount 获取还没有读取的消息数量
 * @param { String } 消息接受者的 id
 * @param { Function } 回调函数
 */
exports.getUnreadMessageCount = function(userId, cb) {
  Message.count({ targetId: userId, hasRead: false }, cb);
};


/*
 * getMessageById 根据消息 id 查找
 * @param { String } 消息 id
 */
exports.getMessageById = function(id, cb) {
  Message.findOne({ _id: id }, function(err, message) {
    if (err) {
      return console.log(err);
    }
    generateMessage(message, cb);
  });
};

/*
 * generateMessage 根据 message 的 type 生成相应的消息实体
 */
var generateMessage = exports.generateMessage = function(message, cb) {
  var replyId = message.replyId;
  var commodityId = message.commodityId;
  var targetId = message.targetId;
  var senderId = message.senderId;
  var type = message.type;
  var messageBody = {
    _id: message._id,
    replyId: replyId,
    commodityId: commodityId,
    targetId: targetId,
    senderId: senderId,
    type: type,
    createTime: createTime
  };
  //for(var key in message){
  //  if(message.hasOwnProperty(key)){
  //    messageBody[key] = message[key];
  //  }
  //}
  // var messageBody = Object.assign({}, message); // 冒出一大堆乱七八糟的东西 比如:$__
  User.getUserById(senderId, function(err, sender) {
    if (err) {
      return console.log(err);
    }
    User.getUserById(targetId, function(err, target) {
      if (err) {
        return console.log(err);
      }
      // message 的发送者 和 接收者
      messageBody.sender = sender;
      messageBody.target = target;
      console.log(messageBody);
      if (type == 'follow') {
        return cb(null, messageBody);
      }
      Commodity.getCommodityById(commodityId, function(err, commodity) {
        if (err) {
          return console.log(err);
        }
        messageBody.commodity = commodity;
        Reply.getReplyById(replyId, function(err, reply) {
          if (err) {
            return console.log(err);
          }
          messageBody.reply = reply;
          return cb(null, messageBody);
        });
      });
    });
  });
};

/*
 * getMessageUnread 根据 id 查找没有被阅读的消息, 消息按照时间倒序排列
 * @param { String } 接收者 id
 * @param { Function } 回调函数
 */

exports.getMessageUnread = function(userId, cb) {
  Message.find({ targetId: userId, hasRead: false }, null, { sort: '-createTime' }, cb);
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
 * @param { String } 消息的阅读者 id
 * @param { String/Array } 消息 id 数组
 * @param { Function } 回调函数
 */

exports.updateMessagesAsRead = function(userId, idArr, cb) {
  if (!Array.isArray(idArr)) {
    updateMessageAsRead(idArr, cb);
  }
  var query = { targetId: userId, _id: { $in: idArr } };
  Message.update(query, { $set: { hasRead: true } }, { multi: true }).exec(cb);
};
