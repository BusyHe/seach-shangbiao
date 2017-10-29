/**
 * Created by query on 2017/10/29.
 * Email: 525118368@qq.com
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let querySchema = new Schema({
    query: String,
    total: Number,
    pages: Number,
    time: {
        type: Date,
        default: Date.now
    }
});
exports.querys = mongoose.model('querys', querySchema);
