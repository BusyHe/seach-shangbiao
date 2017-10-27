/**
 * Created by busyhe on 2017/10/25 上午10:00.
 * Email: 525118368@qq.com
 */
let config = {
    apps: [{
        name: 'brand',
        script: 'server.js',
        cwd: './',
        watch: [
            'server',
            'server.js'
        ],
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm Z'
    }]
};
if (process.argv.length > 5) {
    config.apps[0].args = process.argv.splice(5).join(' ');
}
module.exports = config;
