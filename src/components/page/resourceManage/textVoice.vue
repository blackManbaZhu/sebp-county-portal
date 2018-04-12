<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="addMedia()"><i class="fa fa-plus-square"></i>&nbsp; 添加文本</el-button>
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
                        prop="title"
                        label="标题"
                        header-align="center"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="creator"
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
                            <!-- <el-button type="text"><i class="fa fa-play-circle"></i></el-button> -->
                            <el-button type="text" @click="editMedia(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
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
                    <span class="selectSpan">已选择<span>{{multipleSelection.length}}</span>个文本</span>
                    <el-button type="primary" plain class="btn"><i class="fa fa-trash-o"></i> 删除选中文本</el-button>
                </div>
            </el-main>
        </el-container>
        <!-- 编辑音频弹窗 -->
        <el-dialog title="修改文本内容" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form :model="form1" :rules="rules" ref="form1">
                <el-form-item label="文本内容" :label-width="formLabelWidth" prop="textarea">
                    <el-input
                        class="area"
                        type="textarea"
                        :rows="7"
                        :maxlength="4000"
                        :minlength="1"
                        resize="none"
                        placeholder="请输入内容"
                        v-model="form1.textarea">
                    </el-input>
                </el-form-item>
                <el-form-item label="文本内容" :label-width="formLabelWidth" prop="title">
                    <el-input
                        style="margin-top:10px;"
                        placeholder="请输入标题"
                        v-model="form1.title"
                        clearable>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增音频弹窗 -->
        <el-dialog title="新增文本" :visible.sync="addFm" :close-on-click-modal="false">
            <el-form :model="form2" :rules="rules" ref="form2">
                <el-form-item label="文本内容" :label-width="formLabelWidth" prop="textarea">
                    <el-input
                        class="area"
                        type="textarea"
                        :rows="7"
                        :maxlength="4000"
                        :minlength="1"
                        resize="none"
                        placeholder="请输入内容"
                        v-model="form2.textarea">
                    </el-input>
                </el-form-item>
                <el-form-item label="文本内容" :label-width="formLabelWidth" prop="title">
                    <el-input
                        style="margin-top:10px;"
                        placeholder="请输入标题"
                        v-model="form2.title"
                        clearable>
                    </el-input>
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
    let data = [
        {
            title:'标题111',
            creator:'xx-xx',
            createTime:'2018-04-12 12:10:56'
        },
        {
            title:'标题222',
            creator:'xx-xx',
            createTime:'2018-04-12 12:10:56'
        }
    ];
    export default {
        data() {
            return {
                addFm:false,
                dialogFormVisible:false,
                formLabelWidth:'80px',
                tableList:data,
                inputSeach:'',
                multipleSelection:[],
                pageInfo:{
                    total:100,
                    currentPage: 10,
                },
                form1:{
                    channel:''
                },
                form2:{
                    channel:''
                },
                rules:{
                    textarea:[
                        { required:true, message:'文本内容必填！',trigger:'blur'}
                    ],
                    title:[
                        { required:true, message:'文本标题必填！',trigger:'blur'}
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
                this.form1.title = row.title;
                this.dialogFormVisible = true;
            },
            addMedia() {
                this.addFm = true;
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