var validator = require('validator'); // 验证
var Commodity = require('../proxy').Commodity;
var Category = require('../proxy').Category;
var Admin = require('../proxy').Admin;
var User = require('../proxy').User;
var Reply = require('../proxy').Reply;
var sendMessage = require('../common/message');
var helper = require('../common/helper');
var fs = require('fs');

/**
 * index 显示首页
 */
exports.getCommodities = function(req, res, next) {
  var page = req.query.page || 0;
  var limit = req.query.limit || 20;
  var query = {}; // 查询条件： 比如导航，分页, 标签id
  Commodity.getCommodities(page, limit, query, function(err, commodities) {
    if (err) {
      return next(err)
    }
    var getUserInfo = function(commodity) {
      var promise = new Promise(function(resolve, reject) {
        var hostId = commodity.hostId;
        User.getUserById(hostId, function(err, user) {
          if (err) return reject(err);
          resolve(user);
        });
      });
      return promise;
    };

    var promises = commodities.map(function(commodity) {
      return getUserInfo(commodity);
    });

    Promise.all(promises).then(function(users) {
      Category.getCategory(function(err, categories) {
        if (err) {
          return console.log(err);
        }
        var firstCategories = categories.filter(function(category) {
          return category.leavel === 0;
        });
        var secondCategories = categories.filter(function(category) {
          return category.leavel === 1;
        });
        res.render('commodities/index', {
          user: req.session.user,
          commodities: commodities,
          users: users,
          firstCategories: firstCategories,
          secondCategories: secondCategories
        });
      });
    }).catch(function(err) {
      return console.log(err);
    });
  });
};



/**
 * showPublish 发布商品页面
 */
exports.showPublish = function(req, res, next) {
  // 标签信息单读的接口拿
  res.render('commodity/publish', {
    user: req.session.user, 
  });
};

/*
 * 发布商品 请求
 */
