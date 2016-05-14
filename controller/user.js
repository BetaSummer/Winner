var User = require('../proxy/user');
var fs = require('fs');
var validator = require('validator'); // 验证
var Message = require('../proxy/message');
var sendMessage = require('../common/message');
var crypto = require('crypto');
var _ = require('lodash');

var hash = function(psw) {
  return crypto.createHash('sha1').update(psw).digest('hex');
};

/*
 * showUserList 显示查找的用户列表
 */
exports.showUserList = function(req, res) {
  // 渲染用户列表
  res.render();
};

/*
 * showUser 展示用户 detail
 */
exports.showUser = function(req, res) {
  res.renser();
};

/*
 * searchUsers 根据用户输入条件查找用户
 */
exports.searchUsers = function(req, rest) {
  // 获取用户输入: 用户 id || 用户等级
  // 根据不同的字段查询
  // 返回查询结果
};

/*
 * blockUser 禁止用户 (封号)
 */
exports.blockUser = function(req, res) {
  // var userId = req.params.id;
  // 拿到用户 id , 更新用户的 isBlock 字段
  // var reason = req.body.reason;
  // 创建一个 message
};

/*
 * sendMessages 群发消息
 */
exports.sendMessage = function(req, res) {
  // 存入数据库消息
  // 这里要支持 socket 即实时的通知消息
};

/*
 * unBlockUser 解封用户
 */
exports.unBlockUser = function(req, res) {
  // 同样拿到用户 id 更新用户 isBlock 字段
  // 同样解封也要发布响应的通知
};

/*
 * showUserCenterIndex 显示用户个人中心的首页最新动态
 * 这边的逻辑 有很大问题
 * 当访问别人的个人中心页面的时候应该只能看到他的关注 他的信徒 和 他的闲置信息!
 * 当访问别人的个人中心页面的时候应该只能看到他的关注 他的信徒 和 他的闲置信息!
 * 当访问别人的个人中心页面的时候应该只能看到他的关注 他的信徒 和 他的闲置信息!
 * 当访问别人的个人中心页面的时候应该只能看到他的关注 他的信徒 和 他的闲置信息!
 * 当访问别人的个人中心页面的时候应该只能看到他的关注 他的信徒 和 他的闲置信息!
 /\
 ||
 ||
 ||
 ||
 ||
 //\\
 表强调
 */
exports.showUserCenterIndex = function(req, res, next) {
  var userId = req.params.id;
  var loginUserId = req.session.user._id;
  var isSelf = userId == loginUserId ? true : false;
  User.getUserById(userId, function(err, user) {
    if (err) {
      console.log(err);
    }
    Message.getMessageUnread(loginUserId, function(err, messages) {
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
        // 拿到的 messages 数组就是类似 一下数据结构 考虑一下怎么转化成 真实的文本内容
        // 需要根据不同的 type 拿内容
        // [  { hasRead: false,
        //  createTime: Mon Apr 04 2016 16:35:37 GMT+0800 (CST),
        //  __v: 0,
        //  type: 'notice',
        //  senderId: 56fb3e2e60ecf5760c6b5bac,
        //  targetId: 56fb3e2e60ecf5760c6b5bac,
        //  commodityId: 5700ed8c3ffc6c8165ce45f7,
        //  replyId: 57022759ff5d354c7080d939,
        //  _id: 57022759ff5d354c7080d93a } ]
        //  console.log(messages);
        res.render('userCenter/news', {
          user: req.session.user,
          theUser: user,
          isSelf: isSelf,
          messages: messages,
          activeUserCenterIndex: true
        });
      });
    });
  });
};

/*
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

/*
 * showMyFollows 显示用户个人中心 我的粉丝
 */
