<template>
    <div>
        <!-- <div class="tip"><span>未分配设备</span></div> -->
        <el-container>
            <el-main>
                <div class="top">
                    <el-button type="primary" plain class="add-btn" @click="back">返回</el-button>
                    <el-input
                        placeholder="请输入名称搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSeach">
                    </el-input>
                    <el-select v-model="selectValue1" placeholder="全部状态" class="select">
                        <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="selectValue2" placeholder="网络类型" class="select">
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
                        label="设备名称"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="code"
                        label="设备编号"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="network"
                        header-align="center"
                        label="网络类型">
                        </el-table-column>
                        <el-table-column
                        prop="version"
                        header-align="center"
                        label="设备版本">
                        </el-table-column>
                        <el-table-column
                        prop="addTime"
                        header-align="center"
                        label="添加时间">
                        </el-table-column>
                        <el-table-column
                        prop="status"
                        header-align="center"
                        label="状态">
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button type="text" @click="editBtn(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
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
                    <span class="selectSpan">已选择<span>0</span>个设备</span>
                    <el-button type="primary" plain class="btn"><i class="fa fa-trash-o"></i> 删除选中设备</el-button>
                </div>
            </el-main>
        </el-container>
        <v-edit-dialog :editDialog="showEditTip" @closeDialog="closeEdit"></v-edit-dialog>
    </div>
</template>

<script>
    let data = [
        {
            name:'设备1',
            code:'xx-xx',
            network:'有线',
            version:'循环',
            addTime:'2018-03-26 14:00:00',
            status:'离线'
        }
    ];
    let option1 = [
        {
            value:'全部状态',
            lable:'0'
        },
        {
            value:'在线',
            lable:'1'
        },
        {
            value:'在播',
            lable:'2'
        },
        {
            value:'锁定',
            lable:'3'
        },
        {
            value:'离线',
            lable:'4'
        }
    ];
    let option2 = [
        {
            value:'全部状态',
            label:'0'
        },
        {
            value:'在线',
            label:'1'
        },
        {
            value:'在播',
            label:'2'
        },
        {
            value:'下载',
            label:'3'
        },
        {
            value:'锁定',
            label:'4'
        },
        {
            value:'离线',
            label:'5'
        }
    ];
    import vEditDialog from "./editDialog.vue";
    export default {
        components:{
            vEditDialog
        },
        data() {
            return {
                options1:option1,
                options2:option2,
                tableList:data,
                inputSeach:'',
                selectValue1:'',
                selectValue2:'',
                showEditTip:false,
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
            back() {
                this.$emit('close');
            },
            editBtn(index,row) {
                this.showEditTip = true;
            },
            closeEdit() {
                this.showEditTip = false;
            }
        }
    }
</script>

<style scoped>
    .tip{
        line-height: 30px;
        font-size: 14px;
        color: #606266;
        /* float: right; */
    }
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