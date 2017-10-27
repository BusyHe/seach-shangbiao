/**
 * Created by busyhe on 2017/10/27 下午9:47.
 * Email: 525118368@qq.com
 */
import jsonp from 'common/js/jsonp'

export function search() {
    const url = 'http://www.shangdun.org/Search/';

    const data = {
        qzhs: 9,
        WT: '康夫子',
        ST: 1,
        Wz: '',
        SRty: 1
    }
    return jsonp(url, data, {})
}
