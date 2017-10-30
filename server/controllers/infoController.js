/**
 * Created by infoController on 2017/10/28.
 * Email: 525118368@qq.com
 */
const info = (req, res) => {
    switch (req.body.action) {
        case 'search_query':
            return res.json({
                status: 0
            });
    }
};

module.exports = info;
