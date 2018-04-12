<template>
    <div>
         <el-container v-show="!showButed && !showMap && !showInfo">
            <el-aside width="360px" class="left">
                <div class="tree">
                    <v-tree :datalist="treeList"></v-tree>
                </div>
                <div class="bottom">
                    <el-button type="info" plain>导出设备</el-button>
                </div>
            </el-aside>
            <el-main class="right">
                <div class="top">
                    <el-button type="primary" plain @click="addBtn"><i class="fa fa-plus-square"></i>&nbsp; 添加设备</el-button>
                    <el-button type="text" size="small" @click="handleButed">未分配设备</el-button>
                    <el-button type="text" size="small" @click="handleMap">地图展示</el-button>
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
                    <el-select v-model="selectValue2" placeholder="全部状态" class="select">
                        <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="selectValue1" placeholder="网络类型" class="select">
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
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="code"
                        label="设备编号"
                        header-align="center"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="network"
                        header-align="center"
                        label="网络类型">
                        </el-table-column>
                        <el-table-column
                        prop="status"
                        header-align="center"
                        label="状态">
                        </el-table-column>
                        <el-table-column
                        prop="signal"
                        header-align="center"
                        label="信号">
                        <i class="fa fa-circle"></i>
                        </el-table-column>
                        <el-table-column
                        prop="versions"
                        header-align="center"
                        label="版本号">
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
                    <el-button type="primary" plain @click="handleInfo">终端信息</el-button>
                    <el-button type="primary" plain><i class="fa fa-trash-o"></i> 删除选中设备</el-button>
                </div>
            </el-main>
        </el-container>
        <v-add-dialog :addDialog="showAddTip" @closeDialog="closeAdd"></v-add-dialog>
        <v-edit-dialog :editDialog="showEditTip" @closeDialog="closeEdit"></v-edit-dialog>
        <v-buted v-show="showButed" @close="closeButed"></v-buted>
        <v-map v-show="showMap" @close="closeMap"></v-map>
        <v-info v-show="showInfo" @close="closeInfo"></v-info>
    </div>
</template>

<script>
    import vTree       from '../../common/treeOne.vue';
    import vAddDialog  from "./addDialog.vue";
    import vEditDialog from "./editDialog.vue";
    import vButed      from "./undistributed.vue";
    import vMap        from "../../common/map.vue";
    import vInfo        from "./equipmentInfo.vue";
    let dataList = [
        {
            name:'设备1',
            code:'01',
            network:'有线',
            status:'离线',
            signal:0,
            versions:'v1.1.1'
        },
        {
            name:'设备1',
            code:'01',
            network:'有线',
            status:'离线',
            signal:0,
            versions:'v1.1.1'
        },
        {
            name:'设备1',
            code:'01',
            network:'有线',
            status:'离线',
            signal:0,
            versions:'v1.1.1'
        },
        {
            name:'设备1',
            code:'01',
            network:'有线',
            status:'离线',
            signal:0,
            versions:'v1.1.1'
        },
        {
            name:'设备1',
            code:'01',
            network:'有线',
            status:'离线',
            signal:0,
            versions:'v1.1.1'
        },
        {
            name:'设备1',
            code:'01',
            network:'有线',
            status:'离线',
            signal:0,
            versions:'v1.1.1'
        },
        {
            name:'设备1',
            code:'01',
            network:'有线',
            status:'离线',
            signal:0,
            versions:'v1.1.1'
        },
        {
            name:'设备1',
            code:'01',
            network:'有线',
            status:'离线',
            signal:0,
            versions:'v1.1.1'
        },
        {
            name:'设备1',
            code:'01',
            network:'有线',
            status:'离线',
            signal:0,
            versions:'v1.1.1'
        }
    ];
    let option1 = [
        {
            value:'0',
            label:'全部'
        },
        {
            value:'1',
            label:'有线'
        },
        {
            value:'2',
            label:'3/4G网络'
        },
        {
            value:'3',
            label:'适配器'
        },
        {
            value:'4',
            label:'物联网'
        }
    ];
    let option2 = [
        {
            value:'0',
            label:'全部状态'
        },
        {
            value:'1',
            label:'在线'
        },
        {
            value:'2',
            label:'在播'
        },
        {
            value:'3',
            label:'下载'
        },
        {
            value:'4',
            label:'锁定'
        },
        {
            value:'5',
            label:'离线'
        }
    ];
    export default { 
        components:{
            vTree,vAddDialog,vEditDialog,vButed,vMap,vInfo
        },
        data() {
            return {
                tableList:dataList,
                options1:option1,
                options2:option2,
                options3:[ 10, 20, 50, 100],
                selectValue1:'',
                selectValue2:'',
                selectValue3:'',
                inputSeach:'',
                showAddTip:false,
                showEditTip:false,
                showButed:false,
                showMap:false,
                showInfo:false,
                treeList:[],
                multipleSelection:[],
                pageInfo:{
                    total:100,
                    currentPage: 10,
                }
            }
        },
        created() {
            this.initdata();
            this.initMonitor();
        },
        methods:{
            initdata() {
                const list = JSON.parse(localStorage.getItem('data-list')) || [];
                this.treeList = list;
            },
            initMonitor() {
                const item = this.$route.params.item
                if(!item && item != undefined){
                    this.showMap = true;
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val) {

            },
            handleClick(index,row) {
                
            },
            //添加按钮
            addBtn() {
                this.showAddTip  = true;
            },
            closeAdd() {
                this.showAddTip  = false;
            },
            editBtn() {
                this.showEditTip = true;
            },
            closeEdit() {
                this.showEditTip = false;
            },
            handleButed() {
                this.showButed   = true;
            },
            closeButed() {
                this.showButed   = false;
            },
            handleMap() {
                this.showMap     = true;
            },
            closeMap() {
                this.showMap     = false;
            },
            handleInfo() {
                this.showInfo    = true;
            },
            closeInfo() {
                this.showInfo    = false;
            }
        }
    }
</script>

<style scoped>
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