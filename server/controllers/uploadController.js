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
let task = require('../common/task');

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
                if (task.isLock) {
                    return status.err(res, '有进行中的任务，等待任务完成再上传')
                }
                task = {
                    name: originFilename,
                    status: 'CONTINUE',
                    total: contentList.length,
                    successNum: 0,
                    errNum: 0,
                    isLock: true
                };
                getInfo(contentList);
                return res.json({
                    status: 0,
                    data: task
                })
        }
    })
};

function getInfo(list) {
    // 全部请求得到数据保存到mongo
    Promise.all(list.map((item, index) => getBrandData(item, index))).then(allData => {
        task.isLock = false;
        task.status = 'SUCCESS'
    }).catch(err => {
        console.log(err);
        task.isLock = false;
        task.status = 'ERR'
    })
}

function getBrandData(item, index) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            Brand.getBrand(item, 9, 1).then(data => {
                task.successNum = task.successNum + 1;
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
                getOneData({total, pages, name: item, delay: index * 600}).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                });
            }).catch(err => {
                task.errNum = task.errNum + 1;
                reject(err)
            })
        }, index * 1000)
    })
}

function getOneData(data) {
    return new Promise((resolve, reject) => {
        if (data.total === 0) {
            let brandEntity = new BrandBrandModelModel({
                name: data.name,
                total: data.total,
                pages: data.pages
            });
            brandEntity.save(function (err, result) {
                if (err) {
                    console.log(err)
                }
            });
            resolve()
        } else {
            console.log(data)
            let oneBrandInfoList = [];
            for (var i = 0; i < data.pages; i++) {
                oneBrandInfoList.push(new Promise((resolve, reject) => {
                    setTimeout(function () {
                        Brand.getBrandInfo(data.name, 9, 1, i + 1).then(htmlDom => {
                            console.log('name:' + data.name + '// page:' + (i + 1));
                            filterHtml(data, htmlDom);
                            resolve()
                        }).catch(err => {
                            console.log(err);
                            reject(err)
                        })
                    }, data.delay + (i * 1000))
                }))
            }
            Promise.all(oneBrandInfoList).then(() => {
                resolve()
            }).catch(err => {
                console.log(err);
                reject(err)
            })
        }
    })

}

// 获取一页数据的列表
function filterHtml(data, htmlData) {
    return new Promise((resolve, reject) => {
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
                name: data.name,
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
        resolve()
    })
}

module.exports = upload;
