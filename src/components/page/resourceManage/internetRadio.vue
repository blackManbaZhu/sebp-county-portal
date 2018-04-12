<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="addRadio()"><i class="fa fa-plus-square"></i>&nbsp; 添加电台</el-button>
                    <el-input
                        placeholder="输入名称或地址搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSeach">
                    </el-input>
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
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="地址"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button type="text" @click="play(scope.$index, scope.row)"><i class="fa fa-play-circle"></i></el-button>
                            <el-button type="text" @click="handleClick(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
                            <el-button type="text"><i class="fa fa-trash-o"></i></el-button>
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
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个电台</span>
                    <el-button type="primary" plain class="btn"><i class="fa fa-trash-o"></i> 删除选中电台</el-button>
                </div>
            </el-main>
        </el-container>
        <!-- 弹窗 -->
        <el-dialog title="添加电台" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form ref="form" :model="form1" label-width="80px" :rules="rules" :status-icon="true">
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
        <el-dialog title="编辑网络电台" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
            <el-form ref="form" :model="form2" label-width="80px" :rules="rules" :status-icon="true">
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
                <a  
                    href="#"
                    style="display:block;width:100%;height:330px"  
                    id="player"> 
                </a>
        </el-dialog>
        
    </div>
</template>

<script>
    import { verify } from "../../../api/api.js";
    let data = [
        {
            name:'雨蝶.mp3',
            address:'http://www.baidu.com'
        },
        {
            name:'雨蝶.mp3',
            address:'http://www.baidu.com'
        },
        {
            name:'雨蝶.mp3',
            address:'http://www.baidu.com'
        }
    ]
    export default {
        data() {
            return {
                dialogFormVisible:false,
                dialogEditVisible:false,
                playMedia:false,
                tableList:data,
                inputSeach:'',
                selectValue1:'',
                multipleSelection:[],
                pageInfo:{
                    total:100,
                    currentPage: 10,
                },
                form1:{
                    name:'',
                    address:''
                },
                form2:{
                    name:'',
                    address:''
                },
                rules:{
                    name:[
                        {required:true, message:'请输入电台名称',trigger:'blur'}
                    ],
                    address:[
                        {required:true, message:'请输入电台地址', trigger:'blur'}
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
            handleClick(index,row) { //编辑
                this.dialogEditVisible = true;
                this.form2.name    = row.name;
                this.form2.address = row.address;
            },
            addRadio() {
                this.dialogFormVisible = true;
            },
            setUp() { //创建
                this.$refs['form'].validate((valid)=>{
                    if(valid) {
                        
                    }
                    else{
                        return false;
                    }
                })
            },
            save(){ //保存编辑
                this.$refs['form'].validate((valid)=>{
                    if(valid) {
                        
                    }
                    else{
                        return false;
                    }
                })
            },
            play() { //网络电台试听播放
                this.playMedia = true;
                let T;
                T=setTimeout(() => {
                    flowplayer("player", "../../../../static/js/flowplayer-3.2.8.swf",{ 
                        clip: { 
                            url: 'hks',
                            provider: 'rtmp',
                            live: true, 
                        },  
                        plugins: {  
                            rtmp: {  
                                url: '../../../../static/js/flowplayer.rtmp-3.2.8.swf',  
                                netConnectionUrl: 'rtmp://live.hkstv.hk.lxdns.com/live'
                            } 
                        } 
                    });
                },0);
            },
            closePlay(){
                
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
        width: 200px;
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