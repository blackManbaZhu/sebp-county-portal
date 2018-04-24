<template>
  <div class="login">
    <el-form label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h2 class="title">智能应急广播平台</h2>
        <el-tabs>
            <el-tab-pane label="普通登录">
                <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" @keyup.enter.native="submitForm('ruleForm1')">
                    <el-form-item prop="account">
                        <el-input type="text" v-model="ruleForm1.account" auto-complete="off" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item prop="checkPass">
                        <el-input type="password" v-model="ruleForm1.checkPass" auto-complete="off" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="authCode">
                        <el-input type="text" v-model="ruleForm1.authCode" auto-complete="off" placeholder="验证码" style="width:50%;display: inline-block;"></el-input>
                        <span class="authCodePic"><img :src="authCodeUrl"/></span>
                        <span class="another" @click="another">换一张</span>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox type="checked" v-model="checked" @change="rememberMe()">记住我</el-checkbox>
                        <span class="forgetPass">忘记密码？</span>
                    </el-form-item>
                    <el-form-item style="width:100%;">
                        <el-button type="primary" style="width:100%;" @click="submitForm('ruleForm1')" :loading="logining">登录</el-button>
                    </el-form-item>   
                </el-form>  
            </el-tab-pane>
            <el-tab-pane label="Ukey登录">
                <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2">
                    <el-form-item prop="account">
                        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item prop="ukeyPass">
                        <el-input type="text" v-model="ruleForm2.ukeyPass" auto-complete="off" placeholder="请输入Ukey密钥"></el-input>
                    </el-form-item>
                    <el-form-item prop="authCode">
                        <el-input type="text" v-model="ruleForm2.authCode" auto-complete="off" placeholder="验证码" style="width:50%;display: inline-block;"></el-input>
                        <span class="authCodePic" ><img :src="authCodeUrl"/></span>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox type="checked" v-model="checked" @change="rememberMe()">记住我</el-checkbox>
                        <span class="forgetPass">忘记密码？</span>
                    </el-form-item>
                    <el-form-item style="width:100%;">
                        <el-button type="primary" style="width:100%;" @click="submitForm('ruleForm2')" :loading="logining">登录</el-button>
                    </el-form-item>  
                </el-form>  
            </el-tab-pane>
        </el-tabs>
    </el-form>
    <el-dialog title="请设置您的密码" :visible.sync="editdialog" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="form">
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
                <el-button type="primary" @click="saveAdd()">保 存</el-button>
            </div>
    </el-dialog>
  </div> 
