var config = {
  name: '杭电良品',
  host: '', // 域名
  // mongoose 配置
  db: 'mongodb://127.0.0.1/hdulp',
  // redis 配置
  redis_host: '127.0.0.1',
  redis_port: 6379,
  session_secret: '',
  // 邮箱配置
  mail_opts: {
    host: 'smtp.126.com', // 邮箱主机
    port: 25,
    auth: {
      user: 'hdulp@126.com',
      pass: ''
    }
  }
};

module.exports = config;
