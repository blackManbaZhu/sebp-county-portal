<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="addRadio()"><i class="fa fa-plus-square"></i>&nbsp; 添加电台</el-button>
                    <el-input
                        placeholder="输入名称或地址搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSeach"
                        @keyup.enter.native="search()"
                        >
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
                        label="名称"
                        header-align="center"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="mediaContext"
                        label="地址"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="createUser"
                        label="创建人"
                        header-align="center"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="createTime"
                        label="创建时间"
                        header-align="center"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button v-if="palyIf(scope.row)" type="text" @click="play(scope.row)"><i class="fa fa-play-circle"></i></el-button>
                            <el-button type="text" @click="handleClick(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
                            <el-button type="text" @click="deleteRadio(scope.$index, scope.row)"><i class="fa fa-trash-o"></i></el-button>
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
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个电台</span>
                    <el-button type="primary" plain class="btn" @click="deleteSelect"><i class="fa fa-trash-o"></i> 删除选中电台</el-button>
                </div>
            </el-main>
        </el-container>
        <!-- 弹窗 -->
        <el-dialog title="添加电台" :visible.sync="dialogFormVisible" @close="closeDialog" :close-on-click-modal="false">
            <el-form ref="form" :model="form1" label-width="80px" :rules="rules">
                <el-form-item label="电台名称" prop="name">
                    <el-input v-model="form1.name"></el-input>
                </el-form-item>
                <el-form-item label="电台地址" prop="address">
                    <el-input v-model="form1.address"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setUp">创 建</el-button>
            </div>
        </el-dialog>
        <!-- 弹窗 -->
        <el-dialog title="编辑网络电台" :visible.sync="dialogEditVisible" @close="closeDialog" :close-on-click-modal="false">
            <el-form ref="form" :model="form2" label-width="80px" :rules="rules">
                <el-form-item label="电台名称" prop="name">
                    <el-input :maxlength="30" v-model="form2.name"></el-input>
                </el-form-item>
                <el-form-item label="电台地址" prop="address">
                    <el-input v-model="form2.address"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </div>
        </el-dialog>

        
        <!-- 试听 -->
        <el-dialog title="网络电台试听" :visible.sync="playMedia" @close="closePlay"  :close-on-click-modal="false">
                <p>请先允许flash插件在浏览器上运行</p>
                <a 
                    href="#"
                    style="display:block;width:100%;height:330px;font-size:20px;"  
                    id="player"> 
                    点击播放
                </a>
        </el-dialog>
        
    </div>
</template>

