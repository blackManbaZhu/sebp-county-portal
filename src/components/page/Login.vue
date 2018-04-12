<template>
  <div class="login">
    <el-form label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h2 class="title">智能应急广播平台</h2>
        <el-tabs>
            <el-tab-pane label="普通登录">
                <el-form :model="ruleForm1" status-icon :rules="rules1" ref="ruleForm1">
                    <el-form-item prop="account">
                        <el-input type="text" v-model="ruleForm1.account" auto-complete="off" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item prop="checkPass">
                        <el-input type="password" v-model="ruleForm1.checkPass" auto-complete="off" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="authCode">
                        <el-input type="text" v-model="ruleForm1.authCode" auto-complete="off" placeholder="验证码" style="width:50%;display: inline-block;"></el-input>
                        <span class="authCodePic"><img :src="authCodeUrl" alt="验证码" /></span>
                        <!-- <span class="another">换一张</span> -->
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
                <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2">
                    <el-form-item prop="account">
                        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item prop="ukeyPass">
                        <el-input type="text" v-model="ruleForm2.ukeyPass" auto-complete="off" placeholder="请输入Ukey密钥"></el-input>
                    </el-form-item>
                    <el-form-item prop="authCode">
                        <el-input type="text" v-model="ruleForm2.authCode" auto-complete="off" placeholder="验证码" style="width:50%;display: inline-block;"></el-input>
                        <span class="authCodePic"><img :src="authCodeUrl" alt="验证码" /></span>
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
  </div> 
</template>
<script>
    import {API, Transaction, XClientIP } from '../../api/api';
    let TransactionID = Transaction();
    let CODE_API = `${API}/UserMgmt/authCode/v1`;
    let LOGIN_API =  `${API}/UserMgmt/admin/v1`;
    export default {
        data() {
            return {
                checked :false,
                logining:false,
                authCodeUrl:'',
                account:'',
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
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.logining = true;
                    let Params= {"account":"sa-betel","password":"Betelinfo8888"};
                    // this.axios.post(`${LOGIN_API}/login`,Params,{headers:{'TransactionID':TransactionID,'XClientIP': XClientIP}}).then(res => {
                    //         //登录成功
                    //          console.log(res.data)
                    //         // console.log(res.data.data.privileges.privilegeId)
                    //     if(res.data.code == '00000000'){
                    //             alert("登陆成功");
                    //     }else {
                        
                    //         if(res.data.code == '00100201') {
                    //         //登录失败
                    //             this.$message({
                    //                 message: '账号或密码错误！',
                    //                 type: 'warning'
                    //             });
                    //             this.logining = false;
                    //         }
                    //         if(res.data.code == '00100204') {
                    //         //登录失败
                    //             this.$message({
                    //                 message: '管理员账号停用！',
                    //                 type: 'warning'
                    //             });
                    //             this.logining = false;
                    //         }
                    //         if(res.data.code == '00100205') {
                    //         //登录失败
                    //             this.$message({
                    //                 message: '管理员账号冻结！',
                    //                 type: 'warning'
                    //             });
                    //             this.logining = false;
                    //         }
                    //         if(res.data.code == '33333333') {
                    //         //登录失败
                    //             this.$message({
                    //                 message: '参数不合法！',
                    //                 type: 'warning'
                    //             });
                    //             this.logining = false;
                    //         }
                    //         if(res.data.code == '99999999') {
                    //         //登录失败
                    //             this.$message({
                    //                 message: '系统异常！',
                    //                 type: 'warning'
                    //             });
                    //             this.logining = false;
                    //         }
                    //         this.$message({
                    //             message: '操作异常，请重新刷新操作！',
                    //             type: 'warning'
                    //             });
                    //         this.logining = false;
                    // }
                    // }).catch(err => {
                    //     console.log(err)
                    //     this.$message({
                    //         message: '登录失败，请确认账户密码是否正确！',
                    //         type: 'warning'
                    //     });
                    //         this.logining = false;
                    // })

                    let user = this.ruleForm1.account;
                    localStorage.setItem('ms_username',JSON.stringify(user));
                    //权限信息
                    let extent = [
                        '00100','00300','00301','00302','00400','00401','00402',
                        '00403','00404','00405','00406','00407','00700','00706']
                    localStorage.setItem('extent',extent);
                    this.$router.push({ path:'/home' });
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            rememberMe (val) {
                let userInfo  = {
                        'account' :this.ruleForm1.account || this.ruleForm2.account,
                        'checkPass': this.ruleForm1.checkPass
                    }
                if(this.checked){
                    localStorage.setItem('userInfo',JSON.stringify(userInfo));
                    console.log('remember me !')
                }else {
                    console.log('no!')
                    localStorage.removeItem('userInfo');
                }
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
      width: 60px;
      height: 30px;
      vertical-align: middle;
      margin-top: -9px;
      margin-left: 25px;
    }
    .another {
      color: #20A0FF;
      margin-left: 30px;
      cursor: pointer;
    }
</style>