exports.publish = function(req, res, next) {
  var body = req.body;
  var userId = req.session.user._id;
  // console.log(body);
  // console.log(req.files);
  var filename = Date.now() + req.files.coverImage.originalFilename;
  var targetPath = './public/upload/images/coverImage/' + filename;
  fs.createReadStream(req.files.coverImage.path).pipe(fs.createWriteStream(targetPath));
  var coverImage = '/upload/images/coverImage/' + filename;
  // 这个手动一个个太不优雅,可以考虑遍历 body 才生成 newObj 对象,要注意字段确保一致
  var newObj = {
    title: validator.trim(body.title),
    // 这里类别 扩展性是不是有问题
    categoryId: validator.trim(body.categoryId.replace(/\"/gi, '')),
    // 商品名称
    name: validator.trim(body.name),
    howNew: validator.trim(body.howNew),
    price: validator.trim(body.price),
    coverImage: validator.trim(coverImage),
    gotTime: validator.trim(body.gotTime),
    gotPrice: validator.trim(body.gotPrice),
    phoneNum: validator.trim(body.phoneNum),
    userName: validator.trim(body.userName),
    qq: validator.trim(body.qq),
    weChat: validator.trim(body.weChat),
    content: validator.trim(body.content),
    hostId: userId
  };
  Commodity.newAndSave(newObj, function(err, commodity) {
    if (err) {
      return console.log(err);
    }
    var commodityId = commodity._id;
    // 创建 notice 给管理员
    // 更新 User 将新添加的 commodity 传入 user 的 myCommodity 字段
    // 更新用户 leavel ? 这个逻辑可以放到审核通过之后的回调函数里面.
    User.addMyCommodity(userId, commodityId, function(err, info) {
      if (err) {
        return console.log(err);
      }
      // 找到管理商品审核的管理员
      Admin.getCommodityAdmin(function(err, adminUsers) {
        if (err) {
          return console.log(err);
        }
        // 随机的选择一个管理员
        var targetId = adminUsers[ helper.randomArrIndex(adminUsers.length) ]._id;
        // 更新管理员的 myCommodity 字段
        Admin.addMyCommodity(targetId, commodityId, function(err) {
          if (err) {
            return console.log(err);
          }
          // 发送通知消息给管理员
          sendMessage.sendNoticeMessage(userId, targetId, commodityId, null, function(err, message) {
            if (err) {
              return console.log(err);
            }
            console.log(message);
            // req.session.user = user;
            res.redirect('/commodity/' + commodityId);
          });
        });
      });
    });
  });
};
// 麻痹 这回调!

/**
 * editCommodity 编辑商品
 */
exports.showCommodityEdit = function(req, res, next) {
  var commodityId = req.params.id;
  var userId = req.session.user._id;
  Commodity.getCommodityById(commodityId, function(err, commodity) {
    if (err) {
      return console.log(err);
    }
    var hostId = commodity.hostId;
    var categoryId = commodity.categoryId;
    if (userId != hostId) {
      console.log('没有权限');
      return res.redirect('back');
    }
    Category.getCategory(categoryId, function(err, category) {
      if (err) {
        return console.log(err);
      }
      res.render('commodity/edit', {
        user: req.session.user,
        commodity: commodity,
        category: category
      });
    });
  });
};

/**
 * 编辑商品内容的时候 拆分为多个表单了
 * 方便的解决方案 注意前端 name 字段和数据库字段保持一致
 */
exports.edit = function(req, res, next) {
  var commodityId = req.params.id;
  var userId = req.session.user._id;
  var obj = {};
  Commodity.getCommodityById(commodityId, function(err, commodity) {
    if (err) {
      console.log(err);
    }
    var hostId = commodity && commodity.hostId;
    if (hostId != userId) {
      var err = new Error('不是本人提交 无权修改');
      return console.error(err);
    }
    Commodity.updateByCommodityId(commodityId, obj, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('更新成功');
    });
  });
};

/**
 * editInfo 设置商品信息字段
 */
exports.editInfo = function(req, res, next) {
  var commodityId = req.params.id;
  var userId = req.session.user._id;
  var infoObj = {};
  Commodity.getCommodityById(commodityId, function(err, commodity) {
    if (err) {
      console.log(err);
    }
    var hostId = commodity && commodity.hostId;
    if (hostId != userId) {
      var err = new Error('不是本人提交 无权修改');
      return console.error(err);
    }
    Commodity.updateByCommodityId(commodityId, infoObj, function(err, info) {
      if (err) {
        return console.log(err);
      }
      console.log(info);
      res.redirect('back');
    });
  });
};

/**
 * editConnect 设置商品用户联系方式
 */
exports.editConnect = function(req, res, next) {
  var commodityId = req.params.id;
  var userId = req.session.user._id;
  var infoObj = {};
  Commodity.getCommodityById(commodityId, function(err, commodity) {
    if (err) {
      console.log(err);
    }
    var hostId = commodity && commodity.hostId;
    if (hostId != userId) {
      var err = new Error('不是本人提交 无权修改');
      return console.error(err);
    }
    Commodity.updateByCommodityId(commodityId, infoObj, function(err, info) {
      if (err) {
        return console.log(err);
      }
      console.log(info);
      res.redirect('back');
    });
  });
};

/**
 * editImg 编辑商品 处理 上传封面
 */
exports.editImg = function(req, res, next) {
  var commodityId = req.params.id;
  var userId = req.session.user._id;
  // var isFormData = req.body.isFormData || false;
  Commodity.getCommodityById(commodityId, function(err, commodity) {
    if (err) {
      console.log(err);
    }
    var hostId = commodity && commodity.hostId;
    if (hostId != userId) {
      var err = new Error('不是本人提交 无权修改');
      return console.error(err);
    }
    var filename = Date.now() + req.files.coverImage.originalFilename;
    var targetPath = './public/upload/images/coverImage/' + filename;
    fs.createReadStream(req.files.coverImage.path).pipe(fs.createWriteStream(targetPath));
    var coverImage = '/upload/images/coverImage/' + filename;
    var obj = {
      coverImage: coverImage
    };
    Commodity.updateByCommodityId(commodityId, obj, function(err, info) {
      if (err) {
        return console.log(err);
      }
      console.log(info);
      console.log('更新成功');
      res.redirect('back');
    });
  });
};

/**
 * showCommodityDetail 展示商品详情
 * addCommodityVisited 做相应的优化, 这边也可以做相应的优化
 */
var showCommodityDetail = exports.showCommodityDetail = function(req, res, next) {
  var commodityId = req.params.id;
  var userId = req.session.user._id;
  Commodity.getCommodityById(commodityId, function(err, commodity) {
    if (err) {
      return console.log(err);
    }
    var visitedCount = commodity.visitedCount;
    var hostId = commodity.hostId;
    var isSelf = hostId == userId ? true : false;
    var categoryId = commodity.categoryId;
    // 取商品主人的信息  头像 信徒 闲置...
    User.getUserCommoditiesById(hostId, function(err, hoster) {
      if (err) {
        return console.log(err);
      }
      var follows = hoster.follows;
      var focus = hoster.focus;
      // 如果能在商品作者的 follows 列表里面找到 访问者 id, 说明访问者关注了该用户
      var focused = follows.some(function(item) {
        return item == userId;
      });
      // 同理如果该用户的关注列表里面有访问者的话, 说明用户关注了访问者
      var followed = focus.some(function(item) {
        return item == userId;
      });
      // focused 和 followed 同时为 true 则是 两者互相关注了
      console.log('focused', focused, 'followed', followed);
      // 增加访问量
      Commodity.addCommodityVisited(commodityId, visitedCount, function(err) {
        if (err) {
          return console.log(err);
        }
        Category.getCategory(categoryId, function(err, category) {
          if (err) {
            return console.log(err);
          }
          // 用户的其他闲置
          // 还有评论相关的  可以用 滚动异步加载
          res.render('commodity/detail', {
            user: req.session.user,
            hoster: hoster,
            commodity: commodity,
            isSelf: isSelf,
            category: category,
            focused: focused,
            followed: followed
          });
        });
      });
    });
  });
};

/**
 * unPublish 下架某件商品
 */
exports.unPublish = function(req, res, next) {
  var commodityId = req.params.id;
  Commodity.setCommodityStatus(commodityId, 2, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('下架成功');
  });
};

