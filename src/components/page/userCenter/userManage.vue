<template>
    <div>
         <el-container>
             <el-aside class="left transition-box">
                <div class="tree">
                    <v-tree @handleTree="searchCheckOrg"></v-tree>
                </div>
                <div class="bottom"></div>
            </el-aside>
            <el-main class="right">
                <div class="top">
                    <el-button style="margin-left:10px;" type="primary" plain @click="addUser()"><i class="fa fa-plus-square"></i>&nbsp; 添加用户</el-button>
                    <el-button type="primary" plain @click="batchAdd()"><i class="fa fa-plus-square"></i>&nbsp; 批量添加</el-button>
                    <el-input
                        placeholder="用户名和手机号搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSeach"
                        @keyup.enter.native="search()">
                    </el-input>
                    <el-select @change="selectStatus($event)" v-model="selectValue" placeholder="全部状态" class="select">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="table">
                    <el-table
                        :data="tableList"
                        height="85%"
                        border
                        style="width: 100%;"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        header-align="center"
                        width="45">
                        </el-table-column>
                        <el-table-column
                        prop="mobilePhone"
                        label="手机号"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="userName"
                        label="用户名"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="createTime"
                        header-align="center"
                        label="创建时间">
                        </el-table-column>
                        <el-table-column
                        prop="userStatus"
                        header-align="center"
                        label="状态">
                            <template slot-scope="scope">
                                <el-button 
                                v-if="scope.row.userStatus == '有效'" 
                                type="success" plain @click="changeStatus(scope.row)">有效</el-button>
                                <el-button 
                                v-if="scope.row.userStatus == '停用'"  
                                type="danger" plain @click="changeStatus(scope.row)">停用</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="操作"
                        >
                            <template slot-scope="scope">
                                <el-button type="text" @click="lookDetail(scope.$index, scope.row)"><i class="fa fa-file-text-o"></i></el-button>
                                <el-button type="text" @click="handleEdit(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
                                <el-button type="text" @click="handleDelete(scope.$index, scope.row)"><i class="fa fa-trash-o"></i></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination
                        v-if="pShow"
                        style="margin-top:15px;float:right;"
                        background
                        @current-change="handleCurrentChange"
                        layout="total, prev, pager, next, jumper"
                        :page-size="pageSize"
                        :current-page="pageInfo.page"
                        :total="pageInfo.total">
                    </el-pagination>
                </div>
                <div class="bottom">
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个用户</span>
                    <el-button type="primary" plain @click="reset">重置选中用户密码</el-button>
                    <el-button type="primary" plain @click='deletSelect()'><i class="fa fa-trash-o"></i> 删除选中用户</el-button>
                </div>
            </el-main>
        </el-container>

            <!-- 批量添加 -->
            <el-dialog title="批量添加" :visible.sync="batchAddDialog" @close="closeUpload" :close-on-click-modal="false">
                <el-steps :active="active" finish-status="success" class="steps" align-center>
                    <el-step title="下载模板"></el-step>
                    <el-step title="导入用户信息"></el-step>
                </el-steps>
                <div class="step" v-show="active == 0">
                    <el-button type="success" plain><a href="./static/flie.xls" download="添加用户_模板">下载模板</a></el-button>
                    <el-button type="primary" @click="next">下一步</el-button>
                </div>
                <div class="step" v-show="active == 1 ">
                    <el-upload
                        style="margin-bottom:30px;"
                        ref="upload"
                        name="multipartFile"
                        :headers="headers"
                        :action="uploadUrl"
                        :auto-upload="false"
                        :before-upload="xlsbeforeUpload"
                        :on-exceed="handleExceed"
                        :on-success="uploadSuccess"
                        :limit="1"
                        accept=".xls,.xlsx"
                        >
                        <el-button size="small" type="primary">选择文件</el-button>
                        <div slot="tip" class="el-upload__tip">将填写完的模板文件导入，必须是模板文件格式(xls)，不支持其他模板！</div>
                    </el-upload>
                    <el-button type="info" @click="back1" plain>返 回</el-button>
                    <el-button type="success" @click="submitUpload">上 传</el-button>
                </div>
            </el-dialog>

            <!-- 重置用户密码 方案二 -->
            <el-dialog title="重置用户密码" :visible.sync="resetDialog" @close="closeReset" :close-on-click-modal="false">
                <div class="reset">
                    <p class="title">您正在重置被选中{{multipleSelection.length}}个用户的密码</p>
                </div>
                <el-form :model="form" :rules="rules" ref="form" label-width="150px;">
                    <el-form-item label="请输入新密码" prop="newPass">
                        <el-input type="password" v-model="form.newPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="请再次输入新密码" prop="twoPass">
                        <el-input type="password" v-model="form.twoPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <p class="tip">用户密码必须包含大写字母、小写字母、数字和特殊字符（必须包含-_@!*中的两个或两个以上）的组合，长度在6-20之间！</p>
                    <div class="btn">
                        <el-button type="info" @click="closeReset" plain>取 消</el-button>
                        <el-button type="primary" @click="saveReset">保 存</el-button>
                    </div>
                </el-form>
            </el-dialog>

            <!-- 编辑用户 -->
            <el-dialog title="编辑用户信息" :visible.sync="showEditUser" :close-on-click-modal="false">
                <div  class="step1">
                    <el-form :model="form2" :rules="rules2" ref="form2" :label-position="'right'" label-width="110px" class="form">
                        <el-col :span="10">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="用户名" prop="userName">
                                    <el-input :maxlength="60" v-model="form2.userName" auto-complete="off"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="grid-content bg-purple" style="position:relative;">
                                <el-form-item label="所属机构" prop="tissue">
                                    <el-input disabled  v-model="form2.tissue" auto-complete="off"></el-input>
                                    <el-button class="checkBtn" type="primary" @click="openEditOrg()">选 择</el-button>
                                </el-form-item>
                                <el-dialog
                                    width="50%"
                                    title="选择所属机构"
                                    :visible.sync="innerVisibleEdit"
                                    :close-on-click-modal="false"
                                    :show-close="false"
                                    append-to-body>
                                    <div style="padding:20px;height:360px;overflow: auto;">
                                        <!-- <v-tree @handleTree="editCheckOrg"></v-tree> -->
                                        <el-tree 
                                        :data="eidtOrgData" 
                                        node-key="id"
                                        @node-expand="OrgNodeClick"
                                        :expand-on-click-node="false"
                                        >
                                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                                <el-radio-group v-model="radioEdit">
                                                    <el-radio :label="data.orgId" @change="editCheckOrg(node, data)">
                                                        <i class="fa fa-folder-open"></i>
                                                        &nbsp;{{data.orgName}}
                                                    </el-radio>
                                                </el-radio-group>
                                            </span>
                                        </el-tree>
                                    </div>
                                    <div class="btn">
                                        <el-button @click="closeOrg">取 消</el-button>
                                        <el-button type="primary" @click="affirmEditOrg">确认</el-button>
                                    </div>
                                </el-dialog>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="用户角色" prop="role">
                                    <el-select @change="EditRole($event)"  v-model="form2.role" placeholder="用户角色" >
                                        <el-option 
                                        v-for="item in roletableList" 
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="uk序列号">
                                    <el-input :minlength="6" :maxlength="20" v-model="form2.ukSn" auto-complete="off"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="用户邮箱">
                                    <el-input  v-model="form2.email" auto-complete="off"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-form>
                    <div class="btn">
                        <el-button @click="closeEditUser">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">保 存</el-button>
                    </div>
                </div>
            </el-dialog>

            <!-- 新增用户弹窗 -->
            <el-dialog title="新增用户" :visible.sync="showAddUser" @close="closeAdd" :close-on-click-modal="false">
                <el-steps :active="active" finish-status="success" class="steps" align-center>
                    <el-step title="用户基本信息"></el-step>
                    <el-step title="用户角色设置"></el-step>
                </el-steps>
                <div class="step1" v-show="active==0">
                    <el-form :model="form3" :rules="rules3" ref="form3" :label-position="'right'" label-width="150px" class="form">
                        <el-col :span="10">
                            <div class="grid-content bg-purple">
                                <el-form-item label="手机号" prop="mobilePhone">
                                    <el-input v-model="form3.mobilePhone" auto-complete="off"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="用户名" prop="userName">
                                    <el-input :maxlength="64" v-model="form3.userName" auto-complete="off"></el-input>
                                </el-form-item>
                                <p class="tip">用户名支持中英文和数字</p>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="用户状态" prop="userStatus">
                                    <el-select v-model="form3.userStatus" placeholder="用户状态">
                                        <el-option label="正常" value="0"></el-option>
                                        <el-option label="停用" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                        <!-- <p class="tip">用户密码必须包含大写字母、小写字母、数字和特殊字符（必须包含-_@!*中的两个）的组合，长度在6-20之间！</p> -->
                        <el-col :span="10">
                            <div class="grid-content bg-purple" style="position:relative;">
                                <el-form-item label="所属机构" prop="tissue">
                                    <el-input disabled  v-model="form3.tissue" auto-complete="off"></el-input>
                                    <el-button class="checkBtn" type="primary" @click="openAddOrg">选 择</el-button>
                                </el-form-item>
                            </div>
                            
                            <el-dialog
                                width="50%"
                                title="选择所属机构"
                                :visible.sync="innerVisible"
                                :close-on-click-modal="false"
                                :show-close="false"
                                append-to-body>
                                <div style="height:360px;overflow: auto;">
                                    <!-- <v-tree @handleTree="handleAdd"></v-tree> -->
                                    <el-tree 
                                        :data="addOrgData" 
                                        node-key="id"
                                        @node-expand="OrgNodeClick"
                                        :expand-on-click-node="false"
                                        >
                                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                                <el-radio-group v-model="radioAdd">
                                                    <el-radio :label="data.orgId" @change="addCheckOrg(node, data)">
                                                        <i class="fa fa-folder-open"></i>
                                                        &nbsp;{{data.orgName}}
                                                    </el-radio>
                                                </el-radio-group>
                                            </span>
                                        </el-tree>
                                </div>
                                <div class="btn">
                                    <el-button @click="closeOrg">取 消</el-button>
                                    <el-button type="primary" @click="affirmAddOrg">确认</el-button>
                                </div>
                            </el-dialog>
                        </el-col>
                        <el-col :span="10">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="uk序列号" >
                                    <el-input :minlength="6" :maxlength="20"  v-model="form3.ukSn" auto-complete="off"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="用户邮箱">
                                    <el-input v-model="form3.email" auto-complete="off"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-form>
                    <div class="btn">
                        <el-button @click="closeAdd">取 消</el-button>
                        <el-button type="primary" @click="nextAdd">下一步</el-button>
                    </div>
                </div>
                <div class="step2" v-show="active==1 || active==2">
                    <el-table
                            :data="roletableList"
                            border
                            align="center"
                            style="width: 100%;">
                            <el-table-column
                            prop="name"
                            label="角色名称"
                            header-align="center"
                            >
                            </el-table-column>
                            <el-table-column
                            prop="createTime"
                            label="创建时间"
                            header-align="center"
                            >
                            </el-table-column>
                            <el-table-column
                            header-align="center"
                            label="选择"
                            >
                                <template slot-scope="scope">
                                    <el-radio @change="checkRole(scope.row)" v-model="radio" :label="scope.$index">{{nostr}}</el-radio>
                                </template>
                            </el-table-column>
                        </el-table>
                    <div class="btn">
                        <el-button type="primary" @click="backAdd">返 回</el-button>
                        <el-button type="primary" @click="saveAdd">保 存</el-button>
                    </div>
                </div>
            </el-dialog>

            <!-- 查看用户详情 -->
            <detail-user ref="initUserDetail" :detailDialog="showDetailUser" @close="closeDetailUser"></detail-user>
    </div>
