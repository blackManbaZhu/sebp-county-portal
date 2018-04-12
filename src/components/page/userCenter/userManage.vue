<template>
    <div>
         <el-container>
             <!-- <span class="closeLeft" @click="show3 = !show3"><i class="fa fa-plus"></i></span> -->
             <el-aside v-show="show3" width="360px" class="left transition-box">
                <div class="tree">
                    <v-tree :datalist="treeList"></v-tree>
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
                        v-model="inputSeach">
                    </el-input>
                    <el-select v-model="selectValue" placeholder="全部状态" class="select">
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
                        height="450"
                        border
                        style="width: 100%;"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        header-align="center"
                        width="45">
                        </el-table-column>
                        <el-table-column
                        prop="phone"
                        label="手机号"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="username"
                        label="用户名"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="addTime"
                        header-align="center"
                        label="创建时间">
                        </el-table-column>
                        <el-table-column
                        prop="status"
                        header-align="center"
                        label="状态">
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
                        style="margin-top:15px;float:right;"
                        background
                        @current-change="handleCurrentChange"
                        :page-size="pageInfo.currentPage"
                        layout="total, prev, pager, next, jumper"
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
        <!-- 弹窗 -->
            <el-dialog title="批量添加" :visible.sync="batchAddDialog" :close-on-click-modal="false">
                <el-steps :active="active" finish-status="success" class="steps" align-center>
                    <el-step title="下载模板"></el-step>
                    <el-step title="导入用户信息"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
                <div class="step" v-show="active == 0">
                    <el-button type="success" plain>下载模板</el-button>
                    <el-button type="primary" @click="next">下一步</el-button>
                </div>
                <div class="step" v-show="active == 1 ">
                    <el-upload
                        style="margin-bottom:30px;"
                        ref="upload"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :auto-upload="false"
                        :limit="1"
                        accept=".xls"
                        >
                        <el-button size="small" type="primary">选择文件</el-button>
                        <div slot="tip" class="el-upload__tip">将填写完的模板文件导入，必须是模板文件格式(xls)，不支持其他模板！</div>
                    </el-upload>
                    <el-button type="info" @click="back1" plain>返 回</el-button>
                    <el-button type="success" @click="submitUpload">上 传</el-button>
                    <el-button type="primary" @click="next">下一步</el-button>
                </div>
                <div class="step" v-show="active == 2 || active == 3">
                    <p class="p-tip">请先导入用户信息!</p>
                    <el-button type="info" @click="back2" plain>返 回</el-button>
                    <el-button type="primary" @click="finish">完 成</el-button>
                </div>
            </el-dialog>
            <el-dialog title="重置用户密码" :visible.sync="resetDialog" :close-on-click-modal="false">
                <div class="reset">
                    <p class="title">您正在重置被选中{{multipleSelection.length}}个用户的密码</p>
                </div>
                <el-form :model="form" :rules="rules" ref="form" :status-icon="true">
                    <el-form-item label="请输入新密码" :label-width="formLabelWidth" prop="newPass">
                        <el-input type="password" v-model="form.newPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="请再次输入新密码" :label-width="formLabelWidth" prop="twoPass">
                        <el-input type="password" v-model="form.twoPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <p class="tip">用户密码必须包含大写字母、小写字母、数字和特殊字符（必须包含-_@!*中的两个或两个以上）的组合，长度在6-20之间！</p>
                    <div class="btn">
                        <el-button type="info" @click="cancel" plain>取 消</el-button>
                        <el-button type="primary" @click="saveReset">保 存</el-button>
                    </div>
                </el-form>
            </el-dialog>
            <detail-user ref="initUserDetail" :detailDialog="showDetailUser" @close="closeDetailUser"></detail-user>
            <add-user :addDialog="showAddUser" @close="closeAddUser"></add-user>
            <edit-user ref="initUserMes" :eidtDialog="showEditUser" @close="closeEditUser"></edit-user>
    </div>
</template>

