// 引入要用到的JS模块
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 创建 schema
var userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    location: String,
    meta: {
        age: Number,
        website: String
    },
    created_at: Date,
    updated_at: Date
});

// 现在的 schema 还是没什么用的
// 我们还需要在它的基础上创建一个模型 (model)
var User = mongoose.model('User', userSchema);

// 导出我们之前定义好的 user model
module.exports = User;