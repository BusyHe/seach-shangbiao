/**
 * Created by scriptTask on 2017/10/29.
 * Email: 525118368@qq.com
 */
const cheerio = require('cheerio');
const Brand = require('../api/brandInfo');
const BrandBrandModelModel = require('../mongodb/schema/brand').brands;
const sequence = require('../common/sequence');

const Script = function (list) {
    this.list = list;
    this.taskList = []
};

Script.prototype.startTask = function () {
    Promise.all(this.list.map((item, index) => getBrandData(item, index)).then(() => {

    }))
    // this.parentTask();
};

Script.prototype.parentTask = function () {
};

Script.prototype.childTask = function () {
}

function getBrandData(item, index) {
    return new Promise((resolve, reject) => {
        Brand.getBrand(item, 9, 1).then(data => {
            let tolsall, total, pages;
            let $ = cheerio.load(data);
            let noData = $('#NoDatas').text();
            if (!noData) {
                tolsall = $('#pages').find('a[name=tolsall]').text();
                total = tolsall.replace(/\S(\d*)\S/g, '$1'); // 获取总数
                pages = Math.ceil(total / 24); // 获取总页数
            } else {
                total = 0;
                pages = 0
            }
            getOneData({total, pages, name: item}).then(() => {

            })
        }).catch(err => {
            resolve();
            console.log(err)
        })
    })
}

function getOneData() {

}

module.exports = Script
