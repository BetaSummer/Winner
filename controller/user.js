var User = require('../proxy/user');
var fs = require('fs');
var validator = require('validator');
var Message = require('../proxy/message');
var sendMessage = require('../common/message');
var hash = require('../common/helper').hash;


/**
 * showUserTop 首页显示优质用户
 */
exports.showTopUser = function(req, res, next) {
  var n = 30;
  User.getTopUser(n, function(err, users) {
    if (err) {
      return console.log(err);
    }
    res.render('topUser', {
      user: req.session.user,
      users: users
    });
  });
};

/**
 * showUserList 显示查找的用户列表
 */
exports.showUserList = function(req, res) {
  res.render();
};

/**
 * showUser 展示用户 detail
 */
exports.showUser = function(req, res) {
  res.render();
};

/**
 * searchUsers 根据用户输入条件查找用户
 */
exports.searchUsers = function(req, rest) {
  // 获取用户输入: 用户 id || 用户等级
  // 根据不同的字段查询
  // 返回查询结果
};

/**
 * blockUser 禁止用户 (封号)
 */
exports.blockUser = function(req, res) {
  // var userId = req.params.id;
  // 拿到用户 id , 更新用户的 isBlock 字段
  // var reason = req.body.reason;
  // 创建一个 message
};

/**
 * sendMessages 群发消息
 */
exports.sendMessage = function(req, res) {
  // 存入数据库消息
  // 这里要支持 socket 即实时的通知消息
};

/**
 * unBlockUser 解封用户
 */
exports.unBlockUser = function(req, res) {
  // 同样拿到用户 id 更新用户 isBlock 字段
  // 同样解封也要发布响应的通知
};


exports.showUserCenterIndex = function(req, res, next) {
  var userId = req.params.id;
  var selfId = req.session.user._id;
  var isSelf = userId == selfId ? true : false;
  
  User.getUserById(userId, function(err, user) {
    if (err) {
      return console.log(err);
    }
    if (!isSelf) {
      // 如果不是访问自己的个人页面 默认访问 用户的 商品列表页面
      return exports.showMyCommodity(req, res, next);
    }
    var page = req.query.page || 0;
    var limit = req.query.limit || 20;
    var query = {
      page: page,
      limit: limit
    };
    Message.getMessageUnread(selfId, query, function(err, messages) {
      if (err) {
        return console.log(err);
      }
      var getMessageBody = function(message) {
        var promise = new Promise(function(resolve, reject) {
          Message.generateMessage(message, function(err, message) {
            if (err) {
              return reject(err);
            }
            resolve(message);
          });
        });
        return promise;
      };
      var promises = messages.map(function(message) {
        return getMessageBody(message);
      });
      Promise.all(promises).then(function(messages) {
        res.render('user/news', {
          user: req.session.user,
          theUser: user,
          isSelf: isSelf,
          messages: messages,
          activeUserCenterIndex: true
        });
      }).catch(function(err) {
        return console.log(err);
      });
    });
  });
};


/**
 * showMyFollows 显示用户个人中心 我的粉丝
 */
exports.showMyFollows = function(req, res, next) {
  var userId = req.params.id;
  var selfId = req.session.user._id;
  var isSelf = userId == selfId ? true : false;
  var page = req.query.page || 0;
  var limit = req.query.limit || 0;
  var query = {
    page: page,
    limit: limit
  };

  User.getUserFollowsById(userId, query, function(err, user) {
    // @todo 异步拿到绝对正确的 focus
    // 这个 focus 是 userId 的 focus 不一定是 selfId 的 focus
    // 这边的 focus 必须是 selfId 的 focus
    var focus = user.focus;
    var follows = user.follows;
    var getFollowerRelationship = function(follower) {
      var followerId = follower._id; // type => object
      var promise = new Promise(function(resolve, reject) {
        if (_.some(focus, followerId)) {
          follower.mutual = true; // 表示当前用户 也关注了 follow 者
        }
        resolve(follower);
      });
      return promise;
    };

    var promises = follows.map(function(follower) {
      return getFollowerRelationship(follower);
    });

    Promise.all(promises).then(function(follows) {
      res.render('user/follows', {
        user: req.session.user,
        theUser: user,
        userList: follows,
        isSelf: isSelf,
        avtiveMyFollows: true
      });
    });
  });
};

/**
 * showMyFocus 显示用户个人中心的首页 我的关注
 */
exports.showMyFocus = function(req, res, next) {
  var userId = req.params.id;
  var selfId = req.session.user._id;
  var isSelf = userId == selfId ? true : false;
  User.getUserFocusById(userId, function(err, user) {
    /*
     focus:
     [ { header: '/dist/images/nan.jpg',
     nickName: '111',
     _id: 56614af2ce4976290de02140 },
     { header: '/dist/images/nan.jpg',
     nickName: '222',
     _id: 56614b06ce4976290de02141 },
     { header: '/dist/images/nan.jpg',
     nickName: '333',
     _id: 56614b1ace4976290de02142 } ],
     */
    if (err) {
      return console.log(err);
    }
    var focus = user.focus;
    var follows = user.follows;
    var getFocusRelationship = function(user) {
      var userId = user._id;
      var promise = new Promise(function(resolve, reject) {
        if (_.some(follows, userId)) {
          user.mutual = true; // 我关注的用户也在我的 follows 字段里面, 说明我关注的用户也关注了我
        }
        resolve(user);
      });
      return promise;
    };

    var promises = focus.map(function(user) {
      return getFocusRelationship(user);
    });

    Promise.all(promises).then(function(focus) {
      res.render('user/focus', {
        user: req.session.user,
        theUser: user,
        userList: focus,
        isSelf: isSelf,
        activeMyFocus: true
      });
    });
  });
};

