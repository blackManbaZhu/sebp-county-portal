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
                        v-model="inputSeach">
                    </el-input>
                    <el-select v-model="selectValue1" placeholder="音频类型" class="select">
                        <el-option
                        v-for="item in options1"
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
                        prop="name"
                        label="名称"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="creator"
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
                        style="margin-top:15px;float:right;"
                        background
                        @current-change="handleCurrentChange"
                        :page-size="pageInfo.currentPage"
                        layout="total, prev, pager, next, jumper"
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
        <el-dialog width="80%" title="修改音频名称" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="文件名称" :label-width="formLabelWidth" prop="name">
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
    import { verify } from "../../../api/api.js";
    import addMedia from "./Dialog/addMedia.vue";
    let data = [
        {
            name:'雨蝶.mp3',
            creator:'xx-xx',
            createTime:'2018-04-12 12:10:56'
        },
        {
            name:'雨蝶.mp3',
            creator:'xx-xx',
            createTime:'2018-04-12 12:10:56'
        },
        {
            name:'雨蝶.mp3',
            creator:'xx-xx',
            createTime:'2018-04-12 12:10:56'
        },
        {
            name:'雨蝶.mp3',
            creator:'xx-xx',
            createTime:'2018-04-12 12:10:56'
        }
    ]
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
                dialogFormVisible:false,
                playMedia:false,
                formLabelWidth:'80px',
                options1:options,
                tableList:data,
                inputSeach:'',
                selectValue1:'',
                playAudio:'',
                showAdd:false,
                multipleSelection:[],
                pageInfo:{
                    total:100,
                    currentPage: 10,
                },
                form:{
                    name:''
                },
                rules:{
                    name:[
                        { required:true, message:'文件名称必填！',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val) {

            },
            editMedia(index,row) { //编辑名称
                this.form.name = row.name;
                this.dialogFormVisible = true;
            },
            saveEdit() { //保存编辑
                this.$refs['form'].validate((valid) =>{
                    if(valid){
                        let name = verify.mediaVerify(this.form.name);
                        if(!name){
                            this.$message({type:'error',duration:1200,message:'名称格式错误'});
                            return false;
                        }
                        this.dialogFormVisible = false;
                        this.$message({type:'success',duration:1200,message:'保存成功!'});
                    }else{
                        return false;
                    }
                })
            },
            deleteMedia(index,row) { //删除单个
                this.$confirm('确认删除该音频资源吗?', '提示', {
					type: 'warning'
                }).then(() => {

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

                }).catch(() => {
                    console.log("出错!!")
                });

            },
            addMedia() {
                this.showAdd = true;
            },
            closeAdd() {
                this.showAdd = false;
            },
            play(index,row) { //试听
                this.playMedia = true;
                let T;
                T = setTimeout(() => {
                    var setConfig = {
                        song : [
                            // {
                            //     title : 'china',
                            //     src : 'http://jq22com.qiniudn.com/jq22m1.mp3',
                            //     cover : 'images/001.png'
                            // },
                            {
                                title : '如风过境',
                                src : 'http://jq22.qiniudn.com/2_01.mp3',
                                cover : 'images/002.png'
                            },
                            // {
                            //     title:'Goldfrapp',
                            //     src:'http://www.jq22.com/demo/jquery-mis-150323220305/Media/Transformers2.mp3'
                            // }
                        ],
                        error : function(meg){
                            console.log(meg);
                            // alert("播放错误！请重新播放")
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
        height: 620px;
        color: #333;
        padding: 0;
        overflow: none;
        border: 1px solid #D3DCE6;
    }
    .top{
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #D3DCE6;
        padding-top: 5px;
    }
    .add-btn{
        margin-left: 10px;
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
        height: 516px;
        padding: 5px;
        text-align: center;
    }
    .table i.fa{
        font-size: 18px;
    }
    .bottom{
        width: 100%;
        height: 50px;
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