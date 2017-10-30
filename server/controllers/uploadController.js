/**
 * Created by uploadController on 2017/10/28.
 * Email: 525118368@qq.com
 */
const multiparty = require('multiparty');
const status = require('../util/status');
const fs = require('fs');
const path = require('path');
const BrandTask = require('../common/brandTask');

let upload = (req, res) => {
    let originFilename = ''; // 文件名称
    let fileContent = ''; // 文件内容
    let contentList = 0; // query数量
    let form = new multiparty.Form();
    form.uploadDir = './files/upload/';
    form.parse(req, (err, fields, files) => {
        if (err) {
            status.err(res, 'multiparty: 上传失败')
        }
        let fileOne = files.file[0];
        originFilename = fileOne.originalFilename;
        let newFilePath = path.resolve('./files/upload/' + originFilename);
        fs.renameSync(fileOne.path, newFilePath);
        fileContent = fs.readFileSync(newFilePath, 'utf-8');
        contentList = fileContent.split('\n');
        switch (fields.action[0]) {
            case 'main_file':
                let brandTask = new BrandTask(contentList);
                brandTask.startTask();
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

module.exports = upload;
