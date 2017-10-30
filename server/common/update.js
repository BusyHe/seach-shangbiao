/**
 * Created by busyhe on 2017/10/30 上午10:57.
 * Email: 525118368@qq.com
 */
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');

const update = function (req, updatePath, newFileName) {
    return new Promise((resolve, reject) => {
        let form = new multiparty.Form();
        form.uploadDir = updatePath;
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err)
            } else {
                let file = files.file[0];
                let originFileName = file.originalFilename;
                let filePath = path.resolve(updatePath + (newFileName || originFileName));
                fs.renameSync(file.path, filePath);
                resolve({
                    fields: fields,
                    files: files,
                    file: file,
                    filePath: filePath,
                    fileName: newFileName || originFileName,
                    fileContent: fs.readFileSync(filePath, 'utf-8')
                });
            }
        })
    })

};

module.exports = update;
