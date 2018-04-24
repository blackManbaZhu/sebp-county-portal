<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="addTasks"><i class="fa fa-plus-square"></i>&nbsp; 添加任务</el-button>
                    <el-input
                        placeholder="请输入名称搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSeach"
                        @keyup.enter.native="search()">
                    </el-input>
                    <!-- <el-select v-model="selectValue1" placeholder="是否循环" class="select">
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
                        prop="taskName"
                        label="任务名称"
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
                        label="创建时间"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="taskType"
                        header-align="center"
                        label="任务类型">
                        </el-table-column>
                        <el-table-column
                        prop="isCycle"
                        header-align="center"
                        label="是否循环">
                        </el-table-column>
                        <el-table-column
                        prop="startTime"
                        header-align="center"
                        label="开始日期">
                        </el-table-column>
                        <el-table-column
                        prop="endTime"
                        header-align="center"
                        label="结束日期">
                        </el-table-column>
                        <el-table-column
                        prop="playBeginTime"
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
                            <el-button 
                            v-if="scope.row.taskType == '音频任务' 
                            || scope.row.taskType == '视频任务' || scope.row.taskType == '网络电台任务'" 
                            type="text" @click="play(scope.$index, scope.row)"><i class="fa fa-play-circle"></i></el-button>
                            <el-button type="text" @click="lookDetail(scope.$index, scope.row)"><i style="font-size:16px;" class="fa fa-file-text-o"></i></el-button>
                            <el-button type="text" @click="deleteTime(scope.$index, scope.row)"><i class="fa fa-trash-o"></i></el-button>
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
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个任务</span>
                    <el-button type="primary" plain class="btn" @click="deleteSelect()"><i class="fa fa-trash-o"></i> 删除选中任务</el-button>
                </div>
            </el-main>
        </el-container>


        <!-- 音频试听 -->
        <el-dialog 
            title="定时任务试听" 
            :visible.sync="playMedia" 
            @close="closePlay"  
            :close-on-click-modal="false">
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

        <!-- 网络电台试听 -->
        <el-dialog title="网络电台试听" :visible.sync="playInternetRadio" @close="closePlayInternetRadio"  :close-on-click-modal="false">
                <p>请先允许flash插件在浏览器上运行</p>
                <a 
                    href="#"
                    style="display:block;width:100%;height:330px;font-size:20px;"  
                    id="player"> 
                    点击播放
                </a>
        </el-dialog>

        <!-- 查看详情 -->
        <el-dialog
          title="查看详情"
          :visible.sync="dialogVisible"
          width="50%"
          >
          <ul class="ul-content">
              <li>
                <label>任务名称:</label><span>{{form.taskName}}</span>
              </li>
              <li>
                <label>任务描述:</label><span class="txt-cont">{{form.taskDesc ? form.taskDesc : '暂无描述' }}</span>
              </li>
              <li>
                <label>创建人:</label><span>{{form.createUser}}</span>
              </li>
              <li>
                <label>任务类型:</label><span>{{form.createUser}}</span>
              </li>
              <li v-if="form.taskType == '音频任务'">
                <label>音频名称:</label><span>{{form.mediaName}}</span>
              </li>
              <li v-if="form.taskType == 'FM任务'">
                <label>FM名称:</label><span>{{form.mediaName}}</span>
              </li>
              <li v-if="form.taskType == '文本任务'">
                <label>文本标题:</label><span>{{form.mediaName}}</span>
              </li>
              <li v-if="form.taskType == '网络电台任务'">
                <label>网络电台名称:</label><span>{{form.mediaName}}</span>
              </li>
              <li v-if="form.taskType == '网络电台任务'">
                <label>网络电台地址:</label><span>{{form.mediaContext}}</span>
              </li>
              <li v-if="form.taskType == '文本任务'">
                <label>文本内容:</label><span class="txt-cont">{{form.mediaContext}}</span>
              </li>
              <li v-if="form.taskType == 'FM任务'">
                <label>FM频道:</label><span>{{form.mediaContext}}</span>
              </li>
              <li>
                <label>是否循环:</label><span>{{form.isCycle}}</span>
              </li>
              <li>
                <label>开始日期:</label><span>{{form.startTime}}</span>
              </li>
              <li>
                <label>结束日期:</label><span>{{form.endTime}}</span>
              </li>
              <li>
                <label>播放开始时间:</label><span>{{form.playBeginTime}}</span>
              </li>
              <li>
                <label>播放结束时间:</label><span>{{form.playEndTime}}</span>
              </li>
          </ul>
        </el-dialog>

        <add-task :addTask="showAdd" @getList="getListData"  @close="closeAdd"></add-task>
    </div>
</template>

