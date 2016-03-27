var express = require('express');
var router = express.Router();
var sign = require('../controller/sign');
var auth = require('../middlewares/auth');
var commodity = require('../controller/commodity');
var user = require('../controller/user');
var reply = require('../controller/reply');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/', commodity.showIndex);
// router.get('/userTop',user.showTopUser);

router.get('/reg', auth.notLoginRequired, sign.showReg);
router.post('/reg', auth.notLoginRequired, sign.reg);
router.get('/login', auth.notLoginRequired, sign.showLogin);
router.post('/login', auth.notLoginRequired, sign.login);
router.get('/logout', sign.logout);
router.get('/forgetPass', function(req, res, next) {
  res.render('index', {
    title: '忘记密码界面'
  });
});
// 个人中心
router.get('/user/:id', auth.loginRequired, user.showUserCenterIndex);
router.get('/user/:id/follows', auth.loginRequired, user.showMyFollows);
router.get('/user/:id/focus', auth.loginRequired, user.showMyFocus);
router.get('/user/:id/commodity', auth.loginRequired, user.showMyCommodity);
// 添加取消关注
router.get('/addFocus/:id', auth.loginRequired, user.addFocus);
router.get('/rmFocus/:id', auth.loginRequired, user.rmFocus);

// 用户信息设置
router.get('/setting', auth.loginRequired, user.showSettingIndex);
router.get('/settingHeader', auth.loginRequired, user.showSettingHeader);
router.get('/settingPass', auth.loginRequired, user.showSettingPass);
router.get('/settingBind', auth.loginRequired, user.showSettingBind);

router.post('/setting', auth.loginRequired, user.settingIndex);
router.post('/settingHeader', auth.loginRequired, multipartMiddleware, user.settingHeader);
router.post('/settingPass', auth.loginRequired, user.settingPass);
router.post('/settingBind', auth.loginRequired, user.settingBind);

// 展示商品
router.get('/publish', auth.loginRequired, commodity.showPublish);
router.get('/edit/:id', auth.loginRequired, commodity.showEditCommodity);
router.get('/commodity/:id', auth.loginRequired, commodity.showCommodityDetail);

// 评论或者回复
// demo 暂时没有添加中间件
router.get('/reply', reply.showReply);
router.post('/reply', reply.addReply);
router.post('deleteReply/:id', reply.deleteReply);

// 操作商品
router.post('/publish', auth.loginRequired, multipartMiddleware, commodity.publish);
router.post('/edit/:id/hostId/:hostId', auth.loginRequired, multipartMiddleware, commodity.edit);
router.post('/editInfo/:id/hostId/:hostId', auth.loginRequired, commodity.editInfo);
router.post('/editImg/:id/hostId/:hostId', auth.loginRequired, multipartMiddleware, commodity.editImg);
router.post('/editConnect/:id/hostId/:hostId', auth.loginRequired, commodity.editConnect);

module.exports = router;
