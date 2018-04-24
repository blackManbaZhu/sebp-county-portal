<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="addMedia()"><i class="fa fa-plus-square"></i>&nbsp; 添加FM频道</el-button>
                    <el-input
                        placeholder="请输入名称搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSeach"
                        @keyup.enter.native="search()">
                    </el-input>
                </div>
                <div class="table">
                    <el-table
                        :data="tableList"
                        height="88%"
                        border
                        style="width: 100%;"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        header-align="center"
                        width="45">
                        </el-table-column>
                        <el-table-column
                        prop="mediaName"
                        label="FM名称"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="mediaContext"
                        label="FM频道"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="createUser"
                        label="创建人"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="createTime"
                        header-align="center"
                        label="创建时间">
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <!-- <el-button type="text"><i class="fa fa-play-circle"></i></el-button> -->
                            <el-button type="text" @click="editMedia(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
                            <el-button type="text" @click="deleteMedia(scope.$index, scope.row)"><i class="fa fa-trash-o"></i></el-button>
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
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个FM</span>
                    <el-button type="primary" plain class="btn" @click="deleteSelect()"><i class="fa fa-trash-o"></i> 删除选中FM</el-button>
                </div>
            </el-main>
        </el-container>
        <!-- 编辑音频弹窗 -->
        <el-dialog title="修改FM频道" :visible.sync="dialogFormVisible" @close="closeDialogEdit" :close-on-click-modal="false">
            <el-form :model="form1" :rules="rules" ref="form1" label-width="80px">
                <el-form-item label="FM名称" prop="name">
                 <el-input :maxlength="30" v-model="form1.name" auto-complete="off" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="FM频道" prop="channel">
                 <el-input :minlength="3" :maxlength="30" v-model="form1.channel" auto-complete="off" placeholder="76.0~108.0"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit()">保 存</el-button>
            </div>
        </el-dialog>
        <!-- 新增音频弹窗 -->
        <el-dialog title="新增FM频道" :visible.sync="addFm" @close="closeDialogAdd" :close-on-click-modal="false">
            <el-form :model="form2" :rules="rules" ref="form2" label-width="80px">
                <el-form-item label="FM名称" prop="name">
                 <el-input :maxlength="30" v-model="form2.name" auto-complete="off" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="FM频道" prop="channel">
                 <el-input :minlength="3" :maxlength="30" v-model="form2.channel" auto-complete="off" placeholder="76.0~108.0"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFm = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd()">添 加</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import addVideo from "./Dialog/addVideo.vue";
    import { verify, API, Headers ,  getTime ,trim ,allSrim ,tokenMessage} from "../../../api/api.js";
    //获取数据
    let FM_API = `${API}/CountryResMgmt/media/v1`;
    export default {
        components:{
            addVideo
        },
        data() {
            return {
                tableList:[], //列表数据
                inputSeach:'', //搜索关键字
                multipleSelection:[], //选中的数据
                editObj:'', //编辑数据
                //当前页面显示多少条
                pageSize:10, 
                //是否显示分页
                pShow:false,
                pageInfo:{ //分页
                    total:1,
                    page: 1,
                },
                form1:{ //编辑表单
                    name:'',
                    channel:''
                },
                form2:{  //新增表单
                    name:'',
                    channel:''
                },
                //校验
                rules:{ 
                    channel:[
                        { required:true, message:'FM频道必填！'}
                    ],
                    name:[
                        { required:true, message:'FM名称必填！'}
                    ]
                },
                //添加弹窗
                addFm:false,
                //编辑弹窗
                dialogFormVisible:false,
            }
        },
        created() {
            let Params = {
                "keyword": '',
                "mediaType":'4'
            }
            this.getListData(Params);
        },
        methods:{
            //获取数据列表
            getListData(Params) {

                // let Params= {"keyword":keyword, 'pageNum':pageNum, "pageSize":pageSize,"mediaType":'4'};

                this.axios.post(`${FM_API}/findAllMedia`,Params,{ headers : Headers }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success") {
                        //返回数据
                        let data = res.data.payload;
                        this.tableList = data.list.map((value,index) =>{
                            value.createTime = getTime(value.createTime);
                            return value;
                        });

                        //总条数
                        this.pageInfo.total = data.total; 
                        
                        if(this.pageInfo.total > 10) {
                            this.pShow = true;
                        }

                    }else {

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
                        message: '请求错误！',
                        type: 'warning'
                    });
                });
            },
            
            handleCurrentChange(page) {
                //点击分页
                let keyword = this.inputSeach ? allSrim(this.inputSeach) : '';

                var  Params = {
                    "keyword": keyword,
                    "pageNum":page,
                    "mediaType":'4'
                }

                this.getListData(Params);
            },

            //搜索
            search() {
                this.pageInfo.page = 1;

                let keyWords = this.inputSeach ? allSrim(this.inputSeach) : '';

                var Params = {
                    "keyword":keyWords,
                    "mediaType":'5'
                }
            
                this.getListData(Params);
            },

            editMedia(index,row) { 
                //编辑
                this.form1.channel = row.mediaContext;
                this.form1.name    = row.mediaName;
                this.editObj       = row;
                this.dialogFormVisible = true;
            },
            saveEdit() { 
                //保存编辑
                this.$refs['form1'].validate((valid) =>{
                    if(valid){
                        var name = this.FMnameVerify(this.form1.name);
                        var fm   = this.FMverify(this.form1.channel);
                        var num  = this.form1.channel;
                        if(!name){
                            return name;
                        }
                        if(!fm){
                            return fm;
                        }
                        if(parseInt(num, 10) === num){
                            num = num + '.0'
                        }
                        let mediaName    = trim(this.form1.name);
                        let mediaContext = trim(num);
                        let mediaId      = this.editObj.mediaId;


                        let Params= {"mediaName": mediaName,"mediaContext":mediaContext, "mediaId": mediaId};

                        this.axios.post(`${FM_API}/modifyFM`,Params,{ headers : Headers }).then(res => {
                            // console.log(res.data);
                            if(res.data.code == "Success") {
                                //刷新列表数据
                                let Params = {
                                    "keyword": '',
                                    "mediaType":'4'
                                };
                                this.getListData(Params);
                                //关闭弹窗
                                this.dialogFormVisible = false;

                                this.$message({type:'success',duration:1200,message:'编辑成功!'});
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
                    }else{
                        return false;
                    }
                })
            },
            addMedia() {  
                //新增
                this.addFm = true;
            },
            saveAdd() { 
                //保存新增
                this.$refs['form2'].validate((valid) =>{
                    if(valid){
                        var name = this.FMnameVerify(this.form2.name);
                        var fm   = this.FMverify(this.form2.channel);
                        var num  = Number(this.form2.channel);
                        if(!name){
                            return name;
                        }
                        if(!fm){
                            return fm;
                        }
                        if(num%1 === 0){
                            num+='.0'
                        }
                        console.log(num)
                        let mediaName    = trim(this.form2.name);
                        let mediaContext = trim(num);

                        
                        let Params= {
                            "mediaName":mediaName,
                            "mediaContext":mediaContext
                        };

                        this.axios.post(`${FM_API}/saveFM`,Params,{ headers : Headers }).then(res => {
                            // console.log(res.data);
                            if(res.data.code == "Success"){
                                //刷新列表数据
                                let Params = {
                                    "keyword": '',
                                    "mediaType":'4'
                                };
                                this.getListData(Params);

                                //关闭弹窗
                                this.addFm = false;
                                //清除输入框
                                this.form2.name = this.form2.channel = '';
                                
                                this.$message({type:'success',duration:1200,message:'保存成功!'});
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
                                message: '请求错误！',
                                type: 'warning'
                            });
                        });
                    }else{
                        return false;
                    }
                })
            },

            handleSelectionChange(val) {
                //多选 选中列表
                this.multipleSelection = val;
            },

            deleteMedia(index,row) { //删除单个
                this.$confirm('确认删除该FM资源吗?', '提示', {
					type: 'warning'
                }).then(() => {
                    this.deleteRequst(row.mediaId);
                }).catch(() => {
                    console.log("出错!!")
                });
            },
            deleteSelect() {
                if(!this.multipleSelection.length){
                    this.$message({type:'error',duration:1200,message:'当前没有选择任何FM资源！'});
                    return false;
                }
                this.$confirm('确认删除选中的FM资源吗?', '提示', {
					type: 'warning'
                }).then(() => {
                    let str = '';
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        str += this.multipleSelection[i].mediaId +',';
                    }
                    this.deleteRequst(str);
                }).catch(() => {
                    console.log("出错!!")
                });

            },
            //删除请求 
            deleteRequst(arr) {
                let Params = { 'ids':arr}
                this.axios.post(`${FM_API}/removeFM`,Params,{ headers : Headers }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success") {
                        //刷新列表数据
                        let Params = {
                            "keyword": '',
                            "mediaType":'4'
                        };
                        this.getListData(Params);
                        this.pageInfo.page = 1;
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

            //关闭弹窗清除数据
            closeDialogEdit() {
                this.form1 = { //编辑表单
                    name:'',
                    channel:''
                };
               
                //关闭表单验证
                this.$refs['form1'].resetFields();
				
            },
            closeDialogAdd() {
                
                this.form2 = {  //新增表单
                    name:'',
                    channel:''
                };

                this.$refs['form2'].resetFields();
            },
            
            FMnameVerify(value) {  //校验名称
                let flag = true;
                let name = verify.mediaVerify(value);
                if(!name){
                    this.$message({type:'error',duration:1200,message:'名称格式错误'});
                    flag = false;
                    return flag;
                }
                return flag;
            },
            FMverify(value){  //校验频道取值
                let flag   = true;
                let number = Number(value);
                if(number%1 === 0){
                    number+='.0'
                }
                let fm  = verify.FMverify(number);
                if(!fm || number < 76.0 || number > 108.0){
                    this.$message({type:'error',message:'FM频道格式不正确,且范围在76.0~108.0之间！'});
                    flag = false;
                    return flag;
                }
                return flag;
            }
        }
    }
</script>

<style scoped>
    .el-main {
        height: 80vh;
        color: #333;
        padding: 0;
        overflow: none;
        border: 1px solid #D3DCE6;
    }
    .top{
        width: 100%;
        height: 10%;
        border-bottom: 1px solid #D3DCE6;
        padding-top: 5px;
    }
    .add-btn{
        margin-left: 10px;
        margin-top: 2px;
    }
    .top .el-input{
        width: auto;
        float: right;
        width: 150px;
        margin-right: 10px;
    }
    .select{
        width: 120px;
        margin-right: 10px;
        color: #409EFF;
        float: right;
    }
    .table{
        width: 100%;
        height: 80%;
        padding: 5px;
        text-align: center;
    }
    .table i.fa{
        font-size: 18px;
    }
    .bottom{
        width: 100%;
        height: 10%;
        border-top: 1px solid #D3DCE6;
    }
    .bottom .btn{
        margin-top: 5px;
        margin-right: 10px;
        float: right;
    }
    .selectSpan{
        float: left;
        margin-left: 10px;
        font-size: 14px;
        line-height: 50px;
    }
</style>