</template>
<script>
    import {API, verify, Transaction, XClientIP ,trim ,tokenMessage} from '../../api/api';
    //获取本地IP
    let TransactionID = Transaction();
    //验证码
    let CODE_API = `${API}/CountryUserMgmt/user/v1`;
    //登录
    let LOGIN_API =  `${API}/CountryUserMgmt/user/v1`;
    export default {
        data() {
            return {
                checked :false,
                logining:false,
                editdialog:false,
                formLabelWidth:'100px',
                authCodeUrl: '',
                token:'',
                account:'',
                picId:'',
                ruleForm1: {
                    account:'',
                    checkPass: '',
                    authCode:''
                },
                ruleForm2:{
                    account:'',
                    ukeyPass:'',
                    authCode:''
                },
                form:{
                    beforePassword:'',
                    newPassword:'',
                    affirmPassword:''
                },
                rules1: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    checkPass: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    authCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                },
                rules2: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    ukeyPass: [
                        { required: true, message: '请输入Ukey密钥', trigger: 'blur'}
                    ],
                    authCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                },
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
            };
        },
        //实例创建之后立即调用
        created(){
            let user = JSON.parse(localStorage.getItem('userInfo'));
            if(user){
                this.checked             = true;
                this.ruleForm1.account   = user.account;
                this.ruleForm2.account   = user.account;
            }else {
                this.ruleForm1.account   = this.ruleForm1.ukeyPass  = '';
                this.ruleForm2.account   = this.ruleForm2.checkPass = '';
            }
            this.another();
        },
        methods: {
            another() {  //获取验证码
                this.axios.get(`${CODE_API}/verifyCode`,{headers:{'X-Transaction':TransactionID}}).then(res => {
                    if(res.data.code == "Success"){
                        this.picId       = res.data.payload.id;
                        this.authCodeUrl = `data:image/jpeg;base64,${res.data.payload.imageBase64}`; 
                    }else{

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
                        message: err.message,
                        type: 'warning'
                    });
                });
            },
            submitForm(formName) { //登录
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.logining = true;
                    let Params= {
                        "mobilePhone":trim(this.ruleForm1.account),
                        "password":this.ruleForm1.checkPass,
                        "verifyCode":this.ruleForm1.authCode,
                        "verifyCodeId":this.picId
                    };
                    this.axios.post(`${LOGIN_API}/login`,Params,{headers:{'TransactionID':TransactionID,'XClientIP': XClientIP}}).then(res => {
                        // console.log(res.data)
                        if(res.data.code == 'Success'){  //登录成功
                            let setPWDNeeded     = res.data.payload.setPWDNeeded; //是否第一次登录
                            let refreshPWDNeeded = res.data.payload.refreshPWDNeeded; //是否长时间没有设置密码
                            let userData = res.data.payload.user; //用户基本信息
                            
                            //存放用户信息
                            this.token   = res.data.payload.token;
                            localStorage.setItem('ms_username',userData.userName);
                            localStorage.setItem('phone',userData.mobilePhone);
                            localStorage.setItem('userId',userData.userId);
                            localStorage.setItem('orgId',userData.orgId);

                            localStorage.setItem('token',res.data.payload.token);
                            if(setPWDNeeded || refreshPWDNeeded){ //第一次登录需要重置密码
                                this.editdialog = true;
                                this.logining   = false;
                                return false;
                            }else{
                                //权限信息
                                let extent = [
                                    '00100','00300','00301','00302','00400','00401','00402',
                                    '00403','00404','00405','00406','00407','00700','00706']
                                localStorage.setItem('extent',extent);
                                setTimeout(() => {
                                    this.$router.push({ path:'/home' }); 
                                },100);
                                setTimeout(() => {
                                    window.location.reload();
                                },180);
                                this.logining = false;
                                this.$message.success("登录成功");
                            }
                        }else{

                            if(res.data.code == "TokenInvalid"){
                                this.$message({type: 'error',message: tokenMessage})
                                return false;
                            }

                            this.$message({
                                message: res.data.message,
                                type: 'warning'
                            });
                            this.another(); //刷新验证码
                            this.logining           = false;
                            this.ruleForm1.authCode = '';
                        }
                    }).catch(err => {
                        this.$message({
                            message: err.message,
                            type: 'warning'
                        });
                        this.logining = false;
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            rememberMe (val) {
                let userInfo  = {
                        'account' :this.ruleForm1.account || this.ruleForm2.account,
                    }
                if(this.checked){

                    localStorage.setItem('userInfo',JSON.stringify(userInfo));

                }else {

                    localStorage.removeItem('userInfo');

                }
            },
            saveAdd() { //保存重置密码
                this.$refs['form'].validate((valid) =>{
                    if(valid){
                        let userToken      = this.token;
                        let newPassword    = this.form.newPassword;
                        let beforePassword = this.form.beforePassword;
                        let affirmPassword = this.form.affirmPassword;
                        let password = verify.passwordVerify(this.form.newPassword);

                        if(!password){

                            this.$message({type:'error',duration:1200,message:'密码格式错误，且长度在6-20之间，请重新输入！'});
                            return false;
                        }
                        if(affirmPassword != newPassword){
                            this.$message({type:'error',duration:1200,message:'两次密码不相同!'});
                            return false;
                        }
                        if( newPassword == beforePassword ){
                            this.$message({type:'error',duration:1200,message:'新旧密码不能相同!'});
                            return false;
                        }
                        var Params = {"oldPassword": beforePassword,"newPassword": newPassword}
                        this.axios.post(`${LOGIN_API}/changePassword`,Params,{headers:{'X-Transaction':TransactionID,'X-User-Token': userToken}}).then(res => {
                            // console.log(res.data)
                            if(res.data.code == 'Success'){

                                this.$message({type:'success',duration:1200,message:'修改成功!'});
                                
                                //清除第一次登录的token
                                localStorage.removeItem('token');
                                //跳转登录界面
                                this.$router.push('/login');
                                this.editdialog          =  false;
                                this.ruleForm1.checkPass = '';
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
                                message: err.message,
                                type: 'warning'
                            });
                        });
                    }else{
                        return false;
                    }
                })
            }
        }
    }
</script>

<style >
   .login {
    height: calc(100vh - 180px);
    height: -moz-calc(100vh - 180px);
    height: -webkit-calc(100vh - 180px);
    height: 100vh;
    position: relative;
    background: url('../../../static/img/1176915.jpg') no-repeat;
    background-size:  100% 100%;
   }
   .login-container {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -200px;
      margin-top: -240px;
     -webkit-border-radius: 5px;
     border-radius: 5px;
     -moz-border-radius: 5px;
     background-clip: padding-box;
     width: 400px;
     padding: 35px 35px 15px 35px;
     background: #fff;
     border: 1px solid #eaeaea;
     box-shadow: 0 0 25px #cac6c6;
   }
   .login .title {
      margin: 0px auto 20px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    .login .el-tabs__nav{
        width: 100%;
    }
    .login .el-tabs__item{
        width: 50%;
        text-align: center;
    }
    .forgetPass {
        float: right;
        cursor: pointer;
        color: #3276b1;
    }
    .authCodePic img{
      width: 50px;
      height: 30px;
      vertical-align: middle;
      margin-top: -9px;
      margin-left: 25px;
    }
    .another{
      color: #20A0FF;
      font-size: 12px;
      margin-left: 30px;
      cursor: pointer;
    }
</style>
