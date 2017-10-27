/**
 * Created by busyhe on 2017/10/27 下午9:19.
 * Email: 525118368@qq.com
 */
import axios from 'axios'
import qs from 'qs'

export const search = () => {
    return axios.get('https://open.api.tianyancha.com/services/v3/newopen/tm.json?name=' + '北京百度网讯科技有限公司'
    ).then(res => res.data)
}
