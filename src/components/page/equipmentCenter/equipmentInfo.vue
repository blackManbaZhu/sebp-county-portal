<template>
    <div>
        <div class="top">
            <el-button type="primary" plain class="btn" @click="back">返回设备管理</el-button>
            <div class="tip"><span>终端信息</span></div>
        </div>
        <el-container>
            <el-aside width="360px" class="left">
                <div class="tree">
                    <v-tree :datalist="treeList" @handleTree="handleNode"></v-tree>
                </div>
                <div class="bottom">
                    <el-button type="info" plain >机构下载</el-button>
                </div>
            </el-aside>
            <el-main class="right">
                <div class="top">
                    <el-select v-model="selectValue3" placeholder="显示数目" class="select">
                        <el-option
                        v-for="item in options3"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                    <el-input
                        placeholder="名称和编号搜索"
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
                        prop="code"
                        label="设备编号"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="设备名称"
                        header-align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="storageSpace"
                        header-align="center"
                        label="存储空间">
                        </el-table-column>
                        <el-table-column
                        prop="systemTime"
                        header-align="center"
                        label="系统时间"
                        width="200">
                        </el-table-column>
                        <el-table-column
                        prop="voice"
                        header-align="center"
                        label="音量">
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="操作"
                        >
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.$index, scope.row)" type="text">
                                    <i class="fa fa-download"></i>&nbsp;下载
                                </el-button>
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
                    <el-button type="primary" plain>进入直播</el-button>
                    <el-button type="primary" plain>操作选中设备</el-button>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import vTree  from '../../common/treeOne.vue';
    let dataList = [
        {
            name:'设备1',
            code:'01',
            storageSpace:'3070MB',
            systemTime:'2018-03-29 18:41:38',
            voice:"60%"
        }            
    ];
    export default { 
        components:{
            vTree
        },
        data() {
            return {
                selectValue3:'',
                inputSeach:'',
                checkedTree:'',
                treeList:[],
                multipleSelection:[],
                pageInfo:{
                    total:100,
                    currentPage: 10,
                }, 
                tableList:dataList,
                options3:[ 10, 20, 50, 100]
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val) {

            },
            handleClick(index,row) {
            
            },
            handleNode(data) {
                this.checkedTree = data;
            },
            back() {
                this.$confirm('您确定要返回到设备管理界面吗？', '提示', {type: 'warning'}).then(()=>{
                    this.$emit('close');
                }).catch(()=>{});
            }
        } 
    }
</script>

<style scoped>
.top{
    height: 50px;
}
.top .btn{
    float: left;
}
.top .tip{
    line-height: 40px;
    font-size: 14px;
    color: #606266;
    float: right;
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

.left{
    width: 360px;
    height: 620px;
    position: relative;
}
.left .tree{
    width: 100%;
    overflow :auto;
    height: 546px;
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
.left .bottom,.right .bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    border-top: 1px solid #D3DCE6;
    padding-top: 10px;
}
.right .bottom{
    text-align: right;
    padding-right: 10px;
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
    /* background-color: #D3DCE6; */
    overflow: none;
    color: #333;
    text-align: center;
    border: 1px solid #D3DCE6;
    margin-right: 20px;
  }
.el-main {
    /* background-color: #E9EEF3; */

    color: #333;
    text-align: center;
    border: 1px solid #D3DCE6;
}
</style>