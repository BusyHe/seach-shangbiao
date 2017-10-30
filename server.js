/**
 * Created by busyhe on 2017/10/21 下午6:15.
 * Email: 525118368@qq.com
 */
const Express = require('express');
const app = new Express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('./server/util/logger');
const router = require('./server/router');
const mongoose = require('./server/mongodb/mongodb.js');


logger.use(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', router);
app.use(Express.static(path.resolve(__dirname, './dist')));

app.get('*', (req, res) => {
    let html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8');
    res.send(html)
});

app.listen(8765);
console.log('> server start: localhost:8765');