exports.showMyFollows = function(req, res, next) {
  var userId = req.params.id;
  var loginUserId = req.session.user._id;
  var isSelf = userId == loginUserId ? true : false;
  User.getUserFollowsById(userId, function(err, user) {
    // 这边 follows 可以拿到用户的一些数据, 但是用户和我之间的 关注关系 无法确定
    // 这边还要有这么一步
    // 还有就是分页那边, 提取的用户需要有 limit 属性
    // 用户关注 和 关注用户的 ids
    console.log('====================', user, '====================');
    var focus = user.focus;
    var follows = user.follows;
    var getFollowsRelationship = function(user) {
      var userId = user._id; // type => object
      var promise = new Promise(function(resolve, reject) {
        if (_.some(focus, userId)) {
          user.mutual = true; // 表示当前用户 也关注了 follow 者
        }
        console.log('-----', user, '---------');
        resolve(user);
      });
      return promise;
    };

    var promises = follows.map(function(user) {
      return getFollowsRelationship(user);
    });

    Promise.all(promises).then(function(follows) {
      res.render('userCenter/myFollows', {
        user: req.session.user,
        theUser: user,
        userList: follows,
        isSelf: isSelf,
        avtiveMyFollows: true
      });
    });
  });
};

/*
 * showMyFocus 显示用户个人中心的首页 我的关注
 */
exports.showMyFocus = function(req, res, next) {
  var userId = req.params.id;
  var loginUserId = req.session.user._id;
  var isSelf = userId == loginUserId ? true : false;
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
      res.render('userCenter/myFocus', {
        user: req.session.user,
        theUser: user,
        userList: focus,
        isSelf: isSelf,
        activeMyFocus: true
      });
    });
  });
};

/*
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
    console.log('已经关注了');
    return next();
  }
  User.addFocus(selfId, userId, function(err, user) {
    if (err) {
      return console.log(err);
    }
    console.log(user);
    sendMessage.sendFollowMessage(selfId, userId, null, null, function(err) {
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


/*
 * showMyCommodity 显示用户个人中心的首页 我的闲置
 */
exports.showMyCommodity = function(req, res, next) {
  var userId = req.params.id;
  var isSelf = userId == req.session.user._id ? true : false;
  User.getUserCommoditiesById(userId, function(err, doc) {
    if (err) {
      return console.log(err);
    }
    console.log('商品信息');
    console.log(doc.myCommodity); // 商品信息
    // 查找卖家信息。
    User.getUserById(userId, function(err, user) {
      console.log('查找卖家信息。');
      console.log(user);
      res.render('userCenter/myCommodity', {
        user: req.session.user,
        theUser: user,
        commodities: doc.myCommodity,
        isSelf: isSelf,
        activeCommodity: true
      });
    });
  });
};
/*
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
    res.render('setting/userSettingBase', {
      user: user
    });
  });
};

/*
 * 个人资料更新
 */
exports.settingIndex = function(req, res, next) {
  var userId = req.session.user._id;
  var body = req.body;
  // if(!validator.isDate(body.brithday)){
  // 	return console.log('生日信息不合法')
  // }
  var userInfo = {
    nickName: validator.trim(body.nickName),
    phoneNum: validator.trim(body.phoneNum),
    realName: validator.trim(body.realName),
    qq: validator.trim(body.qq),
    weChat: validator.trim(body.weChat),
    sex: validator.trim(body.sex),
    birthday: validator.trim(body.birthday)
  };
  User.updateUserInfo(userId, userInfo, function(err, info) {
    if (err) {
      return console.log(err);
    }
    return res.redirect('back');
  });
};

/*
 * showSettingHeader 显示用户信息设置头像
 */
exports.showSettingHeader = function(req, res, next) {
  res.render('setting/userSettingHeader', {
    user: req.session.user
  });
};
/*
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

/*
 * showSettingPass 显示用户信息设置密码
 */
exports.showSettingPass = function(req, res, next) {
  res.render('setting/userSettingPassword', {
    user: req.session.user
  });
};

/*
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

/*
 * showSettingBind 显示用户信息设置绑定
 */
exports.showSettingBind = function(req, res, next) {
  res.render('setting/userSettingBind', {
    user: req.session.user
  });
};

/*
 * settingBind  帐号绑定更新
 */
exports.settingBind = function(req, res, next) {
};
