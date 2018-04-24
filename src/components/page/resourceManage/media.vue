<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="addMedia()">
                        <i class="fa fa-plus-square"></i>&nbsp; 添加音频</el-button>
                    <el-input
                        placeholder="请输入名称搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSeach"
                        @keyup.enter.native="search()">
                    </el-input>
                    <!-- <el-select v-model="selectValue1" placeholder="音频类型" class="select">
                        <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select> -->
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
                        label="名称"
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
                            <el-button type="text" @click="play(scope.$index, scope.row)"><i class="fa fa-play-circle"></i></el-button>
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
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个音频</span>
                    <el-button type="primary" plain class="btn" @click="deleteSelect()"><i class="fa fa-trash-o"></i> 删除选中音频</el-button>
                </div>
            </el-main>
        </el-container>
        <!-- 编辑音频弹窗 -->
        <el-dialog width="50%" title="修改音频名称" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px">
                <el-form-item label="文件名称" prop="name">
                <el-input :maxlength="30" v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">保 存</el-button>
            </div>
        </el-dialog>
        <!-- 试听 -->
        <el-dialog title="音频试听" :visible.sync="playMedia" @close="closePlay"  :close-on-click-modal="false">
            <div class="audio-box">
                <div class="audio-container">
                    <div class="audio-view">
                        <div class="audio-cover"></div>
                        <div class="audio-body">
                            <h3 class="audio-title">未知歌曲</h3>
                            <div class="audio-backs">
                                <div class="audio-this-time">00:00</div>
                                <div class="audio-count-time">00:00</div>
                                <div class="audio-setbacks">
                                    <i class="audio-this-setbacks">
                                        <span class="audio-backs-btn"></span>
                                    </i>
                                    <span class="audio-cache-setbacks">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="audio-btn">
                            <div class="audio-select">
                                <!-- <div action="prev" class="fa fa-fast-backward"></div> -->
                                <!-- <div action="stop" class="fa fa-stop"></div> -->
                                <div action="play" data-on="fa fa-play" data-off="fa fa-pause" class="fa fa-play"></div>
                                <!-- <div action="next" class="fa fa-fast-forward"></div> -->
                                <!--<div action="menu" class="fa fa-list-alt"></div>-->
                                <div action="volume" class="fa fa-volume-up">
                                    <div class="audio-set-volume">
                                        <div class="volume-box">
                                            <i><span  class="audio-backs-btn"></span></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
	        </div>
        </el-dialog>
        <!-- 新增音频弹窗 -->
        <add-media :addMedia="showAdd" @close="closeAdd"></add-media>
    </div>
</template>

<script>
    import { verify , API , Headers , getTime , trim , allSrim , tokenMessage} from "../../../api/api.js";
    import addMedia from "./Dialog/addMedia.vue";
    // let TransactionID = Transaction();
    // //获取token 用户信息
    // let token  = localStorage.getItem('token');
    // let userId = localStorage.getItem('userId');
    // let orgId  = localStorage.getItem('orgId');
    //获取数据
    let TX_API        = `${API}/CountryResMgmt/media/v1`;
    let options = [
            {
                value:'全部音频',
                lable:'0'
            },
            {
                value:'录音音频',
                lable:'1'
            },
            {
                value:'上传音频',
                lable:'2'
            }
        ]
    export default {
        components:{
            addMedia
        },
        data() {
            return {
                options1:options,
                //列表数据
                tableList:[],
                inputSeach:'',
                selectValue1:'',
                playAudio:'',
                editObj:'',
                multipleSelection:[],
                //是否显示分页
                pShow:false, 
                //分页信息
                pageSize:10,
                pageInfo:{
                    total:0,
                    page: 1,
                },
                form:{
                    name:''
                },
                rules:{
                    name:[
                        { required:true, message:'文件名称必填！'}
                    ]
                },
                //弹窗
                dialogFormVisible:false,
                playMedia:false,
                showAdd:false,
            }
        },
        created() {
            let Params = {
                "keyword": '',
                "mediaType":'1'
            }
            this.getListData(Params);
        },
        methods:{
            getListData(Params) {

                // let Params= {"keyword":keyword, 'pageNum':pageNum, "pageSize":pageSize,"mediaType":'1'};

                this.axios.post(`${TX_API}/findAllMedia`,Params,{ headers : Headers }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success") {
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
                    "mediaType":'1'
                }

                this.getListData(Params);
            },

            //搜索
            search() {
                this.pageInfo.page = 1;

                let keyWords = this.inputSeach ? allSrim(this.inputSeach) : '';

                var Params = {
                    "keyword":keyWords,
                    "mediaType":'1'
                }
            
                this.getListData(Params);
            },

            editMedia(index,row) { 
                //编辑名称
                this.form.name = row.mediaName;
                this.editObj   = row;
                this.dialogFormVisible = true;
            },
            saveEdit() { 
                //保存编辑
                this.$refs['form'].validate((valid) =>{
                    if(valid){
                        let name = verify.mediaVerify(this.form.name);
                        if(!name){
                            this.$message({type:'error',duration:1200,message:'名称格式错误'});
                            return false;
                        }
                        let mediaName = trim(this.form.name);
                        let mediaId   = this.editObj.mediaId;

                        let Params= {"mediaName":mediaName, "mediaId":mediaId};

                        this.axios.post(`${TX_API}/modifyMusicName`,Params,{ headers : Headers }).then(res => {
                            if(res.data.code == "Success") {
                                //刷新列表
                                let Params = {
                                    "keyword":'',
                                    "mediaType":'1'
                                }
                                this.getListData(Params);

                                this.$message({type:'success',duration:1200,message:'编辑成功!'});

                                //关闭弹窗
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

            handleSelectionChange(val) {
                //选中列表条数
                this.multipleSelection = val;
            },
            deleteMedia(index,row) { //删除单个
                this.$confirm('确认删除该音频资源吗?', '提示', {
					type: 'warning'
                }).then(() => {
                    this.deleteRequst(row.mediaId);
                }).catch(() => {
                    console.log("出错!!")
                });
            },
            deleteSelect() {
                if(!this.multipleSelection.length){
                    this.$message({type:'error',duration:1200,message:'当前没有选择任何音频资源！'});
                    return false;
                }
                this.$confirm('确认删除选中的音频资源吗?', '提示', {
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
                this.axios.post(`${TX_API}/removeMusic`,Params,{ headers : Headers }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success") {
                        //刷新列表
                        let Params = {
                            "keyword":'',
                            "mediaType":'1'
                        }
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
            addMedia() {
                this.showAdd = true;
            },
            closeAdd() {
                this.showAdd = false;
                //刷新列表
                let Params = {
                    "keyword":'',
                    "mediaType":'1'
                }
                this.getListData(Params);
            },

            play(index,row) { //试听
                this.playMedia = true;
                var _this = this;
                console.log(row)
                let T;
                T = setTimeout(() => {
                    var setConfig = {
                        song : [
                            {
                                title : row.mediaName,
                                src : row.mediaFilePath,
                                cover : 'images/002.png'
                            },
                        ],
                        error : function(meg){
                            _this.playMedia = false;
                            _this.$message({
                                message: meg.meg,
                                type: 'warning'
                            });
                        }
                    };
                    var audioFn    = audioPlay(setConfig);
                    if(audioFn){
                        audioFn.loadFile(1);
                    }
                }, 0);
            },
            closePlay(){ //关闭试听
                var audioFn    = audioPlay({});
                audioFn.loadFile(false);
                this.playMedia = false;
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