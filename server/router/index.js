/**
 * Created by index on 2017/10/28.
 * Email: 525118368@qq.com
 */
const router = require('express').Router();
const infoController = require('../controllers/infoController');
const uploadController = require('../controllers/uploadController');

router.post('/info', infoController);
router.post('/upload', uploadController);

module.exports = router;
