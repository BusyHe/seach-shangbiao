/**
 * Created by uploadController on 2017/10/28.
 * Email: 525118368@qq.com
 */
const multiparty = require('multiparty');
const status = require('../util/status');
const fs = require('fs');
const path = require('path');

let upload = (req, res) => {
    console.log('aaa')
    let form = new multiparty.Form();
    form.uploadDir = './files/upload/';
    form.parse(req, (err, fields, files) => {
        if (err) {
            status.err(res, 'multiparty: 上传失败')
        }
        let fileOne = files.file[0];
        let originFilename = fileOne.originalFilename;
        let newFilePath = path.resolve('./files/upload' + originFilename);
        fs.renameSync(fileOne.path, newFilePath);
        switch (fields.action[0]) {
            case 'main_file':
                return status.success(res)
        }
    })
};

module.exports = upload;
