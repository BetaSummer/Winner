var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var AdminSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  header: { type: String, default: '/dist/images/nan.jpg' },
  phoneNum: { type: Number },
  createTime: { type: Date, default: Date.now() },
  myCommodity: [ { type: ObjectId, ref: 'Commodity' } ], // 当前我还没有处理的 commodity
  passCommodity: [ { type: ObjectId, ref: 'Commodity' } ], // 我处理通过的 commodity
  reply: [ { type: ObjectId, ref: 'Reply' } ], // 我创建的管理回复
  messages: [ { type: ObjectId, ref: 'Message' } ], // 我触发创建的消息
  root: { type: Number, default: 1 }, // 管理员等级
  isBlock: { type: Boolean, default: false } // 是否被禁止
}, { autoIndex: false });
AdminSchema.index({ email: 1 }, { unique: true });
AdminSchema.index({ root: -1 });
var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
