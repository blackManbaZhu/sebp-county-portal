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
                    {{name}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>{{phone}}</el-dropdown-item>
					<el-dropdown-item><div @click="editPassword()">修改密码</div></el-dropdown-item>
                    <el-dropdown-item  divided @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>


        <!-- 修改用户密码弹窗 -->
        <el-dialog title="修改用户密码" :visible.sync="editdialog" @close="close" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="用户名">
                 <el-input disabled v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="旧密码" prop="beforePassword">
                 <el-input type="password" v-model="form.beforePassword" auto-complete="off" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                 <el-input type="password" v-model="form.newPassword" auto-complete="off" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="affirmPassword">
                 <el-input type="password" v-model="form.affirmPassword" auto-complete="off" placeholder="请确认新密码"></el-input>
                </el-form-item>
                <p class="tip">用户密码必须包含大写字母、小写字母、数字和特殊字符（必须包含-_@!*中的两个或两个以上）的组合，长度在6-20之间！</p>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editdialog = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd()">保 存</el-button>
            </div>
        </el-dialog>


    </div>
</template>
<script>
    import { verify, API ,Transaction, tokenMessage ,Headers} from "../../api/api";
    //修改密码
    let USER_API = `${API}/CountryUserMgmt/user/v1`;
    export default {
        data() {
            return {
                //密码修改表单信息
                form:{
                    name:'',
                    beforePassword:'',
                    newPassword:'',
                    affirmPassword:''
                },
                name: '',
                phone:'',
                //验证表单
                rules:{
                    beforePassword:[
                        { required:true, message:'请输入旧密码'}
                    ],
                    newPassword:[
                        { required:true, message:'请输入新密码'}
                    ],
                    affirmPassword:[
                        { required:true, message:'请确认新密码'}
                    ],
                },
                //弹窗
                editdialog:false,
            }
        },
        methods:{
            userInfo() {
                this.name  = localStorage.getItem('ms_username');
                this.phone = localStorage.getItem('phone');
            },
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
                    localStorage.removeItem('phone');
                    localStorage.removeItem('extent');
                    localStorage.removeItem('token');
                    localStorage.removeItem('orgId');
                    localStorage.removeItem('userId');
                    _this.$router.push('/login');
                    // _this.$router.replace({name:'login'})
				}).catch(() => {

				});
            },
            //修改账户密码
            editPassword() {
                this.editdialog = true;
                this.form.name  = this.name;
            },
            //保存修改
            saveAdd() {
                this.$refs['form'].validate((valid) =>{
                    if(valid){
                        let oldPassword    = this.form.beforePassword;
                        let newPassword    = this.form.newPassword;
                        let affirmPassword = this.form.affirmPassword;
                        let pass = verify.passwordVerify(newPassword);

                        if(!pass){
                            this.$message({type:'error',duration:1200,message:'密码格式错误，且长度在6-20之间，请重新输入！'});
                            return false;
                        }
                        if(affirmPassword != newPassword){
                            this.$message({type:'error',duration:1200,message:'两次密码不相同!'});
                            return false;
                        }
                        if( newPassword == oldPassword ){
                            this.$message({type:'error',duration:1200,message:'新旧密码不能相同!'});
                            return false;
                        }
                        var Params = {"oldPassword": oldPassword,"newPassword": newPassword}
                        this.axios.post(`${USER_API}/changePassword`,Params,{ headers: Headers }).then(res => {
                            // console.log(res.data)
                            if(res.data.code == 'Success'){

                                this.$message({type:'success',duration:1200,message:'修改成功!'});
                                this.editdialog =  false;
                                //跳转登录界面
                                this.$router.push('/login');

                            }else {


                                if(res.data.code == "ParamInvalid"){
                                    this.$message({type:'error',duration:1200,message:'密码格式错误，请重新输入！'});
                                    return false;
                                }

                                if(res.data.code == "TokenInvalid"){
                                    this.$message({type: 'error',message: tokenMessage})
                                    return false;
                                }
                                this.$message({
                                    message: res.data.message,
                                    type: 'warning'
                                });
                            }
                        }).catch(err => {
                            this.$message({
                                message: '请求错误！',
                                type: 'warning'
                            });
                        });
                        this.form.name = '';
                    }else{
                        return false;
                    }
                })
            },
            close() {
                this.form = {
                    name:'',
                    beforePassword:'',
                    newPassword:'',
                    affirmPassword:''
                },
                //关闭表单验证
				this.$refs['form'].resetFields();
            }
        },
        mounted() { //初始化数据
            this.userInfo();
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
