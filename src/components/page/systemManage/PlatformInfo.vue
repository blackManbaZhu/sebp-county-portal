<template>
    <div>
        <el-container>
            <el-main>
                <div class="left">
                    <p class="title">平台信息</p>
                    <el-form ref="form" :model="form" label-width="80px" class="form">
                        <el-form-item label="平台名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="平台地址">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人">
                            <el-input v-model="form.linkman"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <el-input v-model="form.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="经度">
                            <el-input v-model="form.longitude"></el-input>
                        </el-form-item>
                        <el-form-item label="纬度">
                            <el-input v-model="form.latitude"></el-input>
                        </el-form-item>
                        <el-form-item label="网络地址">
                            <el-input v-model="form.networkAddress"></el-input>
                        </el-form-item>
                        <div class="btn">
                            <el-button type="info" plain>重置</el-button>
                            <el-button type="primary" plain>保存</el-button>
                        </div>
                    </el-form>
                </div>
                <div class="right">
                    <p class="title">播放内容</p>
                    <el-form ref="form" :model="area" class="form">
                        <el-input
                            class="area"
                            type="textarea"
                            :rows="19"
                            :maxlength="4000"
                            :minlength="1"
                            resize="none"
                            placeholder="请输入内容"
                            v-model="area.textarea">
                        </el-input>
                        <div class="btn">
                            <el-button type="info" plain>重置</el-button>
                            <el-button type="primary" plain>保存</el-button>
                        </div>
                    </el-form>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                area:{
                    textarea:'',
                },
                form:{
                    name:'旌德应急智能广播平台',
                    address:'安徽省宣城市旌德县',
                    linkman:'xx-xx',
                    phone:'111111',
                    longitude:'118.802843',
                    latitude:'32.064606',
                    networkAddress:'http://192.168.208.11/ibsmp/'
                }
            }
        }
    }
</script>

<style scoped>
    .el-main {
        height: 80vh;
        color: #333;
        padding: 0;
        overflow: none;
        border: 1px solid #D3DCE6;
    }
    .left{ border-right: 1px solid #D3DCE6; }
    .left,.right{
        text-align: center;
        width: 50%;
        height: 100%;
        float: left;
        position: relative;
    }
    .title{
        width: 100%;
        text-align: center;
        line-height: 60px;
        font-size: 18px;
        font-weight: bold;
    }
    .form{
        padding: 20px;
    }
    .area{
        margin-bottom: 20px;
    }
</style>