<script>
    import vTree  from '../../common/treeOne.vue';
    import addUser from './addUser.vue';
    import editUser from './editUser.vue';
    import detailUser from './userDetails.vue';
    import { verify }       from '../../../api/api.js';
    let dataList = [
        {
            phone:'18070902323',
            username:'zhu',
            addTime:'2018-04-06 03:00:58',
            status:'有效'
        },
        {
            phone:'18070902323',
            username:'zhu',
            addTime:'2018-04-06 03:00:58',
            status:'有效'
        },
        {
            phone:'18070902323',
            username:'zhu',
            addTime:'2018-04-06 03:00:58',
            status:'有效'
        },
        {
            phone:'18070902323',
            username:'zhu',
            addTime:'2018-04-06 03:00:58',
            status:'有效'
        }
    ];
    let option = [
        {
            value:'0',
            label:'全部状态'
        },
        {
            value:'1',
            label:'停用'
        },
        {
            value:'2',
            label:'正常'
        }
    ]
    export default { 
        components:{
            vTree,addUser,editUser,detailUser
        },
        data() {
            return {
                tableList:dataList,
                options:option,
                selectValue:'',
                inputSeach:'',
                treeList:[],
                active:0,
                multipleSelection:[],
                pageInfo:{
                    total:100,
                    currentPage: 10,
                }, 
                form:{
                    newPass:'',
                    twoPass:''
                },
                rules:{
                    newPass: [
						{ required: true, message: '请输入新密码', trigger: 'blur' }
                    ],
                    twoPass: [
						{ required: true, message: '请再次输入新密码', trigger: 'blur' }
					]
                },
                show3:true,
                showAddUser:false,
                batchAddDialog:false,
                resetDialog:false,
                showEditUser:false,
                showDetailUser:false,
                formLabelWidth:'150px'
            }
        },
        created() {
            this.initdata();
        },
        methods:{
            initdata() {
                const list = JSON.parse(localStorage.getItem('data-list')) || [];
                this.treeList = list;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val) { //点击分页

            },
            handleDelete(index,row) { //删除单个
                this.$confirm('确认删除该用户吗?', '提示', {
					type: 'warning'
                }).then(() => {

                }).catch(() => {
                    console.log("出错!!")
                });
            },
            handleEdit(index,row) {  //编辑用户信息
                this.showEditUser = true;
                this.$refs.initUserMes.initUserMes(row);
            },
            closeEditUser() {  //关闭编辑
                this.showEditUser = false;
            },
            addUser() {  //新增用户
                this.showAddUser = true;
            },
            closeAddUser() { //关闭新增
                this.showAddUser = false;
            },
            batchAdd() { //批量添加用户
                this.batchAddDialog = true;
            },
            
            reset() { // 批量重置用户密码
                if(!this.multipleSelection.length){
                    this.$message({type:'error',duration:1200,message:'当前没有选择任何用户！'});
                    return;
                }
                this.resetDialog = true;
            },
            cancel() {
                this.resetDialog = false;
            },
            saveReset() {  //保存重置密码
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
            deletSelect() { //批量删除选中用户
                if(!this.multipleSelection.length){
                    this.$message({type:'error',duration:1200,message:'当前没有选择任何用户！'});
                    return;
                }
                if(this.multipleSelection.length){
                    this.$confirm('确认删除选中用户吗?', '提示', {
					    type: 'warning'
                    }).then(() => {

                    }).catch(() => {
                        console.log("出错!!")
                    });
                }
            },
            //查看详情
            lookDetail(index,row) { 
                this.$refs.initUserDetail.initUserMes(row)
                this.showDetailUser = true;
            },
            closeDetailUser() { //关闭详情
                this.showDetailUser = false;
            },

            //批量添加弹窗操作
            submitUpload() {
                 this.$refs.upload.submit();
            },
            next() {
                if (this.active++ > 2) this.active = 0;
            },
            back1() {
                this.active = 0;
            },
            back2() {
                this.active = 1;
            },
            finish() {
                this.batchAddDialog = false;
                this.active = 0;
            },
        }
    }
</script>

<style scoped>
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
    width: 360px;
    height: 620px;
    position: relative;
}
.left .tree{
    width: 100%;
    overflow :auto;
    height: 546px;
}
.right{
    position: relative;
    height: 620px;
}
.right .top{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #D3DCE6;
    padding-top: 5px;
}
.left .bottom,.right .bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    border-top: 1px solid #D3DCE6;
    padding-top: 10px;
}
.right .bottom{
    text-align: right;
    padding-right: 10px;
}
.right .table{
    text-align: center;
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
.table{
    position: absolute;
    width: 99%;
    left: 0.5%;
    top: 55px;
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
}
.tip{
    width: 100%;
    text-align: center;
    color: #999;
    font-size: 14px;
    margin-bottom: 30px;
}
</style>