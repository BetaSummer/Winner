// 评论回复
var Reply = require('../proxy/reply');
var Message = require('../proxy/message');

exports.showReply = function(req, res, next) {
  res.render('reply/replyForm');
};

exports.addReply = function(req, res, next) {
  var body = req.body;
  var content = body.content;
  var commodityId = body.commodityId;
  var atId = body.atId; // 这个 atId 可能需要通过 @ 关键词正则过滤得到
  var masterId = body.masterId;
  var replyId = body.replyId;
  Reply.newAndSave(content, commodityId, masterId, replyId, function(err, newReply) {
    if (err) {
      return console.log(err);
    }
    console.log('回复成功', newReply);
    Reply.findReplyById(replyId, function(err, authorReply) {
      if (err) {
        return console.log(err);
      }
      // 发送 messaged 消息给用户, type 为 replynewAndSave
      // 这里我们需要拿到 authorId
      var authorId = authorReply && authorReply.masterId;
      // 判断 authorId 是否为数组.
      var type = 'reply';
      // masterId 是创建评论的用户 id
      // authorId 是接受回复的用户 id
      // authorId 需要做一下改进
      // 比如在意见商品里评论,需要通知的可能有两个 一个是被回复的人, 还有一个商品的拥有者
      Message.newAndSave(type, masterId, atId, authorId, commodityId, replyId, function(err, message) {
        if (err) {
          return console.log(err);
        }
        // 创建一个 message 显示在用户的动态那边
        console.log('创建 message 成功', message);
        // 最好的实现方案应该是用 socket 来帮助显示
        // do something
        res.send();
      });
    });
  });
};

exports.deleteReply = function(req, res, next) {
  var replyId = req.params.id;
  // 创建需要更新的对象的一个字段
  var obj = {};
  Reply.updateReply(replyId, obj, function(err) {
    if (err) {
      return console.log(err);
    }
    // 更新成功 do something
  });
};
