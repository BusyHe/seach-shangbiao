/**
 * Created by one_brand_info on 2017/10/28.
 * Email: 525118368@qq.com
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var brandSchema = new Schema({
    query: String,
    searchData: {
        id: '',
        img: String,
        name: String,
        proposer: String,
        status: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});
exports.brands = mongoose.model('brands', brandSchema);
