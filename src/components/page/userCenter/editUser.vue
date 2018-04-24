<template>
    <div>
        <!-- 编辑用户弹窗 -->
        <el-dialog title="编辑用户信息" :visible.sync="eidtDialog" :before-close="cancel" :close-on-click-modal="false">
            <div  class="step1">
                <el-form :model="form" :rules="rules" ref="form" :label-position="'right'" class="form" :status-icon="true">
					<el-col :span="10">
						<div class="grid-content bg-purple-light">
							<el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
								<el-input :maxlength="60" v-model="form.userName" auto-complete="off"></el-input>
							</el-form-item>
						</div>
					</el-col>
                    <el-col :span="10">
						<div class="grid-content bg-purple" style="position:relative;">
							<el-form-item label="所属机构" :label-width="formLabelWidth" prop="tissue">
                                <el-input disabled  v-model="form.tissue" auto-complete="off"></el-input>
                                <el-button class="checkBtn" type="primary" @click="innerVisible = true">选 择</el-button>
							</el-form-item>
						</div>
					</el-col>
                    <el-col :span="10">
						<div class="grid-content bg-purple-light">
							<el-form-item label="用户角色" :label-width="formLabelWidth" prop="role">
                                <el-select v-model="form.role" placeholder="用户状态" >
									<el-option label="超级管理员" value="超级管理员"></el-option>
									<el-option label="管理员" value="管理员"></el-option>
								</el-select>
							</el-form-item>
						</div>
					</el-col>
                    <el-col :span="10">
						<div class="grid-content bg-purple-light">
							<el-form-item label="uk序列号" :label-width="formLabelWidth">
								<el-input :minlength="6" :maxlength="20" v-model="form.ukSn" auto-complete="off"></el-input>
							</el-form-item>
						</div>
					</el-col>
                    <el-col :span="10">
						<div class="grid-content bg-purple-light">
							<el-form-item label="用户邮箱" :label-width="formLabelWidth">
								<el-input :minlength="10" :maxlength="60" v-model="form.email" auto-complete="off"></el-input>
							</el-form-item>
						</div>
					</el-col>
                </el-form>
                <div class="btn">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="save">保 存</el-button>
                </div>
            </div>
            <el-dialog
                            width="50%"
                            title="选择所属机构"
                            :visible.sync="innerVisible"
                            append-to-body>
                            <tree></tree>
                            <div class="btn">
                                <el-button @click="innerVisible = false">取 消</el-button>
                                <el-button type="primary" @click="innerVisible = false">确认</el-button>
                            </div>
                        </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import { verify }  from "../../../api/api.js";
    import tree  from '../../common/treeOne.vue';
    export default {
        props:['eidtDialog'],
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
                    tissue:''
                },
                rules: {
					userName: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
					tissue: [
						{ required: true, message: '请选择所属机构', trigger: 'change' }
					],
					role: [
						{ required: true, message: '请选择用户角色', trigger: 'change' }
					]
            	},
                innerVisible:false,
            }
        },
        methods:{
            cancel() {
                this.$emit("close");
            },
            save () {
                this.$refs['form'].validate((valid) =>{
                    console.log(tree)
                    if(valid){
                        var phone = verify.phoneVerify(this.form.mobilePhone);
                        var uksn  = verify.ukSnVerufy(this.form.ukSn);
                        var email = verify.emailVerify(this.form.email);
                        var name  = verify.userNameVerify(this.form.userName);
                        // if(!phone){
                        //     this.$message({type:'error',duration:1200,message:'手机号格式不正确，请重新输入！'});
                        //     return false;
                        // }
                        if(this.form.ukSn && !uksn){
                            this.$message({type:'error',duration:1200,message:'UK序列号格式不正确，且长度6-20之间！'});
                            return false;
                        }
                        if(this.form.email && !email){
                            this.$message({type:'error',duration:1200,message:'用户邮箱格式不正确！'});
                            return false;
                        }
                        if(!name){
                            this.$message({type:'error',duration:1200,message:'用户名称格式不正确，请重新输入！'});
                            return false;
                        }

                    }else{
                        return false;
                    }
                })
            },
            initUserMes(row) {
                console.log(row)
                // this.form.mobilePhone = row.phone;
                // this.form.userName    = row.username;
                // this.form.userStatus  = row.status;
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
    }
    .checkBtn{
        position: absolute;
        right: -95px;
        top: 0;
    }
</style>

