<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="addMedia()"><i class="fa fa-plus-square"></i>&nbsp; 添加FM频道</el-button>
                    <el-input
                        placeholder="请输入名称搜索"
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
                        label="FM名称"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="channel"
                        label="FM频道"
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
                            <!-- <el-button type="text"><i class="fa fa-play-circle"></i></el-button> -->
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
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个FM</span>
                    <el-button type="primary" plain class="btn" @click="deleteSelect()"><i class="fa fa-trash-o"></i> 删除选中FM</el-button>
                </div>
            </el-main>
        </el-container>
        <!-- 编辑音频弹窗 -->
        <el-dialog title="修改FM频道" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form :model="form1" :rules="rules" ref="form1">
                <el-form-item label="FM名称" :label-width="formLabelWidth" prop="name">
                 <el-input v-model="form1.name" auto-complete="off" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="FM频道" :label-width="formLabelWidth" prop="channel">
                 <el-input v-model="form1.channel" auto-complete="off" placeholder="76.0~108.0"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增音频弹窗 -->
        <el-dialog title="新增FM频道" :visible.sync="addFm" :close-on-click-modal="false">
            <el-form :model="form2" :rules="rules" ref="form2">
                <el-form-item label="FM名称" :label-width="formLabelWidth" prop="name">
                 <el-input v-model="form2.name" auto-complete="off" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="FM频道" :label-width="formLabelWidth" prop="channel">
                 <el-input v-model="form2.channel" auto-complete="off" placeholder="76.0~108.0"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFm = false">取 消</el-button>
                <el-button type="primary" @click="addFm = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import addVideo from "./Dialog/addVideo.vue"
    let data = [
        {
            name:'123',
            channel:'76.0',
            creator:'xx-xx',
            createTime:'2018-04-12 12:10:56'
        },
        {
            name:'456',
            channel:'76.1',
            creator:'xx-xx',
            createTime:'2018-04-12 12:10:56'
        }
    ];
    export default {
        components:{
            addVideo
        },
        data() {
            return {
                addFm:false,
                dialogFormVisible:false,
                formLabelWidth:'80px',
                tableList:data,
                inputSeach:'',
                selectValue1:'',
                showAdd:false,
                multipleSelection:[],
                pageInfo:{
                    total:100,
                    currentPage: 10,
                },
                form1:{
                    name:'',
                    channel:''
                },
                form2:{
                    name:'',
                    channel:''
                },
                rules:{
                    channel:[
                        { required:true, message:'FM频道必填！',trigger:'blur'}
                    ],
                    name:[
                        { required:true, message:'FM名称必填！',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
            },
            handleCurrentChange(val) {

            },
            editMedia(index,row) {
                this.form1.channel = row.channel;
                this.form1.name    = row.name;
                this.dialogFormVisible = true;
            },
            addMedia() {
                this.addFm = true;
            },
            deleteMedia(index,row) { //删除单个
                this.$confirm('确认删除该FM资源吗?', '提示', {
					type: 'warning'
                }).then(() => {

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

                }).catch(() => {
                    console.log("出错!!")
                });

            },
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