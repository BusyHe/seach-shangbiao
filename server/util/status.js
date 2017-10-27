/**
 * Created by busyhe on 2017/7/17.
 */
/* 网络返回状态 */
const status = {
    success(res) {
        return res.json({
            status: 0
        })
    },
    err(res, msg) {
        return res.json({
            status: 1,
            message: msg
        })
    }
};

module.exports = status;
