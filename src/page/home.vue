/**
* Created by busyhe on 2017/10/24 上午10:39.
* Email: 525118368@qq.com
*/

<template>
    <div class="home" v-loading.fullscreen.lock="fullscreenLoading">
        <div class="home-menu">
            <el-upload
                class="upload-button"
                action="/api/upload"
                :show-file-list="false"
                :data="uploadData"
                :before-upload="beforUploadEvent"
                :on-success="handlePreview">
                <div class="upload-button-t">上传文件</div>
            </el-upload>
            <div class="search-box">
                <div class="search-item">
                    <label>本地词</label>
                    <el-autocomplete
                        v-model="search.localWord"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                    ></el-autocomplete>
                </div>
                <div class="search-item">
                    <label>查询词</label>
                    <el-autocomplete
                        v-model="search.netWord"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                    ></el-autocomplete>
                </div>
                <div class="search-item">
                    <label>国际类别</label>
                    <el-select v-model="search.netType" placeholder="请选择" class="net-type-select">
                        <el-option
                            v-for="item in netTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <label>申请人</label>
                    <el-autocomplete
                        v-model="search.proposer"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                    ></el-autocomplete>
                </div>
            </div>
        </div>
        <div class="home-container">
            <brand-group :data="brandData"></brand-group>
        </div>
        <el-pagination
            class="pagination"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="100"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import BrandGroup from 'comps/brand-group/brand-group'

    export default {
        name: 'home',
        data() {
            return {
                fullscreenLoading: false,
                uploadData: {
                    action: 'main_file'
                },
                search: {
                    localWord: '',
                    netWord: '',
                    netType: '9',
                    proposer: ''
                },
                netTypeOptions: [
                    {
                        value: '9',
                        label: '9类'
                    }
                ],
                brandData: [],
                total: 0,
                currentPage: 0
            }
        },
        props: [''],
        components: {BrandGroup},
        created() {
        },
        mounted() {
        },
        methods: {
            querySearchAsync(queryString, cb) {
            },
            handleSelect(item) {
                console.log(item);
            },
            beforUploadEvent() {
                this.fullscreenLoading = true
            },
            handlePreview(data) {
                console.log(data);
                this.fullscreenLoading = false
            },
            handleCurrentChange() {
            },
            _search() {
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
    @import "~common/stylus/variable"
    .home
        &-menu
            box-sizing border-box
            width 100%
            height 60px
            padding 0 $main-padding
            line-height 60px
            background-color white
            box-shadow 0 2px 2px rgba(0, 0, 0, .12)
            .upload-button-t
                height 36px
                line-height 36px
                padding 0 $main-padding
                color white
                background-color $color-theme
                font-size $font-size-medium
                border-radius 30px
                text-align center
            .search-box
                position absolute
                top 0
                right 15px
                .search-item
                    display inline-block
                    label
                        color $color-text-ll
                    .net-type-select
                        width 90px
                .search-item + .search-item
                    margin-left 10px
        &-container
            position absolute
            top 60px
            right 0
            bottom 0
            left 0
            padding 15px
            .grid-content
                background-color white
                height 300px
                box-shadow 0 2px 2px rgba(0, 0, 0, .12)
        .pagination
            position absolute
            left 15px
            bottom 15px

</style>
