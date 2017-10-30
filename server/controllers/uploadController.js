/**
 * Created by uploadController on 2017/10/28.
 * Email: 525118368@qq.com
 */
const status = require('../util/status');
const BrandTask = require('../common/brandTask');
const update = require('../common/update');

let upload = (req, res) => {
    update(req, './files/upload/').then(data => {
        switch (data.fields.action[0]) {
            case 'main_file':
                let contentList = data.fileContent.split('\n');
                let brandTask = new BrandTask(contentList);
                brandTask.startTask();
                return res.json({
                    status: 0,
                    data: {
                        name: data.fileName,
                        total: contentList.length
                    }
                })
        }
    }).catch(e => {
        console.error(e);
        status.err(res, 'multiparty: 上传失败')
    })
};

module.exports = upload;
