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
                    <!-- <el-col :span="8">
						<div class="grid-content bg-purple-light">
							<el-form-item label="登录密码" :label-width="formLabelWidth" prop="password">
								<el-input v-model="form.password" auto-complete="off"></el-input>
							</el-form-item>
						</div>
					</el-col>
                    <el-col :span="8">
						<div class="grid-content bg-purple-light">
							<el-form-item label="再次输入密码" :label-width="formLabelWidth" prop="agingPass">
								<el-input v-model="form.agingPass" auto-complete="off"></el-input>
							</el-form-item>
						</div>
					</el-col> -->
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
						<div class="grid-content bg-purple">
							<el-form-item label="所属机构" :label-width="formLabelWidth" prop="tissue">
								<el-cascader  v-model="form.tissue"
								:options="options"
								:show-all-levels="false"
								change-on-select
								></el-cascader>
							</el-form-item>
						</div>
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
                        label="对应功能模块">
                            <template slot-scope="scope">
                                <span class="look" @click="look()">查看对应功能</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="选择"
                        >
                            <template slot-scope="scope">
                                <!-- <input type="radio" :id="scope.$index" name="aaa"> -->
                                <el-radio v-model="radio" :label="scope.$index">{{rNull}}</el-radio>
                            </template>
                        </el-table-column>
                    </el-table>
                <div class="btn">
                    <el-button type="primary" @click="back">返 回</el-button>
                    <el-button type="primary" @click="save">保 存</el-button>
                </div>
            </div>
            <el-dialog
                width="50%"
                height="40%"
                title="对应功能模板"
                :visible.sync="innerVisible"
                append-to-body>
                <el-tree :data="treeData" @node-click="handleNodeClick"></el-tree>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import { verify }  from "../../../api/api.js";
    let list = [
        {
            roleName:'维优管理员',
            org:'根机构'
        },
        {
            roleName:'辖区管理员',
            org:'根机构'
        }
    ];

    export default {
        props:['addDialog'],
        data() {
            return {
                radio:'',
                //用户信息
                form:{
                    mobilePhone:'',
                    userName:'',
                    ukSn:'',
                    password:'',
                    userStatus:'正常',
                    email:'',
                    tissue:[], //所属机构
                },
                tableList:list, 
                rules: {
					mobilePhone: [
						{ required: true, message: '请输入手机号', trigger: 'blur' }
					],
					userName: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
					tissue: [
						{ required: true, message: '请选择所属机构', trigger: 'change' }
					],
                    userStatus:[
                        { required: true, message: '请选择用户状态', trigger: 'change' }
                    ]
            	},
				options: [{
					value: '机构一',
					label: '机构一',
					children: [{
						value: '二级机构',
						label: '二级机构',
						children: [{
							value: '1',
							label: '1'
						},{
							value: '2',
							label: '2'
						},{
							value: '3',
							label: '3'
						},{
							value: '4',
							label: '4'
						}]
					}]
                }],
                treeData:[
                    {
                        label: '一级 1',
                        children: [{
                            label: '二级 1-1',
                            children: [{
                            label: '三级 1-1-1'
                            }]
                        }]
                    }
                ],
                innerVisible:false,
                active:0,
                rNull:"",
                formLabelWidth:'100px'
            }
        },
        methods:{
            cancel() {
                this.form ={
                    mobilePhone:'',
                    userName:'',
                    ukSn:'',
                    password:'',
                    userStatus:'正常',
                    email:'',
                    tissue:[],
                };
                this.$emit("close");
            },
            save () {
 
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
            },
            look() {
                this.innerVisible = true;
            },
            handleNodeClick(value) {

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

