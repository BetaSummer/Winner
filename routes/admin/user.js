var express = require('express');
var router = express.Router();
var sign = require('../../controller/sign');
var auth = require('../../middlewares/auth');
var user = require('../../controller/user');
var commodity = require('../../controller/commodity');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
// 用户注册登录 
router.get('/add', auth.loginRequired, sign.showReg);
router.post('/add', auth.loginRequired, sign.reg);
router.get('/', sign.showLogin);
router.get('/login', auth.notLoginRequired, sign.showLogin);
router.post('/login', auth.notLoginRequired, sign.login);
router.get('/logout', sign.logout);

router.get('/', user.showUserList);
// 用户个人账户
router.get('/:id', auth.loginRequired, user.showUserCenterIndex);
router.get('/:id/follows', auth.loginRequired, user.showMyFollows);
router.get('/:id/focus', auth.loginRequired, user.showMyFocus);
router.get('/:id/commodities', auth.loginRequired, user.showMyCommodity);

// 修改用户状态
router.put('/:id/block', user.blockUser);
router.put('/:id/unblock', user.unBlockUser);
module.exports = router;