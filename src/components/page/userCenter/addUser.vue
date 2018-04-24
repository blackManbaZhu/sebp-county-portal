<template>
    <div>
        <!-- 新增用户弹窗 -->
        <el-dialog title="新增用户" :visible.sync="addDialog" :before-close="cancel" :close-on-click-modal="false">
            <el-steps :active="active" finish-status="success" class="steps" align-center>
                <el-step title="用户基本信息"></el-step>
                <el-step title="用户角色设置"></el-step>
            </el-steps>
            <div class="step1" v-show="active==0">
                <el-form :model="form" :rules="rules" ref="form" :label-position="'right'" class="form" :status-icon="true">
                    <el-col :span="10">
						<div class="grid-content bg-purple">
							<el-form-item label="手机号" :label-width="formLabelWidth" prop="mobilePhone">
								<el-input v-model="form.mobilePhone" auto-complete="off"></el-input>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="10">
						<div class="grid-content bg-purple-light">
							<el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
								<el-input :maxlength="64" v-model="form.userName" auto-complete="off"></el-input>
							</el-form-item>
                            <p class="tip">用户名支持中英文</p>
						</div>
					</el-col>
                    <el-col :span="10">
						<div class="grid-content bg-purple-light">
							<el-form-item label="用户状态" :label-width="formLabelWidth" prop="userStatus">
                                <el-select v-model="form.userStatus" placeholder="用户状态">
									<el-option label="正常" value="0"></el-option>
									<el-option label="停用" value="1"></el-option>
								</el-select>
							</el-form-item>
						</div>
					</el-col>
                    <!-- <p class="tip">用户密码必须包含大写字母、小写字母、数字和特殊字符（必须包含-_@!*中的两个）的组合，长度在6-20之间！</p> -->
                    <el-col :span="10">
						<div class="grid-content bg-purple" style="position:relative;">
							<el-form-item label="所属机构" :label-width="formLabelWidth" prop="tissue">
                                 <el-input disabled  v-model="form.tissue" auto-complete="off"></el-input>
                                 <el-button class="checkBtn" type="primary" @click="innerVisible = true">选 择</el-button>
							</el-form-item>
						</div>
                        <el-dialog
                            width="50%"
                            title="选择所属机构"
                            :visible.sync="innerVisible"
                            append-to-body>
                             <add-tree></add-tree>
                            <div class="btn">
                                <el-button @click="innerVisible = false">取 消</el-button>
                                <el-button type="primary" @click="innerVisible = false">确认</el-button>
                            </div>
                        </el-dialog>
					</el-col>
                    <el-col :span="10">
						<div class="grid-content bg-purple-light">
							<el-form-item label="uk序列号" :label-width="formLabelWidth">
								<el-input :minlength="6" :maxlength="20"  v-model="form.ukSn" auto-complete="off"></el-input>
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
                    <el-button type="primary" @click="next">下一步</el-button>
                </div>
            </div>
            <div class="step2" v-show="active==1 || active==2">
                <el-table
                        :data="tableList"
                        border
                        header-align="center"
                        style="width: 100%;">
                        <el-table-column
                        prop="roleName"
                        label="角色名称"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="org"
                        label="所属机构"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="选择"
                        >
                            <template slot-scope="scope">
                                <!-- <input type="radio" :id="scope.$index" name="aaa"> -->
                                <el-radio @change="checkRole(scope.row)" v-model="radio" :label="scope.$index">{{rNull}}</el-radio>
                            </template>
                        </el-table-column>
                    </el-table>
                <div class="btn">
                    <el-button type="primary" @click="back">返 回</el-button>
                    <el-button type="primary" @click="save">保 存</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import addTree  from '../../common/treeOne.vue';
    import { verify,token, userId, orgId ,API}  from "../../../api/api.js";
    let USER_API = `${API}/CountryUserMgmt/user/v1`;
    let ORG_API  = `${API}/CountryUserMgmt/org/v1`;
    let list = [
        {
            roleName:'维优管理员',
            org:'根机构',
            roleId:1
        },
        {
            roleName:'辖区管理员',
            org:'根机构',
            roleId:2
        }
    ];

    export default {
        props:['addDialog'],
        data() {
            return {
                radio:'',
                chexkOrgId:'',
                //用户信息
                form:{
                    mobilePhone:'',
                    userName:'',
                    ukSn:'',
                    password:'',
                    userStatus:'正常',
                    email:'',
                    tissue:'', //所属机构
                },
                tableList:list, 
                rules: {
					mobilePhone: [
						{ required: true, message: '请输入手机号', trigger: 'blur' }
					],
					userName: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
					// tissue: [
					// 	{ required: true, message: '请选择所属机构', trigger: 'change' }
					// ],
                    userStatus:[
                        { required: true, message: '请选择用户状态', trigger: 'change' }
                    ]
            	},
                innerVisible:false,
                active:0,
                rNull:"",
                roleId:1,
                formLabelWidth:'100px'
            }
        },
        methods:{
            activeClick(data) {
                console.log(data);
            },
            cancel() {
                this.form ={
                    mobilePhone:'',
                    userName:'',
                    ukSn:null,
                    password:'',
                    userStatus:'正常',
                    email:null,
                    tissue:'',
                };
                this.$emit("close");
            },
            checkRole(row){
                this.roleId = row.roleId;
            },
            hanldeOrg(node){ //选择机构
                this.form.tissue = node.label;
                this.chexkOrgId  = node.id;
            },
            save () {
                let Params= {
                        "userName":this.form.userName,
                        "mobilePhone":this.form.mobilePhone,
                        "orgId":'000000000000000000000000', // 重点
                        // "orgId":this.chexkOrgId,
                        "userStaus":this.form.userStatus == '正常' ? '1':'2',
                        "roleId": this.roleId,
                        "email":this.form.email ? this.form.email :null,
                        "ukSn":this.form.ukSn ? this.form.ukSn :null
                    };
                this.axios.post(`${USER_API}/saveUser`,Params,{headers:{'X-UserId':userId,'X-User-OrgId': orgId,'X-User-Token': token}}).then(res => {
                    console.log(res.data);
                    this.$message({type:'success',duration:1200,message:'添加成功！'});
                    this.$emit("close");
                }).catch(err => {
                    console.log(err)
                    this.$message({
                        message: '请求错误！',
                        type: 'warning'
                    });
                });
            },
            next() {
                this.$refs['form'].validate((valid) =>{
                    if(valid){
                        var phone = verify.phoneVerify(this.form.mobilePhone);
                        var uksn  = verify.ukSnVerufy(this.form.ukSn);
                        var email = verify.emailVerify(this.form.email);
                        var name  = verify.userNameVerify(this.form.userName);
                        if(!phone){
                            this.$message({type:'error',duration:1200,message:'手机号格式不正确，请重新输入！'});
                            return false;
                        }
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
                        this.active = 1;
                    }else{
                        return false;
                    }
                })
            },
            back() {
                this.active = 0;
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
        /* float: left; */
    }
    .checkBtn{
        position: absolute;
        right: -95px;
        top: 0;
    }
</style>

