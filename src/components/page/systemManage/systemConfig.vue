<template>
    <div>
        <el-container>
            <el-main>
                <div class="top">
                    <el-input
                        placeholder="请输入名称搜索"
                        prefix-icon="el-icon-search"
                        v-model="inputSearch"
                        @keyup.enter.native="search"
                        >
                    </el-input>
                </div>
                <div class="table">
                    <el-table
                        :data="tableList"
                        height="85%"
                        border
                        style="width: 100%;"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        header-align="center"
                        width="45">
                        </el-table-column>

                        <el-table-column
                        prop="configName"
                        label="配置名称"
                        header-align="center">
                        </el-table-column>
                        <el-table-column
                        prop="configDescription"
                        label="配置详情"
                        header-align="center">
                        </el-table-column>
                        <el-table-column
                        prop="createTime"
                        label="创建时间"
                        header-align="center">
                        </el-table-column>
                        <el-table-column
                        header-align="center"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button type="text" @click="editMedia(scope.$index, scope.row)">查看详情</el-button>
                            <el-button type="text" @click="editUpdate(scope.$index, scope.row)">更 新</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination
                        v-show="pShow"
                        style="margin-top:15px;float:right;"
                        background
                        @current-change="handleCurrentChange"
                        :page-size="10"
                        layout="total, prev, pager, next, jumper"
                        :current-page="pageInfo.page"
                        :total="pageInfo.total">
                    </el-pagination>
                </div>
            </el-main>
        </el-container>


        <!-- 查看详情 -->
        <el-dialog
          title="查看详情"
          :visible.sync="dialogVisible"
          width="60%">
          <el-form :model="form" label-width="80px">
             <el-form-item label="配置名称">
                <el-input disabled v-model="form.configName"></el-input>
             </el-form-item>
             <el-form-item label="配置详情">
                <el-input disabled v-model="form.configDescription"></el-input>
             </el-form-item>
             <el-form-item label="配置key">
                <el-input disabled v-model="form.configKey"></el-input>
             </el-form-item>
             <el-form-item label="配置值">
                <el-input disabled v-model="form.configValue"></el-input>
             </el-form-item>
             <el-form-item label="创建时间">
                <el-input disabled v-model="form.createTime"></el-input>
             </el-form-item>
          </el-form>
        </el-dialog>

        <!-- 更新 -->
        <el-dialog
          title="更新"
          :visible.sync="dialogVisibleUpdata"
          width="60%">
          <el-form :model="updata" label-width="80px">
             <el-form-item label="配置值">
                <el-input v-model="updata.configValue"></el-input>
             </el-form-item>
             <el-form-item style="margin-left:70%;margin-top:40px;">
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="dialogVisibleUpdata = false">取消</el-button>
              </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>

<script>
  import { verify , API ,  Headers  , getTime , tokenMessage ,allSrim}  from "../../../api/api.js";
    //获取数据
    let CF_API = `${API}/CountryConfigMgmt/sysconfig/v1`;
    //查看
    let SF_API = `${API}/CountryConfigMgmt/sysconfig/v1`;
    //更新
    let UP_API = `${API}/CountryConfigMgmt/sysconfig/v1`;
    export default {
        data() {
            return {
                formLabelWidth:'80px',
                //弹出框
                 //查看
                dialogVisible: false,
                 // 更新
                dialogVisibleUpdata: false,
                tableList: [],
                inputSearch:'',
                oldkeyword: '',
                //查询状态激活
                activateSearch: false,
                multipleSelection:[],
                //用户
                keyword: '',
                //弹出框数据
                title: '',
                 // 1.查看详情
                pageInfo:{
                    total: 0,
                    page: 1,
                },
                pShow: false,
                form:{},
                //更新
                configKey: '',
                oldconfigValue: '',
                updata: {
                    "configValue": '',
                }
            }
        },
        methods:{
            //默认获取数据
            findList(Params) {
              this.axios.post(`${CF_API}/findAll`,Params,{ headers : Headers }).then(res => {
                if(res.data.code == 'Success'){
                  //返回数据
                  this.tableList = res.data.payload.list.map(value =>{
                       value.createTime = getTime(value.createTime);
                       return value;
                  });
                  //总页数
                  this.pageInfo.total = res.data.payload.total;

                  //限制数据超过十条显示翻页控件
                  if(this.pageInfo.total > 10) {
                    this.pShow = true;
                  }

                  //关键字搜索
                  this.oldkeyword = this.inputSearch;

                //   console.log(this.tableList)
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
            },
            //初始化数据
            getList() {
              let keyword = this.keyword = localStorage.getItem('ms_username');
              var Params = {}
              this.findList(Params);
            },
            //搜索
            search() {
              this.pageInfo.page = 1;
              var keyword = allSrim(this.inputSearch);
            //   var oldkeyword = allSrim(this.oldkeyword);

            //   if(keyword != oldkeyword){
                var Params = {
                  "keyword": keyword
                }
                this.findList(Params);
                //激活查询状态

                this.activateSearch = true;
            //   }else {
            //     this.$message({
            //         message: '请不要重复查询！',
            //         type: 'warning'
            //     });
            //   }


            },
            //查看
            editMedia(index,row) {
                this.dialogVisible =  true;
                this.title = "查看详情";
                var configKey = row.configKey;

                this.axios.get(`${SF_API}/findByKey?configKey=`+configKey,{ headers : Headers }).then(res => {
                  if(res.data.code == 'Success'){

                       let arr = res.data.payload;
                       arr.createTime = getTime(arr.createTime).split(' ')[0];
                       this.form = arr;
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
            },
            //更新
            editUpdate(index,row) {
              this.dialogVisibleUpdata =  true;
              this.configKey = row.configKey;
              this.updata.configValue = row.configValue;
              this.oldconfigValue = this.updata.configValue
            },
            //更新提交
            onSubmit() {
              var configKey = this.configKey;
              var configValue = this.updata.configValue;
              var oldconfigValue = this.oldconfigValue;


              if(configValue != oldconfigValue){

                var Params = {"configKey": configKey,"configValue": configValue}
                this.axios.post(`${CF_API}/update`,Params,{ headers : Headers }).then(res => {
                  if(res.data.code == 'Success'){

                      this.$message({type:'success',duration:1200,message:'更新成功!'});
                      //更新数据
                      this.getList();
                      this.dialogVisibleUpdata =  false;

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
              }else {
                this.$message({
                    message: '无修改内容！',
                    type: 'warning'
                });
              }
            },
            //选中
            handleSelectionChange(val) {
                this.multipleSelection = val;
                // var keyword = this.inputSearch;
                // if(this.activateSearch) {
                //     var Params = {
                //     "keyword": keyword,
                //     "pageNum": val,
                //     }
                // }else {
                //     var Params = {
                //     "pageNum": val,
                //     }
                // }
                // this.findList(Params);
            },
            //点击翻页
            handleCurrentChange(val) {
                var keyword = allSrim(this.inputSearch);
               if(this.activateSearch) {
                 var Params = {
                   "keyword": keyword,
                   "pageNum": val,
                 }
               }else {
                 var Params = {
                   "pageNum": val,
                 }
               }
               this.findList(Params);
            },
            //弹出框关闭
            // handleClose(done) {
            //   this.$confirm('确认关闭？')
            //     .then(_ => {
            //       done();
            //     })
            //     .catch(_ => {});
            // },

        },
        //默认请求数据
        mounted() {
           this.getList();
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
        height: 90%;
        padding: 5px;
        text-align: center;
    }
    .table i.fa{
        font-size: 18px;
    }
</style>