<script>
    import addTask from "./Dialog/addTask.vue";
    import { verify , API, Headers , getTime ,trim ,allSrim,tokenMessage} from "../../../api/api.js";
    //获取数据
    let TX_API = `${API}/CountryResMgmt/media/v1`;
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
                tableList:[],
                inputSeach:'',
                selectValue1:'',
                selectValue2:'',
                multipleSelection:[],
                //分页
                pShow:false,
                pageSize:10,
                pageInfo:{
                    total:0,
                    page: 1,
                },
                //任务详情信息
                form:{},
                showAdd:false,
                playMedia:false,
                dialogVisible:false,
                playInternetRadio:false
            }
        },
        created() {
            let Params = {
                "keyword": '',
            }
            this.getListData(Params);
        },
        methods:{
            getListData(Params) { //获取数据列表

                // let Params= {"keyword":keyword, 'pageNum':pageNum, "pageSize":pageSize};

                this.axios.post(`${TX_API}/findAllTaskInfo`,Params,{ headers : Headers }).then(res => { 
                    if(res.data.code == "Success"){
                        let data = res.data.payload;
                        //获取数据
                        this.tableList = data.list.map((value,index) =>{
                            value.createTime= getTime(value.createTime);
                            value.startTime = getTime(value.startTime).split(' ')[0];
                            value.endTime   = getTime(value.endTime).split(' ')[0];
                            value.isCycle   = value.isCycle == '1' ? '循环' : '不循环';
                            value.taskType  = value.taskType =='1' ? '音频任务':value.taskType =='2' ? '视频任务':value.taskType =='3' ? '文本任务'
                            : value.taskType =='4' ? 'FM任务':value.taskType =='5' ? '网络电台任务' : value.taskType =='6' ? '录音任务':'';
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
                        message: '请求出错，请刷新页面！',
                        type: 'warning'
                    });
                });
            },
            
            handleCurrentChange(page) {
                //点击分页
                let keyword = this.inputSeach ? allSrim(this.inputSeach) : '';

                var  Params = {
                    "keyword": keyword,
                    "pageNum":page
                }

                this.getListData(Params);
            },

            //搜索
            search() {
                this.pageInfo.page = 1;

                let keyWords = this.inputSeach ? allSrim(this.inputSeach) : '';

                var Params = {
                    "keyword":keyWords,
                }
            
                this.getListData(Params);
            },



            addTasks() {
                this.showAdd = true;
            },
            closeAdd() {
                this.showAdd = false;
                //刷新数据
                let Params = {
                    "keyword":'',
                }
            
                this.getListData(Params);
            },

            lookDetail(index,row) { //查看定时任务详情
                let Params= {"taskId":row.taskId,};
                this.axios.post(`${TX_API}/findTaskInfo`,Params,{ headers : Headers }).then(res => { 
                    if(res.data.code == "Success"){
                        this.dialogVisible = true;
                        let data = res.data.payload;
                        data.startTime = getTime(data.startTime).split(' ')[0];
                        data.endTime   = getTime(data.endTime).split(' ')[0];
                        data.isCycle   = data.isCycle == '1' ? '循环' : '不循环';
                        data.taskType  = data.taskType =='1' ? '音频任务':data.taskType =='2' ? '视频任务':data.taskType =='3' ? '文本任务': data.taskType =='4' ? 'FM任务':data.taskType =='5' ? '网络电台任务' : data.taskType =='6' ? '录音任务':'';
                        this.form = data;
                        console.log(data)
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
                        message:'请求出错，请刷新页面！',
                        type: 'warning'
                    });
                });
            },
            

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            deleteTime(index ,row) { //单个资源删除
                this.$confirm('确认删除该定时任务吗?', '提示', {
					type: 'warning'
                }).then(() => {
                    this.deleteRequst(row.taskId);
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
                    let str = '';
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        str += this.multipleSelection[i].taskId +',';
                    }
                    this.deleteRequst(str);
                }).catch(() => {
                    console.log("出错!!")
                });
            },
            //删除请求 
            deleteRequst(arr) {
                let Params = { 'ids':arr}
                this.axios.post(`${TX_API}/removeTask`,Params,{ headers : Headers }).then(res => {
                    
                    if(res.data.code == "Success") {
                        //刷新数据
                        let Params = {
                            "keyword":'',
                        }
                    
                        this.getListData(Params);;

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
            
            play(index,row) {
                console.log(row);
                var _this      = this;
                let T;
                if(row.taskType == '音频任务'){
                    this.playMedia = true;
                    T = setTimeout(() => {
                        var setConfig = {
                            song : [
                                {
                                    title : row.mediaName,
                                    src : row.mediaContent,
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
                }
                if(row.taskType == '网络电台任务'){
                    this.playInternetRadio = true;
                    T=setTimeout(() => {
                        flowplayer("player", "./static/js/flowplayer-3.2.8.swf",{ 
                            clip: { 
                                url: 'hks',
                                provider: 'rtmp',
                                live: true, 
                            },  
                            plugins: {  
                                rtmp: {  
                                    url: './static/js/flowplayer.rtmp-3.2.8.swf',  
                                    netConnectionUrl: 'rtmp://live.hkstv.hk.lxdns.com/live'
                                } 
                            } 
                        });
                    },0);
                };
            },
            closePlay(){ 
                //关闭音频试听
                var audioFn    = audioPlay({});
                audioFn.loadFile(false);
                this.playMedia = false;
            },
            closePlayInternetRadio() { 
                //关闭网络电台试听

            }
        }
    }
</script>

<style scoped>
    .ul-content{
        width: 100%;
        display: inline-table;
    }
    .ul-content li{
        float: left;
        margin-top: 20px;
        width: 50%;
        line-height: 40px;
        font-size: 15px;
    }
    .ul-content li label{
        padding-left: 15px;
        width: 30%;
        height: 35px;
        float: left;
    }
    .ul-content li span{
        padding-left: 20px;
        float: left;
        display: inline-block;
        width: 70%;
        background-color: #f5f7fa;
        border-color: #e4e7ed;
    }
    .ul-content .txt-cont{
        height: 40px;
        overflow: auto;
        word-wrap: break-word;
    }
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