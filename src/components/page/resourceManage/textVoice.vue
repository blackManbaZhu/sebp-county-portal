<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="addMedia()"><i class="fa fa-plus-square"></i>&nbsp; 添加文本</el-button>
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
                        label="标题"
                        header-align="center"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="createUser"
                        label="创建人"
                        header-align="center"
                        width="180">
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
                            <el-button type="text" @click="lookDetail(scope.$index, scope.row)"><i style="font-size:16px;" class="fa fa-file-text-o"></i></el-button>
                            <el-button type="text" @click="editMedia(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
                            <el-button type="text" @click="deleteMedia(scope.$index, scope.row)"><i class="fa fa-trash-o"></i></el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination
                        style="margin-top:15px;float:right;"
                        background
                        v-if="pShow"
                        @current-change="handleCurrentChange"
                        layout="total, prev, pager, next, jumper"
                        :page-size="pageSize"
                        :current-page="pageInfo.page"
                        :total="pageInfo.total">
                    </el-pagination>
                </div>
                <div class="bottom">
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个文本</span>
                    <el-button type="primary" plain class="btn" @click="deleteSelect"><i class="fa fa-trash-o"></i> 删除选中文本</el-button>
                </div>
            </el-main>
        </el-container>



        <!-- 编辑音频弹窗 -->
        <el-dialog title="修改文本内容" :visible.sync="dialogFormVisible" @close="closeDialogEdit" :close-on-click-modal="false">
            <el-form :model="form1" :rules="rules" ref="form1" label-width="80px">
                <el-form-item label="文本标题" prop="title">
                    <el-input
                        style="margin-top:10px;"
                        placeholder="请输入标题"
                        v-model="form1.title"
                        :minlength="1"
                        :maxlength="30"
                        clearable>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit()">确 定</el-button>
            </div>
        </el-dialog>



        <!-- 新增文本弹窗 -->
        <el-dialog title="新增文本" :visible.sync="addFm" @close="closeDialogAdd" :close-on-click-modal="false">
            <div class="radio-tab">
                <el-radio v-model="radio" label="1">手动输入文本</el-radio>
                <el-radio v-model="radio" label="2">上传txt文档</el-radio>
            </div>
                <div v-if="radio == '1'">
                    <el-form :model="form2" :rules="rules" ref="form2" label-width="80px">
                        <el-form-item label="文本标题" prop="title">
                            <el-input
                                style="margin-top:10px;"
                                placeholder="请输入标题"
                                v-model="form2.title"
                                :minlength="1"
                                :maxlength="30"
                                clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="文本内容" prop="textarea" >
                            <el-input
                                class="area"
                                type="textarea"
                                :rows="7"
                                :maxlength="10000"
                                :minlength="1"
                                resize="none"
                                placeholder="请输入内容"
                                @input="inputTXT()"
                                v-model="form2.textarea">
                            </el-input>
                            <span class="spanBottom">剩余（{{spanBottom}}字）</span>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addFm = false">取 消</el-button>
                        <el-button type="primary" @click="saveAdd()">确 定</el-button>
                    </div>
                </div>
            <div>
                <div v-if="radio == '2'">
                            <el-upload
                            style="text-align: center;"
                            ref="upload"
                            :headers="headers"
                            :action="uploadUrl"
                            :before-upload="txtbeforeUpload"
                            :on-remove="onRemove"
                            :on-exceed="handleExceed"
                            :on-success="uploadSuccess"
                            :auto-upload="false"
                            :limit="1"
                            accept=".txt"
                            >
                            <el-button type="primary">本地上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传txt文件,文字内容应在10000个字以内</div>
                    </el-upload>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addFm = false">取 消</el-button>
                        <el-button type="success" @click="submitUpload">上 传</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        

        <!-- 查看详情 -->
        <el-dialog
          title="查看详情"
          :visible.sync="dialogVisible"
          width="50%"
          >
          <el-form :model="form3" label-width="100px">
             <el-form-item label="文本名称">
                <el-input disabled v-model="form3.mediaName"></el-input>
             </el-form-item>
             <el-form-item label="创建人">
                <el-input disabled v-model="form3.createUser"></el-input>
             </el-form-item>
             <el-form-item label="文本内容">
                <el-input disabled v-model="form3.mediaContext"></el-input>
             </el-form-item>
             <el-form-item label="创建时间">
                <el-input disabled v-model="form3.createTime"></el-input>
             </el-form-item>
          </el-form>
        </el-dialog>

    </div>
