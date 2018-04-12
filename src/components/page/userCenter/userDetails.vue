<template>
    <div>
        <!-- 用户弹窗 -->
        <el-dialog title="用户详细信息" :visible.sync="detailDialog" :before-close="cancel" :close-on-click-modal="false">
            <div  class="step1">
                <el-form :model="form">
                    <el-form-item label="手机号" :label-width="formLabelWidth">
						<el-input :disabled="true"  v-model="form.mobilePhone" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="用户名" :label-width="formLabelWidth">
						<el-input :disabled="true" v-model="form.userName" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="用户状态" :label-width="formLabelWidth">
						<el-input :disabled="true" v-model="form.userStatus" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="所属机构" :label-width="formLabelWidth">
						<el-input :disabled="true" v-model="form.tissue" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="用户角色" :label-width="formLabelWidth">
						<el-input :disabled="true" v-model="form.role" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="uk序列号" :label-width="formLabelWidth">
						<el-input :disabled="true" v-model="form.ukSn" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="用户邮箱" :label-width="formLabelWidth">
						<el-input :disabled="true" v-model="form.email" auto-complete="off"></el-input>
					</el-form-item>
                </el-form>
                <div class="btn">
                    <el-button type="primary" @click="cancel">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['detailDialog'],
        data() {
            return {
                formLabelWidth:'110px',
                //用户信息
                form:{
                    mobilePhone:'',
                    userName:'',
                    ukSn:'',
                    userStatus:'',
                    role:'',
                    email:'',
                    tissue:[]
                },
            }
        },
        methods:{
            cancel() {
                this.$emit("close");
            },
            initUserMes(row) {
                console.log(row)
                this.form.mobilePhone = row.phone;
                this.form.userName    = row.username;
                this.form.userStatus  = row.status;
            }
        }
    }
</script>

<style scoped>
    .steps{
        width: 100%;
        margin: 0 auto;
    }
    .step1,.step2{
        width: 100%;
        padding: 10px;
        margin-top: 25px;
        text-align: center;
        display: inline-table;
    }
    .form{
        display: inline-table;
    }
    .look{
        cursor: pointer;
        color: #409EFF;
    }
    .tip{
        width: 100%;
        height: 20px;
        text-align: center;
        font-size: 14px;
        color: #a5a5a5;
        float: left;
        margin-bottom: 20px;
    }
    .btn{
        text-align: center;
        width: 100%;
        height: 40px;
        margin-top: 20px;
        float: left;
    }
</style>

