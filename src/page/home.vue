/**
* Created by busyhe on 2017/10/24 上午10:39.
* Email: 525118368@qq.com
*/

<template>
    <div class="home">
    </div>
</template>
<script>
    import {search} from '@/api/search'

    export default {
        name: 'home',
        data() {
            return {}
        },
        props: [''],
        components: {},
        created() {
            this._search()
        },
        mounted() {
        },
        methods: {
            _search() {
                search().then(res => {
                    console.log(res)
                })
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
    .home
        text-align center
        img
            position absolute
            left 50%
            top 50%
            margin-top -50px
            margin-left -50px
            border 8px solid rgba(255, 255, 255, .2)
            border-radius 50%
            z-index 1
        .feng-wo
            position absolute
            left 0
            top 0
            width 100%
            height 100%
</style>
