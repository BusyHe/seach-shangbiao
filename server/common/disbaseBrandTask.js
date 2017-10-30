/**
 * Created by busyhe on 2017/10/30 下午7:34.
 * Email: 525118368@qq.com
 */
const cheerio = require('cheerio');
const Brand = require('../api/brandInfo');
const BrandBrandModelModel = require('../mongodb/schema/brand').brands;
const QueryModel = require('../mongodb/schema/query').querys;
const sequence = require('../util/sequence');
const delayTime = 1000;

const task = function () {
    QueryModel.find({}, function (err, docs) {
        getBrandInfo(docs)
    });
};

/**
 * 获取query每页列表
 * @param data
 */
function getBrandInfo(data) {
    let infoSteps = [];
    data.forEach(item => {
        if (item.pages === 0) {
            let brandEntity = new BrandBrandModelModel({
                query: item.query,
                total: item.total,
                pages: item.pages
            });
            brandEntity.save(function (err, result) {
                if (err) {
                    console.log(err)
                }
            });
        } else {
            for (let i = 0; i < item.pages; i++) {
                let pageNum = i + 1;
                infoSteps.push(() => {
                    return getBrandPagePromise(item, pageNum);
                })
            }
        }
    });
    sequence(infoSteps)
}

/**
 * 获取query每页列表promise
 * @param item
 * @param pageNum
 * @returns {Promise}
 */
function getBrandPagePromise(item, pageNum) {
    return new Promise(resolve => {
        Brand.getBrandInfo(item.query, 9, 1, pageNum).then(htmlDom => {
            console.log(`每页数据进度： ${item.query} | 页数：${pageNum}/${item.pages}`);
            filterHtml(item, htmlDom);
            setTimeout(() => {
                resolve();
            }, delayTime)
        }).catch(err => {
            console.log(err);
            setTimeout(() => {
                resolve();
            }, delayTime)
        })
    })
}

/**
 * 获取一页数据的列表
 * @param data
 * @param htmlData
 */
function filterHtml(data, htmlData) {
    let $ = cheerio.load(htmlData);
    $('.TMinfoList').each((i, e) => {
        let newItem = {
            id: $(e).parent().attr('href').replace(/[^=]+=(\d*)&[^*]+/g, '$1'),
            img: 'http://www.shangdun.org' + $(e).find('.img-responsive').attr('src'),
            name: $(e).find('.TMnm').text(),
            regis: $(e).find('.TMreg').text().replace(/(\d*)[^*]+/g, '$1'),
            nettype: $(e).find('.TMreg').text().replace(/[\d*][^（]+（(\d)\S）/g, '$1'),
            proposer: $(e).find('.TMagent').text(),
            status: $(e).find('.TMst').text()
        };
        let brandEntity = new BrandBrandModelModel({
            query: data.query,
            total: data.total,
            pages: data.pages,
            searchData: newItem
        });
        brandEntity.save(function (err, result) {
            if (err) {
                console.log(err)
            }
        });
    });
}

module.exports = task

