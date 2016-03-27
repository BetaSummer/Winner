// 评论回复
var Reply = require('../proxy/reply');
var Message = require('../proxy/message');

exports.showReply = function(req, res, cb) {
  res.render('reply/replyForm');
};

exports.addReply = function(req, res, cb) {
  var body = req.body;
  var content = body.content;
  var commodityId = body.commodityId;
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
      var authorId = authorReply.masterId;
      var type = 'reply';
      Message.newAndSave(type, masterId, authorId, commodityId, replyId, function(err, message) {
        if (err) {
          return console.log(err);
        }
        // 创建一个 message 显示在用户的动态那边
        console.log(message);
        // 最好的实现方案应该是用 socket 来帮助显示
      });
    });
  });
};
