/**
 * Created by uploadController on 2017/10/28.
 * Email: 525118368@qq.com
 */
const multiparty = require('multiparty');
const status = require('../util/status');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const Brand = require('../api/brandInfo');
const BrandBrandModelModel = require('../mongodb/schema/brand').brands;
const QueryModel = require('../mongodb/schema/query').querys;
const sequence = require('../common/sequence');

let upload = (req, res) => {
    let fileContent = '';
    let contentList = 0;
    let form = new multiparty.Form();
    form.uploadDir = './files/upload/';
    form.parse(req, (err, fields, files) => {
        if (err) {
            status.err(res, 'multiparty: 上传失败')
        }
        let fileOne = files.file[0];
        let originFilename = fileOne.originalFilename;
        let newFilePath = path.resolve('./files/upload/' + originFilename);
        fs.renameSync(fileOne.path, newFilePath);
        fileContent = fs.readFileSync(newFilePath, 'utf-8');
        contentList = fileContent.split('\n')
        switch (fields.action[0]) {
            case 'main_file':
                getInfo(contentList);
                return res.json({
                    status: 0,
                    data: {
                        name: originFilename,
                        total: contentList.length
                    }
                })
        }
    })
};

function getInfo(list) {
    let steps = [];
    list.forEach((item, index) => {
        steps.push(() => {
            return new Promise(resolve => {
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
                    let queryData = {
                        query: item,
                        total: total,
                        pages: pages
                    };
                    let queryEntity = new QueryModel(queryData);
                    queryEntity.save(function (err, result) {
                        if (err) {
                            console.log(err)
                        }
                    });
                    console.log(index + '||' + item + '||' + total + '||' + pages);
                    setTimeout(() => {
                        resolve(queryData);
                    }, 500);
                }).catch(err => {
                    console.log(err);
                    setTimeout(() => {
                        resolve({
                            query: item,
                            total: 0,
                            pages: 0,
                            err: true
                        });
                    }, 500);
                })
            })
        })
    });
    sequence(steps).then(datas => {
        let infoSteps = [];
        datas.forEach(item => {
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
                for (var i = 0; i < item.pages; i++) {
                    let pageNum = i + 1;
                    infoSteps.push(() => {
                        return new Promise(resolve => {
                            Brand.getBrandInfo(item.query, 9, 1, pageNum).then(htmlDom => {
                                console.log(item.query + ' || ' + pageNum + '/' + item.pages + '||' + item.total);
                                filterHtml(item, htmlDom);
                                setTimeout(() => {
                                    resolve();
                                }, 500)
                            }).catch(err => {
                                console.log(err);
                                setTimeout(() => {
                                    resolve();
                                }, 500)
                            })
                        })
                    })
                }
            }
        });
        sequence(infoSteps)
    })
}

// 获取一页数据的列表
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

module.exports = upload;
