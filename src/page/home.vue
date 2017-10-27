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
        </div>
        <div class="home-container">
        </div>
    </div>
</template>
<script>
    export default {
        name: 'home',
        data() {
            return {
                fullscreenLoading: false,
                uploadData: {
                    action: 'main_file'
                }
            }
        },
        props: [''],
        components: {},
        created() {
        },
        mounted() {
        },
        methods: {
            beforUploadEvent() {
                this.fullscreenLoading = true
            },
            handlePreview(data) {
                console.log(data);
                this.fullscreenLoading = false
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
        &-container
            position absolute
            top 60px
            right 0
            bottom 0
            left 0
</style>
