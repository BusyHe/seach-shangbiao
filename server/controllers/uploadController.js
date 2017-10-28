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
const BrandModel = require('../mongodb/schema/brand').brands;
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
                    total: contentList,
                    successNum: 0,
                    errNum: 0,
                    isLock: true
                };
                getInfo(['淘宝']);
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
        // filterHtml(allData);
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
        Brand.getBrand(item, 9, 1).then(data => {
            task.successNum = task.successNum + 1;
            let tolsall, total, pages;
            let $ = cheerio.load(data);
            let noData = $('#NoDatas').text();
            if (!noData) {
                total = 0;
                pages = 0
            } else {
                tolsall = $('#pages').find('a[name=tolsall]').text();
                total = tolsall.replace(/\S(\d*)\S/g, '$1'); // 获取总数
                pages = Math.ceil(total / 24); // 获取总页数
            }
            getOneData({total, pages, name: item});
        }).catch(err => {
            task.errNum = task.errNum + 1;
            reject(err)
        })
    })

}

function getOneData(data) {
    if (data.total === 0) {
        return Promise.resolve()
    } else {
        let oneBrandInfoList = [];
        for (var i = 0; i < cheerio.length; i++) {
            oneBrandInfoList.push(new Promise((resolve, reject) => {
                Brand.getBrandInfo(data.name, 9, 1, i + 1).then(data => {
                    resolve()
                }).catch(err => {
                    console.log(err);
                    reject(err)
                })
            }))
        }
        return Promise.all(oneBrandInfoList)
    }
}

function filterHtml(data) {
    data.forEach(item => {
        let $ = cheerio.load(item);
        $('.TMinfoList').each((i, e) => {
            let newItem = {
                name: $(e).find('.TMnm').text()
            }
        })
    })
}

module.exports = upload;
