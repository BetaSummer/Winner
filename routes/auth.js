var express = require('express');
var router = express.Router();
var sign = require('../controller/sign');
var auth = require('../middlewares/auth');

// 用户注册登录
router.get('/reg', auth.notLoginRequired, sign.showReg);
router.post('/reg', auth.notLoginRequired, sign.reg);
router.get('/login', auth.notLoginRequired, sign.showLogin);
router.post('/login', auth.notLoginRequired, sign.login);
router.get('/logout', sign.logout);


module.exports = router;
