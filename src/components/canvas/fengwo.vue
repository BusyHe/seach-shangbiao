/**
* Created by busyhe on 2017/10/24 下午3:00.
* Email: 525118368@qq.com
*/

<template>
    <canvas id="canvas" ref="canvas"></canvas>
</template>
<script>
    import fengwo from './index.js'

    export default {
        name: '',
        data() {
            return {}
        },
        props: [''],
        components: {},
        created() {
        },
        mounted() {
            this.$nextTick(() => {
                fengwo.init()
            })
        },
        methods: {}
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
</style>
