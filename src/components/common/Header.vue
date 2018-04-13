<template>
    <div class="header">
        <div class="logo">智能应急广播平台</div>
        <div class="user-info">
            <span class="el-dropdown-link">
                <i class="fa fa-bell icon"></i>
                紧急锁定
            </span>
            <span class="el-dropdown-link">
                <i class="fa fa-question-circle-o icon"></i>
                系统帮助
            </span>
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <i class="fa fa-user-circle icon"></i>
                    {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>18079071115</el-dropdown-item>
					<el-dropdown-item><div @click="editPassword()">修改密码</div></el-dropdown-item>
                    <el-dropdown-item  divided @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-dialog title="修改用户密码" :visible.sync="editdialog" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                 <el-input disabled v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="旧密码" :label-width="formLabelWidth" prop="beforePassword">
                 <el-input type="password" v-model="form.beforePassword" auto-complete="off" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
                 <el-input type="password" v-model="form.newPassword" auto-complete="off" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="formLabelWidth" prop="affirmPassword">
                 <el-input type="password" v-model="form.affirmPassword" auto-complete="off" placeholder="请确认新密码"></el-input>
                </el-form-item>
                <p class="tip">用户密码必须包含大写字母、小写字母、数字和特殊字符（必须包含-_@!*中的两个或两个以上）的组合，长度在6-20之间！</p>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editdialog = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd()">添 加</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { verify } from "../../api/api";
    export default {
        data() {
            return {
                form:{
                    name:'',
                    beforePassword:'',
                    newPassword:'',
                    affirmPassword:''
                },
                name: 'admin',
                formLabelWidth:'100px',
                editdialog:false,
                rules:{
                    beforePassword:[
                        { required:true, message:'请输入旧密码',trigger:'blur'}
                    ],
                    newPassword:[
                        { required:true, message:'请输入新密码',trigger:'blur'}
                    ],
                    affirmPassword:[
                        { required:true, message:'请确认新密码',trigger:'blur'}
                    ],
                }
            }
        },
        computed:{
            username(){
                let username = JSON.parse(localStorage.getItem('ms_username'));
                return username ? username : this.name;
            }
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('ms_username')
                    this.$router.push('/login');
                }
            },
            //退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出登录吗?', '提示', {
					type: 'warning'
				}).then(() => {
                    localStorage.removeItem('ms_username');
                    localStorage.removeItem('extent');
					_this.$router.push('/login');
				}).catch(() => {

				});
            },
            //修改账户密码
            editPassword() {
                this.editdialog = true;
            },
            //保存修改
            saveAdd() {
                this.$refs['form'].validate((valid) =>{
                    if(valid){
                        let password = verify.passwordVerify(this.form.newPassword);
                        if(!password){
                            this.$message({type:'error',duration:1200,message:'密码格式错误，请重新输入！'});
                            return false;
                        }
                        if(this.form.affirmPassword != this.form.newPassword){
                            this.$message({type:'error',duration:1200,message:'两次密码不相同!'});
                            return false;
                        }
                    }else{
                        return false;
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .tip{
        font-size: 12px;
        text-align: center;
    }
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        font-size: 22px;
        line-height: 60px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .user-info .icon{
        font-size: 18px;
        color: #fff;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
    .user-info .el-dropdown-link{
        padding-left: 20px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
    }
</style>
