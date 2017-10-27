/**
 * Created by busyhe on 2017/10/24 下午3:34.
 * Email: 525118368@qq.com
 */
function init() {
    let canvas = document.getElementById('canvas');
    var w = canvas.width = window.innerWidth;
    var h = canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    var opts = {
        len: 20, // 移动长度的限制
        count: 50, // 数量
        baseTime: 10, // 基础时间
        addedTime: 10, // 添加时间
        dieChance: 0.05, // 消失的几率
        spawnChance: 1, // 产生线条的几率
        sparkChance: 0.1, // 闪烁几率
        sparkDist: 10, // 闪烁距离
        sparkSize: 2, // 闪烁的尺寸
        color: 'hsl(hue,100%,light%)', // 颜色，其中hue和light是占位符
        baseLight: 50, // 基础亮度，用在颜色的占位符中
        addedLight: 10, // 增加的亮度
        shadowToTimePropMult: 6,
        baseLightInputMultiplier: 0.01,
        addedLightInputMultiplier: 0.02,
        cx: w / 2, // 中心点的坐标
        cy: h / 2,
        repaintAlpha: 0.04, // 重绘的透明度，产生尾巴效果
        hueChange: 0.1// 颜色中hue增加的系数
    };
    var tick = 0; // 记号
    var lines = []; // 存储线条
    var dieX = w / 2 / opts.len; // 屏幕宽度/2/线条长度  也就是最大的位置，超过这个位置就消失
    var dieY = h / 2 / opts.len; // 同上
    var baseRad = Math.PI * 2 / 6;// 120度角，就是六边形的角度
    ctx.fillStyle = 'black';// 背景颜色
    ctx.fillRect(0, 0, w, h);// 绘制背景

    function loop() { // 循环绘制
        window.requestAnimationFrame(loop);// 重复调用loop函数，相当于setTimeout
        ++tick;// 记号递增
        ctx.globalCompositeOperation = 'source-over';// 绘制的覆盖方式
        ctx.shadowBlur = 0;// 阴影模糊
        ctx.fillStyle = 'rgba(0,0,0,alp)'.replace('alp', opts.repaintAlpha);// 这里用的就是占位符替换，把设置的变量替换进去
        ctx.fillRect(0, 0, w, h);// 绘制背景，因为每次绘制背景的时候都没有擦除之前的绘制，加上这里绘制的透明度是0.04，所以就形成了尾巴的效果
        ctx.globalCompositeOperation = 'lighter';// 再次更改覆盖方式，为之后的绘制做准备
        if (lines.length < opts.count && Math.random() < opts.spawnChance) lines.push(new Line());// 如果线条少于预定的数量，则产生新的线条
        lines.map(function (line) {
            // 遍历线条数组，执行动画的每一帧
            line.step()
        })
    }

    function Line() {
        // 定义一个Line的构造函数，用来生成线条
        this.reset()
    }

    Line.prototype.reset = function () {
        // 线条初始化
        this.x = 0;// 初始位置
        this.y = 0;
        this.addedX = 0;// 递增距离
        this.addedY = 0;
        this.rad = 0;// 初始角度
        this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math.random();
        this.color = opts.color.replace('hue', tick * opts.hueChange);// 替换掉颜色中hue占位符，使用  记号*变化系数
        this.cumulativeTime = 0;// 累计的时间
        this.beginPhase()// 执行绘制方法
    }
    Line.prototype.beginPhase = function () { // 设定参数
        this.x += this.addedX;// 位置 = 原先的位置+递增的距离
        this.y += this.addedY;
        this.time = 0;// 重置运行时间
        this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0; // 目标时间 = 基础时间 + 递增的时间*随机数
        this.rad += baseRad * (Math.random() < 0.5 ? 1 : -1);// 角度 += 120 或 -120中的一个角度
        this.addedX = Math.cos(this.rad);// 设置增加的距离
        this.addedY = Math.sin(this.rad);
        if (Math.random() < opts.dieChance || // 消失的概率
            this.x > dieX || // 判断时候超过 设定的消失的边界
            this.x < -dieX ||
            this.y > dieY ||
            this.y < -dieY) {
            this.reset()// 如果满足上部分，将此线条重置
        }
    }
    Line.prototype.step = function () { // 这里是重头戏了，每一帧动画都是在这里绘制的
        ++this.time;// 运行时间递增
        ++this.cumulativeTime;// 累积时间递增
        if (this.time >= this.targetTime) this.beginPhase();// 如果时间大于目标时间 则重新设置参数
        var prop = this.time / this.targetTime; // 这一段几率线条旁边点的位置
        var wave = Math.sin(prop * Math.PI / 2); // wave在-1 到1之间
        var x = this.addedX * wave; // 定位xy坐标
        var y = this.addedY * wave;
        ctx.shadowBlur = prop * opts.shadowToTimePropMult; // 绘制是的阴影模糊
        ctx.fillStyle = ctx.shadowColor = this.color.replace('light', opts.baseLight + opts.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier));// 填充颜色和阴影颜色
        ctx.fillRect(
            opts.cx + (this.x + x) * opts.len, // 绘制线条中点的x.y坐标，因为拖尾巴的缘故，显示的是线条
            opts.cy + (this.y + y) * opts.len,
            2, 2);// 点的大小
        if (Math.random() < opts.sparkChance) {
            ctx.fillRect(// 绘制闪烁点
                opts.cx + (this.x + x) * opts.len + Math.random() * opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) - opts.sparkSize / 2,
                opts.cy + (this.y + y) * opts.len + Math.random() * opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) - opts.sparkSize / 2,
                opts.sparkSize, opts.sparkSize)
        }
    };
    loop();
    window.addEventListener('resize', function () {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);
        opts.cx = w / 2;
        opts.cy = h / 2;
        dieX = w / 2 / opts.len;
        dieY = h / 2 / opts.len
    });
}

export default {init}