/**
 * showCheckCommodityList 展示审核商品列表页面
 */
exports.showCheckCommoditiesList = function(req, res, next) {
  // 数据库查找没有被审核通过的商品 时间倒序排列.
  var adminId = req.session.user._id;
  // getUserCommoditiesById 方法定义在 proxy/user.js
  User.getUserCommoditiesById(adminId, function(err, document) {
    if (err) {
      return console.log(err);
    }
    var myCommodity = document.myCommodity;
    res.render('admin/showCommoditiesCheckList', {
      myCommodity: myCommodity
    });
  });
};

/**
 * showCheckCommodity 展示被审核的商品的详情
 */
exports.showCheckCommodity = function(req, res) {
  // 暂时先借一下这个页面
  // 理论上设计着的应该是一个弹出层
  return showCommodityDetail(req, res);
};

/**
 * rejectCommodity 商品审核驳回
 */
exports.rejectCommodity = function(req, res, next) {
  // var commodityId = req.body.commodityId;
  var commodityId = req.params.id;
  var adminId = req.session.user._id;
  var reason = req.body.reason;
  var hostId = req.body.hostId;
  // 1 修改商品状态为审核不通过
  Commodity.setCommodityStatus(commodityId, 3, function(err) {
    if (err) {
      return console.log(err);
    }
    // 2 找到商品主人 发送审核结果通知
    // 创建一条回复主体
    Reply.newAndSave(reason, commodityId, adminId, null, function(err, newReply) {
      if (err) {
        return console.log(err);
      }
      var replyId = newReply._id;
      sendMessage.sendNoticeMessage(adminId, hostId, commodityId, replyId, function(err) {
        if (err) {
          return console.log(err);
        }
        // 从管理员的 myCommodity 字段里面删除该 commodityId
        // 重新提交审核也是随机再选择一个管理员 万一另一个管理员瞎呢!
        Admin.rmMyCommodity(adminId, commodityId, function(err) {
          if (err) {
            return console.log(err);
          }
          console.log('回绝商品 并向他发送了一条回绝消息');
          return res.redirect('back');
        });
      });
    });
  });
};

/**
 * passCommodity 处理审核通过 commodity
 */
exports.passCommodity = function(req, res) {
  // var commodityId = req.body.commodityId;
  var commodityId = req.params.id;
  var commodityName = req.body.commodityName;
  var adminId = req.session.user._id;
  var hostId = req.body.hostId;
  // 更新 status 字段
  Commodity.setCommodityStatus(commodityId, 1, function(err) {
    if (err) {
      console.log(err);
    }
    Admin.rmMyCommodity(adminId, commodityId, function(err) {
      if (err) {
        return console.log(err);
      }
      Admin.addPassCommodity(adminId, commodityId, function(err) {
        if (err) {
          return console.log(err);
        }
        var content = '你发布的商品' + commodityName + '已经通过审核,正式上架了,感谢您!';
        Reply.newAndSave(content, commodityId, adminId, null, function(err, newReply) {
          if (err) {
            return console.log(err);
          }
          var replyId = newReply._id;
          sendMessage.sendNoticeMessage(adminId, hostId, commodityId, replyId, function(err) {
            if (err) {
              return console.log(err);
            }
            console.log('通过了用户的审核, 并向他发送了一条通知');
            return res.redirect('back');
          });
        });
      });
    });
  });
};

/**
 * searchCommodities 处理查询
 */
exports.searchCommodities = function(req, res) {
  // 拿到各种 req.body 的属性
  // 提供模糊查询
  // 查询返回结果
};

/**
 * blockCommodities 批量禁止某件商品
 */
exports.blockCommodities = function(req, res) {
  var commodities = req.body.commodities;
  if (!Array.isArray(commodities)) {
    return Commodity.blockCommodity(commodities, function() {
    });
  }
  commodities.forEach(function(index, item) {
    // 处理
    Commodity.blockCommodity(item, function() {
    });
    res.end();
  });
};
