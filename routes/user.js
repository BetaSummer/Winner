var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var user = require('../controller/user');
var commodity = require('../controller/commodity');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// 用户个人账户
router.get('/:id', auth.loginRequired, user.showUserCenterIndex);
router.get('/:id/follows', auth.loginRequired, user.showMyFollows);
router.get('/:id/focus', auth.loginRequired, user.showMyFocus);
router.get('/:id/commodities', auth.loginRequired, user.showMyCommodity);

// 添加取消关注
router.put('/care/:id', auth.loginRequired, user.addFocus);
router.put('/depart/:id', auth.loginRequired, user.rmFocus);

router.get('/setting', auth.loginRequired, user.showSettingIndex);
router.post('/settingHeader', auth.loginRequired, multipartMiddleware, user.settingHeader);
router.post('/settingPass', auth.loginRequired, user.settingPass);

module.exports = router;
