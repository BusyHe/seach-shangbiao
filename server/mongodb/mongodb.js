/**
 * Created by mongodb on 2017/10/28.
 * Email: 525118368@qq.com
 */
/**
 * Created by busyhe on 2017/7/17.
 */
const mongoose = require('mongoose');

// mongoose初始化
mongoose.Promise = global.Promise; // 解决mongoose promise问题
const mongoDb = mongoose.connect('mongodb://127.0.0.1:27017/brand', {useMongoClient: true}).then(() => {
    console.log('数据库连接成功');
}, err => {
    console.log(`数据库连接失败${err}`)
});

module.exports = mongoDb;
