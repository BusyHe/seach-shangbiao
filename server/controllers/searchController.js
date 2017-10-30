/**
 * Created by busyhe on 2017/10/30 上午11:53.
 * Email: 525118368@qq.com
 */
const BrandModel = require('../mongodb/schema/brand').brands;
const QueryModel = require('../mongodb/schema/query').querys;
const status = require('../util/status');

const search = (req, res) => {
    let body = req.body;
    let params = getParams(body);

    switch (body.action) {
        case 'search_query':
            let page = body.page;

            BrandModel.count(params, function (err, count) {
                BrandModel.find(params, null, {limit: 50, sort: 'searchData.name -1', skip: (page - 1) * 50}, function (err, docs) {
                    if (err) {
                        return status.err(res, '查询mongo数据失败')
                    }
                    return res.json({
                        status: 0,
                        data: docs,
                        total: count
                    })
                })
            });
            break;
        case 'search_sug':
            let sortValue = body.sort;
            let list = [];

            if (sortValue === 'query') {
                QueryModel.find({query: {'$regex': '^' + body.localWord, $options: '$i'}}, sortValue, {limit: 10, sort: sortValue}, function (err, docs) {
                    list = docs.map(item => {
                        return {
                            value: item.query
                        }
                    });
                    return res.json({
                        status: 0,
                        list: list
                    })
                })
            } else {
                BrandModel.count(params, function (err, count) {
                    BrandModel.find(params, sortValue, {limit: 10, sort: sortValue}, function (err, docs) {
                        console.log(docs)
                        if (err) {
                            return status.err(res, '查询mongo数据失败')
                        }
                        if (sortValue === 'searchData.name') {
                            list = docs.map(item => {
                                return {
                                    value: item.searchData.name
                                }
                            })
                        }
                        if (sortValue === 'searchData.proposer') {
                            list = docs.map(item => {
                                return {
                                    value: item.searchData.proposer
                                }
                            })
                        }
                        return res.json({
                            status: 0,
                            list: list
                        })
                    })
                });
            }

            break
    }
};

function getParams(data) {
    let params = {
        'searchData.name': data.netWord,
        'searchData.proposer': data.proposer,
        query: data.localWord,
        total: {$gt: 0}
    };
    for (let key in params) {
        if (!params[key]) {
            delete params[key]
        } else {
            params[key] = {'$regex': '^' + params[key], $options: '$i'}
        }
    }
    params['total'] = {$gt: 0};
    return params;
}

module.exports = search;
