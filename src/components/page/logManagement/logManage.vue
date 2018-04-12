<template>
    <div>
         <el-container>
            <el-aside width="360px" class="left">
                <div class="tree">
                    <v-tree :datalist="treeList"></v-tree>
                </div>
            </el-aside>
            <el-main class="right">
                <div class="top">
                    <el-date-picker
                        v-model="TimeValue"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        @change="handleTime()"
                        class="handleTime"
                        >
                    </el-date-picker>
                    <el-button type="primary" plain><i class="fa fa-search"></i></el-button>
                    <el-input
                        placeholder="设备编号/用户搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSeach">
                    </el-input>
                    <el-select v-model="selectValue2" placeholder="全部状态" class="select">
                        <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="selectValue1" placeholder="类型" class="select">
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
                        height="500"
                        border
                        style="width: 100%;"
                        >
                        <el-table-column
                        prop="code"
                        label="设备编号"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="user"
                        label="用户"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="description"
                        header-align="center"
                        label="操作描述">
                        </el-table-column>
                        <el-table-column
                        prop="handleTime"
                        header-align="center"
                        label="操作时间">
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        prop="handleStauts"
                        label="操作状态"
                        >
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
    import vTree  from '../../common/treeOne.vue';
    let dataList = [
        {
            code:'18070902323',
            user:'zhu',
            description:'开始直播',
            handleTime:'2018-04-06 03:00:58',
            handleStauts:'取消'
        },
        {
            code:'18070902323',
            user:'zhu',
            description:'开始直播',
            handleTime:'2018-04-06 03:00:58',
            handleStauts:'取消'
        }
    ];
    let option1 = [
        {
            value:'0',
            label:'全部类型'
        },
        {
            value:'1',
            label:'调频'
        },
        {
            value:'2',
            label:'音频'
        },
        {
            value:'3',
            label:'录音'
        },
        {
            value:'4',
            label:'直播'
        },
        {
            value:'5',
            label:'视频'
        },
        {
            value:'6',
            label:'网络电台'
        },
        {
            value:'7',
            label:'定时任务'
        },
        {
            value:'8',
            label:'文本转语音'
        }
    ];
    let option2 = [
        {
            value:'0',
            label:'全部状态'
        },
        {
            value:'1',
            label:'发送'
        },
        {
            value:'2',
            label:'完成'
        },
        {
            value:'3',
            label:'取消'
        },
        {
            value:'4',
            label:'失败'
        }
    ]
    export default { 
        components:{
            vTree
        },
        data() {
            return {
                tableList:dataList,
                options1:option1,
                options2:option2,
                selectValue1:'',
                selectValue2:'',
                inputSeach:'',
                TimeValue:'',
                treeList:[],
                pageInfo:{
                    total:100,
                    currentPage: 10,
                }, 
            }
        },
        created() {
            this.initdata();
        },
        methods:{
            initdata() {
                const list = JSON.parse(localStorage.getItem('data-list')) || [];
                this.treeList = list;
            },
            handleCurrentChange(val) {

            },
            handleClick(index,row) {
                
            },
            handleTime() {
                console.log(this.TimeValue)
            }
        }
    }
</script>

<style scoped>
    .el-input{
        width: auto;
        float: right;
        width: 180px;
        margin-right: 10px;
    }
    .handleTime{
        width: 280px;
        margin-left: 10px;
    }
    .select{
        width: 120px;
        margin-right: 10px;
        color: #409EFF;
        float: right;
    }
    .left{
        width: 360px;
        height: 620px;
        position: relative;
    }
    .left .tree{
        width: 100%;
        overflow :auto;
        height: 100vh;
    }
    .right{
        position: relative;
    }
    .right .top{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #D3DCE6;
        padding-top: 5px;
    }
    .right .table{
        text-align: center;
    }
    .selectSpan{
        float: left;
        margin-left: 10px;
        font-size: 14px;
        line-height: 40px;
    }
    .selectSpan i{
        color: #3e3e3e;
    }
    .table{
        position: absolute;
        width: 99%;
        left: 0.5%;
        top: 55px;
    }
    .el-aside {
        overflow: none;
        color: #333;
        text-align: center;
        border: 1px solid #D3DCE6;
        margin-right: 20px;
    }
    .el-main {
        color: #333;
        border: 1px solid #D3DCE6;
    }
</style>