<script>
    import { verify, API, Headers ,trim ,allSrim,getTime,tokenMessage} from "../../../api/api.js";
    //获取数据
    let NET_RADIO = `${API}/CountryResMgmt/media/v1`;
    export default {
        data() {
            return {
                tableList:[],  //列表
                inputSeach:'', //查询关键字
                multipleSelection:[], //选中
                editObj:'', //当前编辑对象
                pageSize:10, //当前页面显示多少条
                pShow:false, //是否显示分析
                pageInfo:{ //分页信息
                    total:0,
                    page: 1,
                },
                form1:{ //新增表单
                    name:'',
                    address:''
                },
                form2:{ //编辑表单
                    name:'',
                    address:''
                },
                rules:{ //验证
                    name:[
                        {required:true, message:'请输入电台名称'}
                    ],
                    address:[
                        {required:true, message:'请输入电台地址'}
                    ]
                },
                //弹窗
                dialogFormVisible:false,
                dialogEditVisible:false,
                playMedia:false,
            }
        },
        created() {
            let Params = {
                "keyword": '',
                "mediaType":'5'
            }
            this.getListData(Params);
        },
        methods:{
            getListData(Params) {

                // let Params= {"keyword":keyword, 'pageNum':pageNum, "pageSize":pageSize,"mediaType":'5'};

                this.axios.post(`${NET_RADIO}/findAllMedia`,Params,{ headers : Headers }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success") {
                        //获取数据
                        let data = res.data.payload;
                        this.tableList = data.list.map((value,index) =>{
                            value.createTime = getTime(value.createTime);
                            // value.mediaContext
                            return value;

                        });

                        //总条数
                        this.pageInfo.total = data.total; 
                        
                        if( this.pageInfo.total > 10){
                            this.pShow = true;
                        }

                        // console.log(this.tableList)
                        

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

            palyIf(row) {

                let start = row.mediaContext.slice(0,4);
                let last  = row.mediaContext.slice(row.mediaContext.length-4);
                
                if( start == 'http' && last == 'm3u8' ) {
                    return true; 
                }

                if( start == 'rtmp' ) {
                    return true; 
                }
            },
            
            handleCurrentChange(page) {
                //点击分页
                let keyword = this.inputSeach ? allSrim(this.inputSeach) : '';

                var  Params = {
                    "keyword": keyword,
                    "pageNum":page,
                    "mediaType":'5'
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

            
            ////////////////数据新增 编辑 删除 ///////////////

            addRadio() { //新增
                this.dialogFormVisible = true;
            },
            setUp() { //创建保存
                this.$refs['form'].validate((valid)=>{
                    if(valid) {
                        let name = verify.mediaVerify(this.form1.name);
                        let type = this.form1.address.split(':')[0];
                        if(type != 'mms' && type != 'hls' && type != 'http' && type != 'rtmp' && type != "rtsp"){
                            this.$message({type:'error',duration:1200,message:'地址格式错误，只能以mms、hls、http、rtmp、rtsp开头'});
                            return false;
                        }
                        if(this.form1.address.length > 500) {
                            this.$message({type:'error',duration:1200,message:'地址长度过长，限制最大500字符！'});
                            return false;
                        }
                        if(this.form1.name.length > 30) {
                            this.$message({type:'error',duration:1200,message:'名称长度过长，限制最大30字符！'});
                            return false;
                        }
                        if(!name){
                            this.$message({type:'error',duration:1200,message:'名称格式错误'});
                            return name;
                        }
                        let mediaName    = trim(this.form1.name);
                        let mediaContext = trim(this.form1.address);

                        let Params= {"mediaName":mediaName,"mediaContext":mediaContext,"mediaType":'5'};

                        this.axios.post(`${NET_RADIO}/saveNetworkRadio`,Params,{ headers : Headers }).then(res => {
                            // console.log(res.data);
                            if(res.data.code == "Success") {
                                //刷新列表
                                let Params = {
                                    "keyword":'',
                                    "mediaType":'5'
                                }
                                this.getListData(Params);

                                this.$message({type:'success',duration:1200,message:'添加成功！'});
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
                    }
                    else{
                        return false;
                    }
                })
            },

            handleClick(index,row) { //编辑
                this.dialogEditVisible = true;
                this.editObj       = row;
                this.form2.name    = row.mediaName;
                this.form2.address = row.mediaContext;
            },

            save(){ //保存编辑
                this.$refs['form'].validate((valid)=>{
                    if(valid) {
                        let name = verify.mediaVerify(this.form2.name);
                        let type = this.form2.address.split(':')[0];
                        if(type != 'mms' && type != 'hls' && type != 'http' && type != 'rtmp' && type != "rtsp"){
                            this.$message({type:'error',duration:1200,message:'地址格式错误，只能以mms、hls、http、rtmp、rtsp开头'});
                            return false;
                        }
                        if(!name){
                            this.$message({type:'error',duration:1200,message:'名称格式错误'});
                            return name;
                        }
                        if(this.form2.address.length > 500) {
                            this.$message({type:'error',duration:1200,message:'地址长度过长，限制最大500字符！'});
                            return false;
                        }
                        if(this.form2.name.length > 30) {
                            this.$message({type:'error',duration:1200,message:'名称长度过长，限制最大30字符！'});
                            return false;
                        }
                        let mediaName = trim(this.form2.name);
                        let mediaContext = trim(this.form2.address);
                        let mediaId      = this.editObj.mediaId;


                        let Params= {"mediaName":mediaName,"mediaContext":mediaContext,"mediaId":mediaId};

                        this.axios.post(`${NET_RADIO}/modifyNetworkRadioInfo`,Params,{ headers : Headers }).then(res => {
                            // console.log(res.data);

                            if(res.data.code == "Success") {
                                let Params = {
                                    "keyword":'',
                                    "mediaType":'5'
                                }
                                this.getListData(Params);

                                //关闭弹窗
                                this.dialogEditVisible = false;

                                this.$message({type:'success',duration:1200,message:'编辑成功！'});
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
                    }
                    else{
                        return false;
                    }
                })
            },
            
            handleSelectionChange(val) {
                //选中列表
                this.multipleSelection = val;
            },
            deleteRadio(index,row) { //删除单个电台
                this.$confirm('确认删除该电台资源吗?', '提示', {
					type: 'warning'
                }).then(() => {
                    this.deleteRequst(row.mediaId);
                }).catch(() => {
                    console.log("出错!!")
                });
            },
            deleteSelect() {
                if(!this.multipleSelection.length) {
                    this.$message({type:'error',duration:1200,message:'当前没有选择任何网络电台资源！'});
                    return false;
                }
                // console.log(this.multipleSelection)
                this.$confirm('确认删除选中的网络电台资源吗?', '提示', {
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
            deleteRequst(arr){
                let Params = { 'ids':arr}
                this.axios.post(`${NET_RADIO}/removeNetworkRadio`,Params,{ headers : Headers }).then(res => {
                    // console.log(res.data);
                    if(res.data.code == "Success") {
                        //刷新列表
                        let Params = {
                            "keyword":'',
                            "mediaType":'5'
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

            //关闭弹窗清除数据
            closeDialog() {
                this.form1 = { //新增表单
                    name:'',
                    address:''
                };
                this.form2 = { //编辑表单
                    name:'',
                    address:''
                };

                //关闭表单验证
                this.$refs['form'].resetFields();
            },


            play(row) { //网络电台试听播放
                this.playMedia = true;
                let T;
                console.log(row)
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
                                // netConnectionUrl: 'rtmp://live.hkstv.hk.lxdns.com/live'
                                netConnectionUrl:row.mediaContext
                            } 
                        } 
                    });
                },0);
            },
            //关闭试听窗口
            closePlay(){
                
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