</template>

<script>
    import { verify, API, Headers ,UserHeader ,getTime ,trim ,allSrim,tokenMessage}  from '../../../api/api.js';
    import vTree      from '../../common/treeOne.vue'; //树结构组件
    import detailUser from './userDetails.vue';    //用户信息组件
    //用户
    let USER_API      = `${API}/CountryUserMgmt/user/v1`;
    //上传
    let UP_API        = `${API}/zuul/CountryUserMgmt/user/v1`;
    //机构
    let ORG_API       = `${API}/CountryUserMgmt/org/v1`;
    //角色
    let ROLE_API      = `${API}/CountryUserMgmt/role/v1`;
    //生成Excel文件
    // const ExportJsonExcel = require('js-export-excel')
    //下拉框
    let option = [
        {
            value:'',
            label:'全部状态'
        },
        {
            value:'1',
            label:'正常'
        },
        {
            value:'2',
            label:'停用'
        }
    ];
    export default { 
        components:{
            vTree,detailUser
        },
        data() {
            return {
                //用户列表
                tableList:[],
                //下拉框
                options:option,
                selectValue:'',
                //输入框筛选
                inputSeach:'',
                //用户状态筛选
                searchStatus:'',
                //用户机构筛选
                searchOrgID:'',
                //记录选中用户
                multipleSelection:[],

                //重置密码信息
                form:{
                    newPass:'',
                    twoPass:''
                },
                //重置密码校验
                rules:{
                    newPass: [
						{ required: true, message: '请输入新密码'}
                    ],
                    twoPass: [
						{ required: true, message: '请再次输入新密码'}
					]
                },
                //编辑用户信息
                editBeforeOrg:'',
                radioEdit:'',
                eidtOrgData:[],
                editOrgObj:'',
                editOrgID:'',
                editRole:'',
                editUserID:'',
                form2:{
                    userName:'',
                    ukSn:'',
                    role:'',
                    email:'',
                    tissue:''
                },
                //编辑用户校验
                rules2: {
					userName: [
						{ required: true, message: '请输入用户名'}
                    ],
					tissue: [
						{ required: true, message: '请选择所属机构'}
					],
					role: [
						{ required: true, message: '请选择用户角色'}
					]
                },
                //添加用户信息
                addOrgData:[],
                radioAdd:'',
                radio:'',
                chexkOrgId:'',
                addOrgObj:'',
                form3:{
                    mobilePhone:'',
                    userName:'',
                    ukSn:'',
                    password:'',
                    userStatus:'正常',
                    email:'',
                    tissue:'', //所属机构
                },
                //角色信息列表
                roletableList:[], 
                //添加用户信息校验 
                rules3: {
					mobilePhone: [
						{ required: true, message: '请输入手机号'}
					],
					userName: [
						{ required: true, message: '请输入用户名'}
                    ],
                    userStatus:[
                        { required: true, message: '请选择用户状态'}
                    ],
                    tissue: [
						{ required: true, message: '请选择所属机构' }
					],
                },
                //步骤
                active:0,
                //空字符
                nostr:"",
                //角色类型
                roleId:'',

                //弹框
                innerVisible:false,
                innerVisibleEdit:false,
                  //新增
                showAddUser:false,
                  //批量添加
                batchAddDialog:false,
                  //重置密码
                resetDialog:false,
                  //编辑用户
                showEditUser:false,
                  //用户详情
                showDetailUser:false,

                //查询状态
                activateSearch:false,

                
                //一页显示条数
                pageSize:10,
                //分页
                pageInfo:{
                    total:0,
                    page: 1,
                },
                //是否显示分页
                pShow:false,

                //上传文档 url header 
                uploadUrl:`${UP_API}/importUser`,
                headers: Headers
            }
        },
        methods:{

            //获取列表数据 
            getListData(Params) {
                this.axios.post(`${USER_API}/findAllUser`,Params,{headers:Headers}).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success"){
                        let data = res.data.payload;
                        //返回数据
                        this.tableList = data.list.map(value=>{
                            value.createTime = getTime(value.createTime)
                            value.userStatus = value.userStatus == 1 ? '有效' : '停用'
                            return value;
                        });

                        //总页数
                        this.pageInfo.total = data.total;

                        //超出10条显示分页
                        if(this.pageInfo.total > 10) {
                            this.pShow = true;
                        }

                    }else{

                        if(res.data.code == 'ParamInvalid') {
                            this.$message({type: 'error',message:'不能输入带有空格和特殊字符、乱码的关键字'})
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
            },
            
            handleCurrentChange(page) { 
                //点击分页
                let keyword    = this.inputSeach ? allSrim(this.inputSeach) : null;
                let userStatus = this.searchStatus ? this.searchStatus : null;
                let orgId      = this.searchOrgID ? this.searchOrgID : null;

                if(this.activateSearch){ //查询状态
                    var Params = {
                        "keyword":keyword,
                        "userStatus":userStatus,
                        "orgId":orgId,
                        "pageNum":page
                    }
                }else{
                    var Params = {
                        "pageNum":page
                    }
                }
                this.getListData(Params);
            },

            searchCheckOrg(node) { 
                //机构选择 查询用户列表
                this.searchOrgID   = node.orgId;
                this.pageInfo.page = 1;
                //激活查询状态
                this.activateSearch= true;

                let keyword    = this.inputSeach ? allSrim(this.inputSeach) : null;
                let userStatus = this.searchStatus ? this.searchStatus : null;
                let orgId      = node.orgId;

                let Params = {
                    "keyword":keyword,
                    "userStatus":userStatus,
                    "orgId":orgId,
                }

                this.getListData(Params);
            },

            selectStatus(event) {
                //根据用户状态查询用户列表
                this.searchStatus  = event;
                this.pageInfo.page = 1;
                //激活查询状态
                this.activateSearch= true;

                let keyword    = this.inputSeach ? allSrim(this.inputSeach) : null;
                let userStatus = event;
                let orgId      = this.searchOrgID ? this.searchOrgID : null;

                let Params = {
                    "keyword":keyword,
                    "userStatus":userStatus,
                    "orgId":orgId,
                }

                this.getListData(Params);
            },

            search(){
                //输入框查询用户列表
                this.pageInfo.page  = 1;
                let keyword = this.inputSeach ? allSrim(this.inputSeach) : null;

                let Params = {
                    "keyword":keyword
                }

                //激活查询状态
                this.activateSearch = true;

                this.getListData(Params)
            },

     /////////// 用户信息操作 新增 编辑 删除 改变状态/////////////

            getUserRoleId() {
                //获取用户角色信息
                this.axios.get(`${ROLE_API}/selectAll`,{ headers: Headers }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success"){
                        let data = res.data.payload;
                        this.roletableList   = data.map(value=>{
                            value.createTime = getTime(value.createTime);
                            return value;
                        });
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
                        message: "请求出错，请刷新页面！",
                        type: 'warning'
                    });
                });
            },

            
            //点击获取子机构
            OrgNodeClick(node) {
                let Params= {"orgId":node.orgId};
                this.axios.post(`${ORG_API}/findByParentId`,Params,{ headers: UserHeader }).then(res => {
					// console.log(res.data.payload);
                    if(res.data.code == "Success") {
                        let arr   =  res.data.payload;
                        node.children = [];
                        let child = node.children;
                        arr.map(value=>{
                            if(value.isExistChild == 0){
                                value.children = [];
                            }else{
                                value.children = [{label:'',id:''}];
                            }
                            child.push(value);
                        })
                    }else {

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
            },

            openEditOrg() {  
                //点击选择编辑机构弹窗
                this.radioEdit    = '';
                this.eidtOrgData  = [];
                //获取根机构
                let Params= {"orgId":UserHeader['X-User-OrgId']};

                this.axios.post(`${ORG_API}/findByOrgId`,Params,{ headers: UserHeader }).then(res => {
					if(res.data.code == "Success") {
                        let arr = res.data.payload;
                        if(arr.isExistChild == 0){
                            arr.children = [];
                        }else{
                            arr.children = [{label:'',id:''}];
                        }
                        this.eidtOrgData.push(arr);

                        this.innerVisibleEdit = true;

                    }else {

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

            },

            openAddOrg() {
                //获取新增机构弹窗根机构

                this.radioAdd   = '';

                this.addOrgData = [];

                let Params= {"orgId":UserHeader['X-User-OrgId']};

                this.axios.post(`${ORG_API}/findByOrgId`,Params,{ headers: UserHeader }).then(res => {
					if(res.data.code == "Success") {
                        let arr = res.data.payload;
                        if(arr.isExistChild == 0){
                            arr.children = [];
                        }else{
                            arr.children = [{label:'',id:''}];
                        }
                        this.addOrgData.push(arr);

                        this.innerVisible = true;

                    }else {

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
            },

            //关闭机构选择弹窗
            closeOrg()  {
                //清除新增机构信息
                // this.addOrgObj    = '';
                // this.form3.tissue = '';
                // this.chexkOrgId   = '';

                //清除编辑新增信息
                // this.editOrgObj   = '';
                // this.editOrgID    = '';
                // this.form2.tissue = '';

                this.innerVisibleEdit = false;
                this.innerVisible     = false;

            },

            //////////////////编辑开始///////////////

            handleEdit(index,row) {  
                //编辑用户信息
                this.getUserRoleId()   //获取用户角色列表
                this.showEditUser      = true;
                this.editUserID        = row.userId;

                let Params= {"userId":row.userId};
                //获取用户信息
                this.axios.post(`${USER_API}/findByUserId`,Params,{ headers: Headers }).then(res => {
                    // console.log(res.data.payload);
                    if(res.data.code == "Success") {
                        let data = res.data.payload;
                        this.form2.userName    = data.userName;
                        this.form2.ukSn        = data.ukSn;
                        this.form2.role        = data.roleName;
                        this.editRole          = data.roleId;
                        this.form2.email       = data.email;
                        this.form2.tissue      = data.orgName;
                        this.editOrgID         = data.orgId;
                        this.editBeforeOrg     = data.orgName;
                    }else {
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
            },

            editCheckOrg(node,data) {
                //编辑用户机构
                this.editOrgObj = data;
            },

            affirmEditOrg() { 
                //确定机构选择
                if(this.editOrgObj){
                    this.editOrgID    = this.editOrgObj.orgId;
                    this.form2.tissue = this.editOrgObj.orgName;
                    this.innerVisibleEdit = false 
                }else {
                    this.$message({type:'error',duration:1200,message:'您没有选择机构！'});
                }
            },

            EditRole(event) {
                //编辑用户角色
                this.editRole = event;
            },

            saveEdit () {
                //保存编辑
                this.$refs['form2'].validate((valid) =>{
                    if(valid){
                        var uksn  = verify.ukSnVerufy(this.form2.ukSn);
                        var email = verify.emailVerify(this.form2.email);
                        var name  = verify.userNameVerify(this.form2.userName);
                        if(this.form2.ukSn && !uksn){
                            this.$message({type:'error',duration:1200,message:'UK序列号格式不正确，且长度6-20之间！'});
                            return false;
                        }
                        if(this.form2.email && !email){
                            this.$message({type:'error',duration:1200,message:'用户邮箱格式不正确！'});
                            return false;
                        }
                        if(this.form2.email){
                            if(Number(this.form2.email.length) < 7 || Number(this.form2.email.length) >60){
                                this.$message({type:'error',duration:1200,message:'用户邮箱长度不正确,且长度7-60之间！'});
                                return false;
                            }
                        }
                        if(!name){
                            this.$message({type:'error',duration:1200,message:'用户名称格式不正确，请重新输入！'});
                            return false;
                        }

                        let userId   = this.editUserID;
                        let userName = trim(this.form2.userName);
                        let Email    = trim(this.form2.email) ? trim(this.form2.email): null;
                        let UKsn     = trim(this.form2.ukSn) ? trim(this.form2.ukSn) : null;
                        let eOrgId   =  this.editOrgID;
                        let roleId   = this.editRole;
                        

                    
                        let Params= {
                            "userId": userId, 
                            'userName': userName, 
                            "email": Email,
                            "ukSn": UKsn,
                            "orgId": eOrgId,
                            "roleId": roleId
                        };


                        this.axios.post(`${USER_API}/updateByUserId`,Params,{ headers: Headers }).then(res => {
                            // console.log(res.data);
                            if(res.data.code == "Success") {
                                this.$message({type:'success',duration:1200,message:'保存成功'});
                                //更新列表数据
                                let Params = {}
                                this.getListData(Params);
                                //关闭弹窗
                                this.showEditUser = false;
                            }else {
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
            },

            closeEditUser() {  
                //关闭编辑
                this.showEditUser = false;
                //关闭表单验证
                this.$refs['form2'].resetFields();
            },

            //////////////////编辑结束///////////////

            //////////////////新增开始///////////////

            addUser() {  
                //新增用户
                this.showAddUser = true;
            },
            
            checkRole(row){
                //选择角色
                this.roleId = row.code;
            },
            addCheckOrg(node,data){
                //选择机构
                this.orgObj = data;
            },
            affirmAddOrg() {
                //确认新增机构选择
                if(this.orgObj){
                    this.form3.tissue = this.orgObj.orgName;
                    //记录机构id
                    this.chexkOrgId   = this.orgObj.orgId;

                    this.innerVisible = false 
                }else {
                    this.$message({type:'error',duration:1200,message:'您没有选择机构！'});
                }
            },
            nextAdd() {
                //新增下一步
                this.$refs['form3'].validate((valid) =>{
                    if(valid){
                        var phone = verify.phoneVerify(this.form3.mobilePhone);
                        var uksn  = verify.ukSnVerufy(this.form3.ukSn);
                        var email = verify.emailVerify(this.form3.email);
                        var name  = verify.userNameVerify(this.form3.userName);
                        if(!phone){
                            this.$message({type:'error',duration:1200,message:'手机号格式不正确，请重新输入！'});
                            return false;
                        }
                        if(this.form3.ukSn && !uksn){
                            this.$message({type:'error',duration:1200,message:'UK序列号格式不正确，且长度6-20之间！'});
                            return false;
                        }
                        if(this.form3.email && !email){
                            this.$message({type:'error',duration:1200,message:'用户邮箱格式不正确！'});
                            return false;
                        }
                        if(this.form3.email) {
                            if( Number(this.form3.email.length) < 7 || Number(this.form3.email.length) >60){
                                this.$message({type:'error',duration:1200,message:'用户邮箱长度不正确,且长度7-60之间！'});
                                return false;
                            }
                        }
                        if(!name){
                            this.$message({type:'error',duration:1200,message:'用户名称格式不正确，请重新输入！'});
                            return false;
                        }
                        //获取用户角色列表
                        this.getUserRoleId();
                        //下一步
                        this.active = 1;
                    }else{
                        return false;
                    }
                })
            },

            //保存新增
            saveAdd () {
                if(!this.roleId){
                    this.$message({
                        message: '请选择用户角色！',
                        type: 'error'
                    });
                    return false;
                }

                let username    = trim(this.form3.userName);
                let mobilePhone = trim(this.form3.mobilePhone);
                let orgId       = this.chexkOrgId;
                let userStatus  = this.form3.userStatus == '正常' ? '1':'2';
                let roleId      = this.roleId;
                let email       = this.form3.email ? trim(this.form3.email) : null;
                let ukSn        = this.form3.ukSn ? trim(this.form3.ukSn) : null;

                let Params= {
                    "userName": username,
                    "mobilePhone": mobilePhone,
                    "orgId": orgId,
                    "userStatus": userStatus,
                    "roleId": roleId,
                    "email": email,
                    "ukSn": ukSn
                };
                this.axios.post(`${USER_API}/saveUser`,Params,{ headers : UserHeader }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success"){
                        this.$message({type:'success',duration:1200,message:'添加成功！'});
                        //更新列表
                        let Params = {}
                        this.getListData(Params);
                        //关闭弹窗
                        this.closeAdd();
                        //添加成功返回第一步
                        this.active = 0;
                        this.showAddUser = false;
                    }else {
                        if(res.data.code == "TokenInvalid"){
                            this.$message({type: 'error',message: tokenMessage})
                            return false;
                        }
                        this.$message({
                            message: res.data.message,
                            type: 'warning'
                        });
                        this.active = 0;
                    }
                }).catch(err => {
                    // console.log(err)
                    this.$message({
                        message: '请求错误！',
                        type: 'warning'
                    });
                });
            },
            
            backAdd() {
                //返回第一步
                this.active = 0;
            },

            closeAdd() {
                //关闭新增弹框
                this.form3.mobilePhone = '';
                this.form3.userName    = '';
                this.form3.ukSn        = '';
                this.form3.password    = '';
                this.form3.userStatus  = '正常';
                this.form3.email       = '';
                this.form3.tissue      = '';
                this.showAddUser       = false;
                this.active            = 0;
                //关闭表单验证
                this.$refs['form3'].resetFields();
            },

            //////////////////新增结束///////////////



             //1、重置密码 方案一 （暂时采用方案一）
            reset() {
                 // 批量重置用户密码
                if(!this.multipleSelection.length){
                    this.$message({type:'error',duration:1200,message:'当前没有选择任何用户！'});
                    return;
                }
                this.$confirm('确认重置用户密码吗?', '提示', {
					type: 'warning'
                }).then(() => {
                        let str = '';
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            str += this.multipleSelection[i].userId +',';
                        }
                        let Params= {"userId":str};
                        this.axios.post(`${USER_API}/resetPassword`,Params,{ headers: Headers }).then(res => {
                            
                            if(res.data.code == "Success") {

                                this.$message({type:'success',duration:1200,message:'重置成功'});

                            }else {

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
                }).catch(() => {
                    console.log("出错!!")
                });
            },

            //2、重置密码 方案二
            closeReset() {
                //取消重置密码
                this.resetDialog = false;
            },
            saveReset() { 
                //保存重置密码
                this.$refs['form'].validate((valid) =>{
                    if(valid){
                        var pass = verify.passwordVerify(this.form.newPass);
                        if(!pass){
                            this.$message({type:'error',duration:1200,message:'密码格式错误，请重新输入!'});
                            return false;
                        }
                        if(this.form.twoPass != this.form.newPass){
                            this.$message({type:'error',duration:1200,message:'两次密码不相同!'});
                            return false;
                        }
                    }else{
                        return false;
                    }
                });
            },

            handleSelectionChange(val) {
                //选中用户列表
                this.multipleSelection = val;
            },

            handleDelete(index,row) { 
                //删除单个用户
                this.$confirm('确认删除该用户吗?', '提示', {
					type: 'warning'
                }).then(() => {
                    this.deleteRequst(row.userId);
                }).catch(() => {
                    console.log("出错!!")
                });
            },
            deletSelect() { 
                //批量删除选中用户
                if(!this.multipleSelection.length){
                    this.$message({type:'error',duration:1200,message:'当前没有选择任何用户！'});
                    return;
                }
                if(this.multipleSelection.length){
                    this.$confirm('确认删除选中用户吗?', '提示', {
					    type: 'warning'
                    }).then(() => {
                        let str = '';
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            str += this.multipleSelection[i].userId +',';
                        }
                        this.deleteRequst(str);
                    }).catch(() => {
                        console.log("出错!!")
                    });
                }
            },
            deleteRequst(arr){
                //删除用户请求
                let Params = { 'userId':arr}
                this.axios.post(`${USER_API}/deleteByUserId`,Params,{ headers : Headers }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success") {
                        //更新用户列表数据
                        let Params = {}

                        this.getListData(Params);

                        this.$message({type:'success',duration:1200,message:'删除成功！'});
                    }else {

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
                        message: '删除失败！',
                        type: 'warning'
                    });
                });
            },
            
            lookDetail(index,row) { 
                //查看用户详情
                this.$refs.initUserDetail.initUserMes(row)
                this.showDetailUser = true;
            },
            closeDetailUser() { 
                //关闭详情弹框
                this.showDetailUser = false;
            },

            changeStatus(row) { 
                //修改用户状态
                this.$confirm('确认修改该用户状态吗?', '提示', {
					    type: 'warning'
                    }).then(() => {
                        let userStatus = row.userStatus == '有效' ? '2':'1';
                        let Params = { 'userId':row.userId,"userStatus":userStatus}
                        this.axios.post(`${USER_API}/updateStatusByUserId`,Params,{ headers : Headers }).then(res => {
                            // console.log(res.data);
                            if(res.data.code == "Success") {

                                row.userStatus = row.userStatus == '有效' ? '停用' : '有效';

                                this.$message({type:'success',duration:1200,message:'修改成功！'});

                            }else {

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
                                message: '修改失败！',
                                type: 'warning'
                            });
                        });
                        
                    }).catch(() => {
                        console.log("出错!!")
                    });
                
            },

            batchAdd() {
                //批量添加用户
                this.batchAddDialog = true;
            },
            handleExceed(files) { 
                //选择Excel限制个数
                this.$message.warning(`当前限制选择1个文件`);
            },
            xlsbeforeUpload(file) { 
                //上传之前
                let fileType = file.name.split('.')[1];
                if(fileType != 'xls' && fileType != 'xlsx' 
                && fileType != 'XLS' && fileType != 'XLSX'){
                    this.$message.error(`添加失败！当前文件格式不正确!`);
                    return false;
                }
            },
            uploadSuccess(data) {  
                //上传成功之后
                let obj = data.payload;
                if(data.code == "Success"){
                    if(obj.length){
                        this.$message.warning(`${obj[0].message}，请修改错误格式！`);
                        var option={};
                        var arr   = [];
                        for(let i=0;i<obj.length;i++){
                            arr.push(
                                {
                                    one:obj[i].userName,
                                    two:obj[i].mobilePhone,
                                    three:obj[i].orgId,
                                    four:obj[i].roleName,
                                    file:obj[i].ukSn,
                                    email:obj[i].email,
                                    error:obj[i].message
                                }
                            )
                        }
                        option.fileName = '用户信息格式错误列表';
                        option.type     = '.xls';
                        option.datas=[
                            {
                                sheetData:arr,
                                sheetName:'sheet',
                                sheetHeader:['用户名','手机号','所属机构','角色名','UK(可不输)','邮箱(可不输)','错误信息']
                            }
                        ];
                        var toExcel=new ExportJsonExcel(option);
                        toExcel.saveExcel();
                    }else{
                        //关闭弹窗
                        this.batchAddDialog = false;

                        this.$message.success(`上传成功！`);
                        
                    }
                }else{
                    this.$message({type:'error', message: res.message});
                }
                //清除上传列表
                this.$refs.upload.clearFiles();
                //更新列表数据
                let Params = {}
                this.getListData(Params);
            },
            submitUpload() {
                //开始上传文档
                 this.$refs.upload.submit();
            },

            next() {
                //下一步
                if (this.active++ > 2) this.active = 0;
            },
            back1() {
                //返回第一步
                this.active = 0;
            },
            closeUpload() {
                //关闭上传弹框
                this.$refs.upload.clearFiles();
                //返回第一步
                this.active = 0;
            },
        },
        mounted() {
            //更新用户列表数据
            let Params = {}
            this.getListData(Params);
        }
    }
</script>

<style scoped>
.el-table__row {
    text-align: center;
}
.el-container{
    position: relative;
}
.top .el-input{
    width: auto;
    float: right;
    width: 180px;
    margin-right: 10px;
}
.select{
    width: 120px;
    margin-right: 10px;
    color: #409EFF;
    float: right;
}
.closeLeft{
    position: absolute;
    
    top: 45%;
    left: -15px;
    z-index: 99;
    border: 1px solid #D3DCE6;
    width: 15px;
    height: 60px;
    line-height: 60px;
    color: #606266;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}
.left{
    width: 300px;
    /* height: 620px; */
    height: 80vh;
    position: relative;
}
.left .tree{
    width: 100%;
    overflow :auto;
    height: 90%;
}
.right{
    position: relative;
    /* height: 620px; */
    height: 80vh;
}
.right .top{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10%;
    border-bottom: 1px solid #D3DCE6;
    padding-top: 5px;
}
.left .bottom,.right .bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10%;
    border-top: 1px solid #D3DCE6;
    padding-top: 10px;
}
.right .bottom{
    text-align: right;
    padding-right: 10px;
}
.right .table{
    text-align: center;
    height: 78%;
}
.table{
    position: absolute;
    width: 99%;
    left: 0.5%;
    top: 12%;
}
.selectSpan{
    float: left;
    margin-left: 10px;
    font-size: 14px;
    line-height: 40px;
}
.selectSpan i{
    color: #3e3e3e;
}
.el-aside {
    overflow: none;
    color: #333;
    text-align: center;
    border: 1px solid #D3DCE6;
    margin-right: 20px;
  }
.el-main {
    color: #333;
    border: 1px solid #D3DCE6;
}
.step{
    text-align: center;
    padding: 10px;
}
.p-tip{
    font-size: 18px;
    color: red;
    font-weight: bold;
    margin-bottom: 30px;
}
.reset{
    padding: 10px;
}
.title{
    width: 100%;
    /* text-align: center; */
    color: #999;
    font-size: 14px;
}
.btn{
    text-align: center;
    width: 100%;
    height: 40px;
    margin-top: 20px;
}
.form{
    display: inline-table;
}
.tip{
    width: 100%;
    text-align: center;
    color: #999;
    font-size: 14px;
    margin-bottom: 30px;
}
.checkBtn{
    position: absolute;
    right: -95px;
    top: 0;
}
</style>