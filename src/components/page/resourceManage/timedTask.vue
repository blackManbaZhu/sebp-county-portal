<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="addTasks"><i class="fa fa-plus-square"></i>&nbsp; 添加任务</el-button>
                    <el-input
                        placeholder="请输入名称搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSeach">
                    </el-input>
                    <el-select v-model="selectValue1" placeholder="是否循环" class="select">
                        <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="selectValue2" placeholder="任务类型" class="select">
                        <el-option
                        v-for="item in options2"
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
                        label="任务名称"
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
                        prop="taskType"
                        header-align="center"
                        label="任务类型">
                        </el-table-column>
                        <el-table-column
                        prop="useLoop"
                        header-align="center"
                        label="是否循环">
                        </el-table-column>
                        <el-table-column
                        prop="startTime"
                        header-align="center"
                        label="开始时间">
                        </el-table-column>
                        <el-table-column
                        prop="endTime"
                        header-align="center"
                        label="结束时间">
                        </el-table-column>
                        <el-table-column
                        prop="playStartTime"
                        header-align="center"
                        label="播放开始时间">
                        </el-table-column>
                        <el-table-column
                        prop="playEndTime"
                        header-align="center"
                        label="播放结束时间">
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button type="text" @click="play(scope.$index, scope.row)"><i class="fa fa-play-circle"></i></el-button>
                            <el-button type="text" @click="deleteTime(scope.$index, scope.row)"><i class="fa fa-trash-o"></i></el-button>
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
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个任务</span>
                    <el-button type="primary" plain class="btn" @click="deleteSelect()"><i class="fa fa-trash-o"></i> 删除选中任务</el-button>
                </div>
            </el-main>
        </el-container>
        <!-- 试听 -->
        <el-dialog title="定时任务试听" :visible.sync="playMedia" @close="closePlay"  :close-on-click-modal="false">
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
        <add-task :addTask="showAdd" @close="closeAdd"></add-task>
    </div>
</template>

<script>
    import addTask from "./Dialog/addTask.vue";
    let data = [
        {
            name:'定时任务1',
            creator:'xx-xx',
            taskType:'普通类型',
            useLoop:'循环',
            startTime:'2018-03-26',
            endTime:'2018-03-26',
            playStartTime:'14:00:00',
            playEndTime:'17:00:00'
        }
    ];
    let option1 = [
        {
            value:'全部',
            lable:'0'
        },
        {
            value:'循环',
            lable:'1'
        },
        {
            value:'不循环',
            lable:'2'
        }
    ];
    let option2 = [
        {
            value:'全部',
            lable:'0'
        },
        {
            value:'FM定时任务',
            lable:'1'
        },
        {
            value:'普通音频任务',
            lable:'2'
        },
        {
            value:'文本定时任务',
            lable:'3'
        }
        ,
        {
            value:'普通视频任务',
            lable:'4'
        }
    ];
    export default {
        components:{addTask},
        data() {
            return {
                options1:option1,
                options2:option2,
                tableList:data,
                inputSeach:'',
                selectValue1:'',
                selectValue2:'',
                showAdd:false,
                playMedia:false,
                multipleSelection:[],
                pageInfo:{
                    total:100,
                    currentPage: 10,
                }
            }
        },
        methods:{
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val) {

            },
            handleClick(index,row) {
            
            },
            deleteTime(index ,row) { //单个资源删除
                this.$confirm('确认删除该定时任务吗?', '提示', {
					type: 'warning'
                }).then(() => {

                }).catch(() => {
                    console.log("出错!!")
                });
            },
            deleteSelect() { //删除选中文件
                if(!this.multipleSelection.length){
                    this.$message({type:'error',duration:1200,message:'当前没有选择任何定时任务资源！'});
                    return false;
                }
                this.$confirm('确认删除选中的定时任务吗?', '提示', {
					type: 'warning'
                }).then(() => {

                }).catch(() => {
                    console.log("出错!!")
                });
            },
            addTasks() {
                this.showAdd = true;
            },
            closeAdd() {
                this.showAdd = false;
            },
            play(index,row) {
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
    .el-input{
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