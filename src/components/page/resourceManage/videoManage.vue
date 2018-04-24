<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="addMedia()"><i class="fa fa-plus-square"></i>&nbsp; 添加视频</el-button>
                    <el-input
                        placeholder="请输入名称搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSeach">
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
                            <el-button type="text"><i class="fa fa-play-circle"></i></el-button>
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
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个视频</span>
                    <el-button type="primary" plain class="btn" @click="deleteSelect"><i class="fa fa-trash-o"></i> 删除选中视频</el-button>
                </div>
            </el-main>
        </el-container>
        <!-- 编辑音频弹窗 -->
        <el-dialog title="修改视频名称" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="文件名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增视频弹窗 -->
        <add-video :addMedia="showAdd" @close="closeAdd"></add-video>
    </div>
</template>

<script>
    import addVideo from "./Dialog/addVideo.vue";
    import { verify } from "../../../api/api.js";
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
        }
    ];
    export default {
        components:{
            addVideo
        },
        data() {
            return {
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
                console.log(val)
            },
            handleCurrentChange(val) {

            },
            editMedia(index,row) { //编辑名称
                this.form.name = row.name;
                this.dialogFormVisible = true;
            },
            saveEdit() { //保存名称编辑
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
            addMedia() {
                this.showAdd = true;
            },
            closeAdd() {
                this.showAdd = false;
            },
            deleteMedia(index, row) { //删除单个
                 this.$confirm('确认删除该视频资源吗?', '提示', {
					type: 'warning'
                }).then(() => {

                }).catch(() => {
                    console.log("出错!!")
                });
            },
            deleteSelect() {
                if(!this.multipleSelection.length){
                    this.$message({type:'error',duration:1200,message:'当前没有选择任何视频资源！'});
                    return false;
                }
                this.$confirm('确认删除选中的视频资源吗?', '提示', {
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