/**
 * 处理关注和取消关注请求
 */
exports.addFocus = function(req, res, next) {
  var selfId = req.session.user._id;
  var userId = req.params.id;
  var focus = req.session.user.focus;
  // 如果请求的关注者 已经在关注列表里面 直接 return
  console.log(focus);
  console.log(_.some(focus, userId));
  if (_.some(focus, userId)) {
    return console.log('已经关注了');
  }
  User.addFocus(selfId, userId, function(err, user) {
    if (err) {
      return console.log(err);
    }
    console.log(user);
    Message.sendFollowMessage(selfId, userId, null, null, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log(req.session.user);
      req.session.user = user;
      console.log('关注成功');
    });
  });
};

exports.rmFocus = function(req, res, next) {
  var selfId = req.session.user._id;
  var userId = req.params.id;
  User.rmFocus(selfId, userId, function(err, user) {
    if (err) {
      return console.log(err);
    }
    req.session.user = user;
    console.log(user);
    // 数据操作之后应该及时更新session
    console.log('取消关注成功');
  });
};


/**
 * showMyCommodity 显示用户个人中心的首页 我的闲置
 */
exports.showMyCommodity = function showMyCommodity(req, res, next) {
  var userId = req.params.id;
  var isSelf = userId == req.session.user._id ? true : false;
  var page = req.query.page || 0;
  var limit = req.query.limit || 20;
  var query = {
    page: page,
    limit: limit
  };
  User.getUserCommoditiesById(userId, query ,function(err, doc) {
    if (err) {
      return console.log(err);
    }
    console.log('商品信息');
    console.log(doc.myCommodity); // 商品信息
    // 查找卖家信息。
    var statusFilter = function(commodities, status) {
      return commodities.filter(function(commodity) {
        return commodity.status === status;
      });
    };
    var commodities = doc.myCommodity;
    var onSale = statusFilter(commodities, 1);
    var onCheck = statusFilter(commodities, 0);
    var onRecheck = statusFilter(commodities, 5);
    var oversell = statusFilter(commodities, 2);

    User.getUserById(userId, function(err, user) {
      console.log('查找卖家信息。');
      console.log(user);
      res.render('user/commodity', {
        user: req.session.user,
        theUser: user,
        onSale: onSale,
        onCheck: onCheck,
        onRecheck: onRecheck,
        oversell: oversell,
        commodities: doc.myCommodity,
        isSelf: isSelf,
        activeCommodity: true
      });
    });
  });
};

/**
 * showSettingIndex 显示用户信息设置首页
 */
exports.showSettingIndex = function(req, res, next) {
  var id = req.session.user._id;

  User.getUserById(id, function(err, user) {
    if (err) {
      return console.log(err);
    }
    // Object.keys(user).forEach(function(k){
    // 	//req.session.user[k] = user[k];
    // });
    for (var k in user) {
      req.session.user[ k ] = user[ k ];
    }
    res.render('setting/info', {
      user: user
    });
  });
};

/**
 * 个人资料更新
 */
exports.settingIndex = function(req, res, next) {
  var userId = req.session.user._id;
  var body = req.body;
  var userInfo = {};
  User.updateUserInfo(userId, userInfo, function(err, info) {
    if (err) {
      return console.log(err);
    }
    return res.redirect('back');
  });
};

/**
 * showSettingHeader 显示用户信息设置头像
 */
exports.showSettingHeader = function(req, res, next) {
  res.render('setting/header', {
    user: req.session.user
  });
};
/**
 * 头像更新
 */
exports.settingHeader = function(req, res, next) {
  var userId = req.session.user._id;
  var isFormData = req.body.isFormData || false;
  var filename = Date.now() + req.files.userHeader.originalFilename;
  var targetPath = './public/upload/images/userHeader/' + filename;
  fs.createReadStream(req.files.userHeader.path).pipe(fs.createWriteStream(targetPath));
  var headerSrc = '/upload/images/userHeader/' + filename;
  // 更新数据库图像
  User.updateUserHeader(userId, headerSrc, function(err) {
    if (err) {
      return console.log(err);
    }
    // 及时更新session的头像
    req.session.user.header = headerSrc;
    if (!isFormData) {
      // 如果不是formaData方式上传的话就跳转
      res.redirect('/settingHeader');
    } else {
      res.json({
        code: 200,
        msg: {
          url: 'http://' + req.headers.host + headerSrc
        }
      });
    }
  });
};

/**
 * showSettingPass 显示用户信息设置密码
 */
exports.showSettingPass = function(req, res, next) {
  res.render('setting/password', {
    user: req.session.user
  });
};

/**
 * 密码更新
 */
exports.settingPass = function(req, res, next) {
  var userId = req.session.user._id;
  var oldPass = validator.trim(req.body.oldPassword);
  var newPass = validator.trim(req.body.newPassword);
  var reNewPass = validator.trim(req.body.reNewPassword);
  if (newPass !== reNewPass) {
    return console.log('两次密码输入不一致');
  }
  User.getUserById(userId, function(err, user) {
    // 加密原密码
    oldPass = hash(oldPass);
    if (oldPass !== user.password) {
      return console.log('原密码不正确');
    }
    // 加密新密码
    newPass = hash(newPass);
    User.updateUserPass(userId, newPass, function(err, info) {
      if (err) {
        return console.log(err);
      }
      console.log(info);
      console.log('密码更新成功');
    });
  });
};

/**
 * showSettingBind 显示用户信息设置绑定
 */
exports.showSettingBind = function(req, res, next) {
  res.render('setting/bind', {
    user: req.session.user
  });
};

/**
 * settingBind  帐号绑定更新
 */
exports.settingBind = function(req, res, next) {
};
