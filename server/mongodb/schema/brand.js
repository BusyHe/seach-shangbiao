/**
 * Created by one_brand_info on 2017/10/28.
 * Email: 525118368@qq.com
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let brandSchema = new Schema({
    query: String,
    searchData: {
        id: String,
        img: String,
        name: String,
        regis: String,
        nettype: String,
        proposer: String,
        status: String
    },
    total: Number,
    pages: Number,
    time: {
        type: Date,
        default: Date.now
    }
});
exports.brands = mongoose.model('brands', brandSchema);
