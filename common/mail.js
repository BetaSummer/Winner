// 发送邮件  验证
var mailer = require('nodemailer');
var util = require('util');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../config');
var transpoter = mailer.createTransport(smtpTransport(config.mail_opts));
var SITE_ROOT_URL = 'http://' + config.host;

/*
 * sendMail 发送邮件
 *  @param {Object} data邮件对象
 */
var sendMail = function(data) {
  transpoter.sendMail(data, function(err) {
    if (err) {
      console.log(err);
    }
  });
};

exports.sendMail = sendMail;

/*
 * sendActiveMail 发送邮箱激活
 * @param {String} userEmail 接受者的邮箱
 * @param {String} token 口令
 * @param {String} name 用户id
 *
 */
exports.sendActiveMail = function(userEmail, token, id) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = userEmail;
  var subject = config.name + '邮箱激活';
  var html = '<p>您好</p>' +
    '<p>感谢您使用' + config.name + '，请点击下面的链接来激活帐户：</p>' +
    '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&id=' + id + '">激活链接</a>' +
    '<p>若您没有在' + config.name + '进行邮箱激活操作，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.name + '敬上。</p>';
  sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};

/*
 * sendResetPasMail 邮箱重置密码
 * @param {String} userEmail 接受者的邮箱
 * @param {String} token 口令
 * @param {String} name 用户id
 */
exports.sendResetPasMail = function(userEmail, token, id) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = userEmail;
  var subject = config.name + '密码重置';
  var html = '<p>您好</p>' +
    '<p>我们收到您在' + config.name + '重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>' +
    '<a href  = "' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&id=' + id + '">重置密码链接</a>' +
    '<p>若您没有在' + config.name + '进行重置密码操作，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.name + '敬上。</p>';
  sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};
