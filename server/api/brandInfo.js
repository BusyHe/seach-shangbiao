/**
 * Created by getBrandInfo on 2017/10/28.
 * Email: 525118368@qq.com
 */
const http = require('../util/http');

const brandInfo = {
    getBrandInfo(value, type, brandType, page) {
        return http.get('http://www.shangdun.org/Search/', {
            ST: brandType, // 1中文商标，2英文商标，3拼音商标
            qzhs: type, // 商标群组
            W: value, // 查询文字
            WT: value, // 查询文字
            PG: page, // 页数
            SRty: 1,
            G: `0${type}`
        })
    },
    getBrand(value, type, brandType) {
        return http.get('http://www.shangdun.org/Search/', {
            qzhs: type,
            WT: value,
            ST: brandType,
            Wz: '',
            SRty: 1
        })
    }
};

module.exports = brandInfo;
