/**
 * Created by busyhe on 2017/10/21 下午6:15.
 * Email: 525118368@qq.com
 */
const Express = require('express');
const app = new Express();
const fs = require('fs');
const path = require('path');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');

const url = 'http://www.shangdun.org/Search/';

const data = {
    qzhs: 9,
    WT: '康夫子',
    ST: 1,
    Wz: '',
    SRty: 1
};

var options = {
    method: 'GET',
    uri: url,
    form: data,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36'
    }
};

rp(options).then(function (body) {
    let $ = cheerio.load(body);
    $('.TMinfoList').each((i, e) => {
        console.log($(e).find('.TMnm').text())
    })
}).catch(function (err) {
    // POST failed...
});

app.use(Express.static(path.resolve(__dirname, './dist')));
app.get('*', (req, res) => {
    let html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8');
    res.send(html)
});

app.listen(8765);
console.log('> server start: localhost:8765');
