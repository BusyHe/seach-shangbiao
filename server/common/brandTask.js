/**
 * Created by scriptTask on 2017/10/29.
 * Email: 525118368@qq.com
 */
const cheerio = require('cheerio');
const Brand = require('../api/brandInfo');
const BrandBrandModelModel = require('../mongodb/schema/brand').brands;
const sequence = require('../util/sequence');
const delayTime = 1000;

const Script = function (list) {
    this.list = list;
};

Script.prototype.startTask = function () {
    getBrandList(this.list)
};

/**
 * 获取所有query的页数
 * @param list
 */
function getBrandList(list) {
    let steps = [];
    list.forEach((item, index) => {
        steps.push(() => {
            return new Promise(resolve => {
                Brand.getBrand(item, 9, 1).then(data => {
                    let queryData = bindQuery(data, item, index, list.length);
                    setTimeout(() => {
                        resolve(queryData);
                    }, delayTime);
                }).catch(err => {
                    console.log(err);
                    setTimeout(() => {
                        resolve({
                            query: item,
                            total: 0,
                            pages: 0,
                            err: true
                        });
                    }, delayTime);
                })
            })
        })
    });
    sequence(steps).then(datas => {
        getBrandInfo(datas);
    })
}

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
            console.log(`每页数据进度：${item.progress} | ${item.query} | 页数：${pageNum}/${item.pages}`);
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
 *
 * @param data
 */
function bindQuery(data, item, index, listLength) {
    let totalall, total, pages;
    let $ = cheerio.load(data);
    let noData = $('#NoDatas').text();
    if (!noData) {
        totalall = $('#pages').find('a[name=tolsall]').text();
        total = totalall.replace(/\S(\d*)\S/g, '$1'); // 获取总数
        pages = Math.ceil(total / 24); // 获取总页数
    } else {
        total = 0;
        pages = 0
    }
    console.log(`当前进度：${index}/${listLength} | query：${item} |内容数量：${total}/${pages}`);
    return {
        query: item,
        total: total,
        pages: pages,
        progress: `${index}/${listLength}`
    };
    // let queryEntity = new QueryModel(queryData);
    // queryEntity.save(function (err, result) {
    //     if (err) {
    //         console.log(err)
    //     }
    // });
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

module.exports = Script;
