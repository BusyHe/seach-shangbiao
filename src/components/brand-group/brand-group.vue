/**
* Created by brand-group on 2017/10/28.
* Email: 525118368@qq.com
*/
<template>
    <el-row :gutter="10">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="(item,index) in data" :key="index">
            <div class="grid-content bg-purple" @click="getBrandInfo(item.searchData.id, item.searchData.nettype)">
                <div class="img-box">
                    <img :src="item.searchData.img"/>
                </div>
                <h3>{{item.searchData.name}}</h3>
                <p>申请/注册号：{{item.searchData.regis}}</p>
                <p>申请人：{{item.searchData.proposer}}</p>
                <p>状态：{{item.searchData.status}}</p>
                <p></p>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        name: 'brandGroup',
        data() {
            return {}
        },
        props: ['data'],
        components: {},
        created() {
        },
        mounted() {
        },
        methods: {
            getBrandInfo(id, type) {
                console.log(`http://www.shangdun.org/Show/?id=${id}&C=${type}`)
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
    @import "~common/stylus/mixin"
    .grid-content
        box-sizing border-box
        background-color #e4e4e4
        box-shadow 0 2px 2px rgba(0, 0, 0, .12)
        transition: box-shadow 0.3s ease-in-out
        margin-bottom 10px
        padding-bottom 5px
        cursor pointer
        &:hover
            box-shadow 0 5px 15px rgba(0, 0, 0, .3)
        .img-box
            text-align center
            height 120px
            background-color white
            overflow: hidden
            img
                max-width: 100%;
                max-height: 120px;
                display: block;
                margin-right: auto;
                margin-left: auto;
                vertical-align middle
        h3
            margin 10px 0 20px 0
            padding 0 10px
            font-size $font-size-medium-x
            text-ellipsis()
        p
            padding 0 10px
            line-height 12px
            font-size $font-size-small
            color $color-text-l
            margin 5px 0
            text-ellipsis()

</style>
