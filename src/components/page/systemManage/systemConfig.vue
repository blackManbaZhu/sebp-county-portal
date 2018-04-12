<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
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
                        label="序号"
                        header-align="center">
                            <template slot-scope="scope">
                                <span>{{scope.$index+1}}</span>
                            </template> 
                        </el-table-column>
                        <el-table-column
                        prop="configValue"
                        label="配置值"
                        header-align="center">
                        </el-table-column>
                        <el-table-column
                        prop="configDesc"
                        label="配置描述"
                        header-align="center">
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button type="text" @click="editMedia(scope.$index, scope.row)">查看详情</el-button>
                            <el-button type="text">更 新</el-button>
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
            </el-main>
        </el-container>
    </div>
</template>

<script>
    let data = [
        {
            configValue:'标题111',
            configDesc:'xx-xx',
            createTime:'2018-04-12 12:10:56'
        },
        {
            configValue:'标题111',
            configDesc:'xx-xx',
            createTime:'2018-04-12 12:10:56'
        }
    ];
    export default {
        data() {
            return {
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