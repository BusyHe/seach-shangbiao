/**
 * Created by busyhe on 2017/10/27 下午9:19.
 * Email: 525118368@qq.com
 */
/**
 * Created by busyhe on 2017/8/25 下午5:46.
 * Email: 525118368@qq.com
 */
import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
import {Message} from 'element-ui'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    NProgress.start();
    return config
}, function (error) {
    return Promise.reject(error)
});

// 添加返回拦截器
axios.interceptors.response.use(function (res) {
    if (res.data.status === 1) {
        Message.warning(res.data.message)
    }
    NProgress.done();
    return res
}, function (error) {
    NProgress.done();
    return Promise.reject(error)
});

let baseUrl = '/api';

export const uploadFile = () => {
    return axios.post(baseUrl + '/file', qs.stringify({
        action: ''
    })).then(res => res.data)
};

/**
 * 搜索
 * @param localWord query
 * @param netWord 查询后的词
 * @param netType 类型
 * @param proposer 申请人
 * @param page 页数
 * @returns {Promise.<TResult>}
 */
export const searchQury = ({localWord, netWord, netType, proposer, page}) => {
    return axios.post(baseUrl + '/search', qs.stringify({action: 'search_query', localWord, netWord, netType, proposer, page})).then(res => res.data)
};

export const searchSug = ({localWord, netWord, netType, proposer, sort}) => {
    return axios.post(baseUrl + '/search', qs.stringify({action: 'search_sug', localWord, netWord, netType, proposer, sort})).then(res => res.data)
};
