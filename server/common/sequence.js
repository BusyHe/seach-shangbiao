/**
 * Created by sequence on 2017/10/29.
 * Email: 525118368@qq.com
 */
function sequence(steps) {
    const results = [];
    let promise = Promise.resolve();

    const then = i => {
        promise = promise.then(() => {
            return steps[i](results[results.length - 1], results).then(value => {
                results[i] = value;
            });
        });
    };
    forEach(steps, (step, i) => {
        then(i);
    });
    return promise.then(() => results);
}

function forEach(array, fn, thisArg) {
    for (let i = 0, l = array.length; i < l; i += 1) {
        fn.call(thisArg || null, array[i], i, array);
    }
}

module.exports = sequence;
