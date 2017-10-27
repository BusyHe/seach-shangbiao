const rp = require('request-promise');

const http = {
    post(type, url, params) {
        console.debug(type + '//' + url + JSON.stringify(params));
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                uri: url,
                json: true
            };
            options[type] = params;
            rp(options).then((parsedBody) => {
                resolve(parsedBody)
            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        })
    },
    get(url, data) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'GET',
                uri: url,
                form: data
            };
            rp(options).then((parsedBody) => {
                resolve(parsedBody)
            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        })
    }
};

module.exports = http;
