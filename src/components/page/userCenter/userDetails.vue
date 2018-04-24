<template>
    <div>
        <!-- 用户弹窗 -->
        <el-dialog title="用户详细信息" :visible.sync="detailDialog" :before-close="cancel" :close-on-click-modal="false">
            <div  class="step1">
                <el-form :model="form" label-width="120px">
                    <el-form-item label="手机号">
						<el-input :disabled="true"  v-model="form.mobilePhone" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="用户名">
						<el-input :disabled="true" v-model="form.userName" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="创建人">
						<el-input :disabled="true" v-model="form.createName" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="创建时间">
						<el-input :disabled="true" v-model="form.createTime" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="用户状态">
						<el-input :disabled="true" v-model="form.userStatus" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="所属机构">
						<el-input :disabled="true" v-model="form.tissue" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="用户角色">
						<el-input :disabled="true" v-model="form.role" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="uk序列号">
						<el-input :disabled="true" v-model="form.ukSn" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="用户邮箱">
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
    import { verify, API , getTime, tokenMessage , Headers }  from '../../../api/api.js';
    //用户
    let USER_API      = `${API}/CountryUserMgmt/user/v1`;
    export default {
        props:['detailDialog'],
        data() {
            return {
                //用户信息
                form:{
                    mobilePhone:'',
                    userName:'',
                    ukSn:'',
                    userStatus:'',
                    role:'',
                    email:'',
                    tissue:[],
                    createUser:'',
                    createTime:''
                },
            }
        },
        methods:{
            findData(Params) {
                this.axios.post(`${USER_API}/findByUserId`,Params,{ headers: Headers }).then(res => {
                    if(res.data.code == "Success") {
                        let data = res.data.payload;
                        // console.log(data);
                        this.form.createName  = data.createName;
                        this.form.userName    = data.userName;
                        this.form.mobilePhone = data.mobilePhone;
                        this.form.ukSn        = data.ukSn;
                        this.form.userStatus  = data.userStatus==1 ? '有效':'无效';
                        this.form.role        = data.roleName;
                        this.form.email       = data.email;
                        this.form.tissue      = data.orgName;
                        this.form.createUser  = data.createUser;
                        this.form.createTime  = getTime(data.createTime);
                    }else {

                        if(res.data.code == "TokenInvalid"){
                            this.$message({type: 'error',message: tokenMessage})
                            return false;
                        }

                        this.$message({
                            message: res.data.message,
                            type: 'warning'
                        });
                        this.$emit("close");
                    }
                }).catch(err => {
                    this.$message({
                        message: '请求错误！',
                        type: 'warning'
                    });
                });
            },
            initUserMes(row) {

                let Params= {
                    "userId":row.userId
                };

                this.findData(Params)
            },
            //关闭弹窗
            cancel() {
                this.$emit("close");
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