</template>

<script>
    import { verify , API, Headers , getTime ,trim ,allSrim,tokenMessage} from "../../../api/api.js";
    //获取数据
    let TX_API = `${API}/CountryResMgmt/media/v1`;
    //上传TXT
    let UP_API = `${API}/zuul/CountryResMgmt/media/v1`;
    export default {
        data() {
            return {
                tableList:[],
                inputSeach:'',
                editObj:'',  //编辑信息
                multipleSelection:[],
                //分页信息
                pShow:false,
                pageSize:10,
                pageInfo:{
                    total:0,
                    page: 1,
                },
                //编辑表单信息
                form1:{
                    channel:'',
                },
                //新增表单信息
                form2:{
                    channel:'',
                    textarea:''
                },
                //详情
                form3:{},
                rules:{
                    textarea:[
                        { required:true, message:'文本内容必填！'}
                    ],
                    title:[
                        { required:true, message:'文本标题必填！'}
                    ]
                },
                spanBottom:10000,
                radio:'1',
                addFm:false,
                dialogFormVisible:false,
                dialogVisible:false,
                uploadUrl:`${UP_API}/saveTxt`,
                headers: Headers
            }
        },
        created() {
            let Params = {
                "keyword": '',
                "mediaType":'3'
            }
            this.getListData(Params);
        },
        methods:{
            getListData(Params) {

                // let Params= {"keyword":keyword, 'pageNum':pageNum, "pageSize":pageSize,"mediaType":'3'};

                this.axios.post(`${TX_API}/findAllMedia`,Params,{ headers : Headers }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success"){
                        //获取数据
                        let data = res.data.payload;
                        this.tableList = data.list.map((value,index) =>{
                            value.createTime = getTime(value.createTime);
                            return value;
                        })

                        //总数
                        this.pageInfo.total = data.total; 

                        if( this.pageInfo.total > 10) {
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
                        message: '请求错误，请刷新页面！',
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
                    "mediaType":'3'
                }

                this.getListData(Params);
            },

            //搜索
            search() {
                this.pageInfo.page = 1;

                let keyWords = this.inputSeach ? allSrim(this.inputSeach) : '';

                var Params = {
                    "keyword":keyWords,
                    "mediaType":'3'
                }
            
                this.getListData(Params);
            },

            lookDetail(index,row) { 
                //查看详情列表
                let Params= {"mediaId":row.mediaId};
                this.axios.post(`${TX_API}/findWordsInfo`,Params,{ headers : Headers }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success"){
                        this.dialogVisible = true;
                        let data        = res.data.payload;
                        data.createTime = getTime(data.createTime);
                        this.form3  = data;
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
                        message: '请求错误，请刷新页面！',
                        type: 'warning'
                    });
                });
            },

            editMedia(index,row) {  
                //编辑
                this.form1.title = row.mediaName;
                this.editObj     = row;
                this.dialogFormVisible = true;
            },
            saveEdit() { 
                //保存编辑
                this.$refs['form1'].validate((valid) =>{
                    if(valid){
                        var name = this.titleVerify(this.form1.title);
                        if(!name){
                            return name;
                        }

                            let mediaName = trim(this.form1.title);
                            let mediaId   = this.editObj.mediaId;


                            let Params= {"mediaName":mediaName, "mediaId":mediaId};

                            this.axios.post(`${TX_API}/modifyWords`,Params,{ headers : Headers }).then(res => {
                                // console.log(res.data);
                                if(res.data.code == "Success") {
                                    //刷新列表
                                    let Params = {
                                        "keyword":'',
                                        "mediaType":'3'
                                    }
                                    this.getListData(Params);

                                    this.$message({type:'success',duration:1200,message:'编辑成功!'});

                                    this.dialogFormVisible = false;

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

            inputTXT(){
                this.spanBottom = 10000 - this.form2.textarea.length;
            },

            addMedia() {  
                //新增
                this.addFm = true;
            }, 
            saveAdd() { 
                //保存新增
                this.$refs['form2'].validate((valid) =>{
                    if(valid){
                        var name = this.titleVerify(this.form2.title);
                        if(!name){
                            return name;
                        }    
                        if(this.radio == '1'){

                            let mediaName = trim(this.form2.title);
                            let mediaContext = trim(this.form2.textarea);

                            let Params= {"mediaName":mediaName,"mediaContext":mediaContext};


                            this.axios.post(`${TX_API}/saveWords`,Params,{ headers : Headers }).then(res => {
                                // console.log(res.data);
                               
                                if(res.data.code == "Success") {
                                     //刷新列表
                                    let Params = {
                                        "keyword":'',
                                        "mediaType":'3'
                                    }
                                    this.getListData(Params);
                                    
                                    this.$message({type:'success',duration:1200,message:'保存成功!'});

                                    this.addFm = false;
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
                        }else if(this.radio == '2'){
                            this.addFm = false;
                            //清除上传列表
                            this.$refs.upload.clearFiles();
                        }
                    }else{
                        return false;
                    }
                })
            },
            //选择TXT文档具体操作
            txtbeforeUpload(file) { //上传之前
                this.fileType = file.name.split('.')[1];
                if(this.fileType != 'txt' ){
                    this.$message.error(`添加失败！当前文件格式不正确!`);
                    this.fileType = '';
                    return false;
                }
            },
            handleExceed(files, fileList) { //限制个数
                this.$message.warning(`当前限制选择1个文件`);
            },
            onRemove() { //移除选中文件时
                this.fileType = '';
            },
            uploadSuccess(res) { //上传成功
                if(res.code == "Success"){
                    //刷新列表
                    let Params = {
                        "keyword":'',
                        "mediaType":'3'
                    }
                    this.getListData(Params);

                    this.$message({type:'success',duration:1200,message:'上传成功!'});
                    //关闭弹窗
                    this.addFm = false;
                }else{
                    this.$message({type:'error', message: res.message});
                }
                //返回文本输入
                this.radio = '1';
                //清除上传列表
                this.$refs.upload.clearFiles();
            },
            submitUpload() { //点击上传
                this.$refs.upload.submit();
            },

            handleSelectionChange(val) {
                //选中条数
                this.multipleSelection = val;
            },

            deleteMedia(index,row) { 
                //删除单个
                this.$confirm('确认删除该文本资源吗?', '提示', {
					type: 'warning'
                }).then(() => {
                    this.deleteRequst(row.mediaId);
                }).catch(() => {
                    console.log("出错!!")
                });
            },
            deleteSelect() {
                //批量删除
                if(!this.multipleSelection.length){
                    this.$message({type:'error',duration:1200,message:'当前没有选择任何文本资源！'});
                    return false;
                }
                this.$confirm('确认删除选中的文本资源吗?', '提示', {
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
                this.axios.post(`${TX_API}/removeWords`,Params,{ headers : Headers }).then(res => {
                    if(res.data.code == "Success") {
                        //刷新列表
                        let Params = {
                            "keyword":'',
                            "mediaType":'3'
                        }
                        this.getListData(Params);

                        this.handleCurrentChange(1);

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
            closeDialogAdd() {

                //新增表单信息
                this.form2 = {
                    channel:'',
                    textarea:''
                }

                if(this.radio == '2') {
                    //清除上传列表
                    this.$refs.upload.clearFiles();

                    //返回文本输入
                    this.radio = '1';
                }

                //关闭表单验证
				this.$refs['form2'].resetFields();
            },

            closeDialogEdit() {

                //编辑表单信息
                this.form1 = {
                    channel:'',
                }

                this.$refs['form1'].resetFields();

            },
            
            titleVerify(value) {
                let flag = true;
                let name = verify.mediaVerify(value);
                if(!name){
                    this.$message({type:'error',duration:1200,message:'名称格式错误'});
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
    .radio-tab{
        line-height: 30px;
        text-align: center;
        margin-bottom: 15px;
    }
    .dialog-footer{
        text-align: center;
    }
    .spanBottom{
        position: absolute;
        right: 5px;
        bottom: -5px;
        color: #606266;
        font-size: 12px;
    }
</style>