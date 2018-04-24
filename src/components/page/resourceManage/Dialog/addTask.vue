<template>
  <div>
      <el-dialog title="添加定时任务" :visible.sync="addTask" :show-close="false" :close-on-click-modal="false">
            <el-steps :active="active" finish-status="success" class="steps" align-center>
                <el-step title="编辑基本信息"></el-step>
                <el-step title="选择任务类型"></el-step>
            </el-steps>
            <div class="step1" v-show="active == 0">
                <el-form ref="form1" :model="form1" :rules="rules">
                    <div class="l">
                        <el-form-item label="任务名称" prop="name">
                            <el-input :minlength="1" :maxlength="30" v-model="form1.name"></el-input>
                        </el-form-item>
                        <el-form-item label="任务描述" class="textarea">
                            <el-input
                            class="area"
                            type="textarea"
                            :rows="7"
                            :maxlength="500"
                            :minlength="1"
                            resize="none"
                            placeholder="请输入描述（限制500字）"
                            v-model="form1.textarea"
                            @input="inputText()">
                            </el-input>
                            <span class="spanInt">剩余（{{placeholde}}字）</span>
                        </el-form-item>
                    </div>
                    <div class="r">
                        <el-form-item label="是否循环" prop="index">
                            <el-select v-model="form1.index" placeholder="是否循环" style="width:350px;">
                                <el-option 
                                v-for="item in options1"
                                :key="item.index"
                                :label="item.value" 
                                :value="item.index"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="对外开放时间" prop="dateValue">
                            <el-date-picker
                                v-model="form1.dateValue"
                                :editable="false"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="handleDate()"
                                :picker-options="pickerOptions0"
                                class="handleTime"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="设置播放开始时间" prop="timeValue1">
                            <el-time-picker
                                v-model="form1.timeValue1"
                                minTime="00:00:01"
                                arrow-control
                                placeholder="开始时间">
                            </el-time-picker>
                         </el-form-item>
                         <el-form-item label="设置播放结束时间" prop="timeValue2">
                            <el-time-picker
                                v-model="form1.timeValue2"
                                arrow-control
                                placeholder="结束时间">
                            </el-time-picker>
                        </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button @click="cancel">取 消</el-button>
                        <el-button type="primary" @click="next">下一步</el-button>
                    </div>
                </el-form>
            </div>
            <div class="step2" v-show="active == 1 || active == 2">
                <el-tabs v-model="activeMenu" @tab-click="handleMenu" class="tab">
                    <el-tab-pane label="FM任务" name="1" >
                        <el-button type="info" style="float:left;" @click="openResource('4','FM'),innerVisible=true">在线资源</el-button>
                        <el-input disabled v-model="selectName" style="width:50%;float:left;margin-left:20px;" ></el-input>
                    </el-tab-pane>
                    <el-tab-pane label="音频业务" name="2">
                        <el-button type="info" style="float:left;" @click="openResource('1','音频'),innerVisible=true">在线资源</el-button>
                        <el-input disabled v-model="selectName" style="width:50%;float:left;margin-left:20px;" ></el-input>
                    </el-tab-pane>
                    <el-tab-pane label="文本任务" name="3">
                        <el-button type="info" style="float:left;" @click="openResource('3','文本'),innerVisible=true">在线资源</el-button>
                        <el-input disabled v-model="selectName" style="width:50%;float:left;margin-left:20px;" ></el-input>
                    </el-tab-pane>
                    <el-tab-pane label="视频任务" name="4">
                        <el-button type="info" style="float:left;" @click="openResource('2','视频'),innerVisible=true">在线资源</el-button>
                        <el-input disabled v-model="selectName" style="width:50%;float:left;margin-left:20px;" ></el-input>
                    </el-tab-pane>
                    <el-tab-pane label="网络电台任务" name="5">
                        <el-button type="info" style="float:left;" @click="openResource('5','网络电台'),innerVisible=true">在线资源</el-button>
                        <el-input disabled v-model="selectName" style="width:50%;float:left;margin-left:20px;" ></el-input>
                    </el-tab-pane>
                </el-tabs>
                 <!--在线列表 -->
                 <el-dialog
                    width="50%"
                    :title="'添加'+onlineTitle+'资源'"
                    :visible.sync="innerVisible"
                    :close-on-click-modal="false"
                    append-to-body>
                        <div class="table">
                            <el-table
                            :data="tableData"
                            style="width: 100%;text-algin:center;">
                            <el-table-column
                                prop="mediaName"
                                :label="onlineTitle+'名称'"
                                header-align="center"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="createUser"
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
                                prop="mediaType"
                                header-align="center"
                                label="类型">
                            </el-table-column>
                            <el-table-column label="操作" header-align="center">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    type="primary"
                                    @click="handleData1(scope.$index, scope.row)">选择</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                            <!-- 分页 -->
                            <el-pagination 
                                v-if="pShow"
                                style="margin-top:15px;float:right;"
                                background
                                @current-change="handleCurrentChange1"
                                :page-size="pageSize"
                                layout="total, prev, pager, next, jumper"
                                :current-page="pageInfo.page"
                                :total="pageInfo.total">
                            </el-pagination>
                        </div>
                </el-dialog>
                <div class="btn">
                    <el-button type="primary" @click="active = 0" plain>上一步</el-button>
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="save">保 存</el-button>
                </div>
            </div>
        </el-dialog>
  </div>
</template>

<script>
    import { verify , API,  Headers , getTime, getHMStime ,trim ,tokenMessage} from "../../../../api/api.js";
    //获取数据
    let TX_API = `${API}/CountryResMgmt/media/v1`;
    let options1 = [
        { value:'循环' ,index:'1' },
        { value:'不循环' ,index:'2' }
    ]
    export default {
        props:[
            'addTask'
        ],
        data() {
            return {
                //音频类型
                mediaType:'',

                //在线资源列表标题 表头
                onlineTitle:'',
                
                resType:'', //资源类型
                selectName:'', //选中
                MediaID:'',  //选中id
                //分页信息
                pShow:false,
                pageSize:5,
                pageInfo:{
                    total:0,
                    page: 1,
                },
                //基本信息表单数据
                form1:{
                    name:'',
                    textarea:'',
                    index:'循环',
                    dateValue:null,
                    timeValue1:null,
                    timeValue2:null,
                },
                //文本内容
                form3:{
                    textarea:'',
                    textTitle:'',
                },
                //下拉框
                options1:options1,
                tableData:[], //资源列表
                rules:{
                    name:[
                        { required:true, message:"请输入任务名称"}
                    ],
                    selectValue:[
                        { required:true, message:"请选择是否循环"}
                    ],
                    dateValue:[
                        { required:true, message:"请选择开放时间"}
                    ],
                    timeValue1:[
                        { required:true, message:"请选择播放开始时间"}
                    ],
                    timeValue2:[
                        { required:true, message:"请选择播放结束时间"}
                    ],
                    textarea:[
                        { required:true, message:"请输入文本内容"}
                    ],
                    textTitle:[
                        { required:true, message:"请输入文本标题"}
                    ]
                },
                radio:'1',
                innerVisible:false,
                active: 0,
                placeholde:500, 
                spanBottom:10000,
                activeMenu:'1', //第二步导航
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                }
            }
        },
        methods: {
            cancel() {
                this.$emit("close");
                this.clearForm()
            },
            handleMenu(tab,event) { 
                //类型选择导航按钮 清除选中资源
                this.selectName   = '';
                this.MediaID      = '';
            },
            getListData(Params) {  
                //获取资源列表
                this.axios.post(`${TX_API}/findAllMedia`,Params,{ headers : Headers }).then(res => {
                    // console.log(res.data);

                    if(res.data.code == "Success") {
                        //返回数据
                        let data = res.data.payload;
                        this.tableData = data.list.map((value,index) =>{
                            value.createTime = getTime(value.createTime);
                            value.mediaType  = value.mediaType == 1 ? '音频资源':value.mediaType == 2 ? '视频资源':value.mediaType == 3 ?'文本资源'
                            :value.mediaType == 4 ? 'FM资源' : value.mediaType == 5 ? '网络电台资源' :'';
                            return value;
                        })

                        this.pageInfo.total = data.total; //总数

                        if(this.pageInfo.total > 5) {
                            this.pShow = true;
                        }

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
            openResource(type,name) { 
                this.tableData     = [];
                this.pageInfo.page = 1;
                this.onlineTitle   = name;
                //打开资源弹窗
                let Params = {
                    "keyword":'',
                    'pageSize':this.pageSize,
                    "mediaType":type
                }
                this.getListData(Params)
                this.resType = type;
            },
            
            handleCurrentChange1(val) { 
                //分页
                let Params = {
                    "keyword":'',
                    "pageNum":val,
                    'pageSize':this.pageSize,
                    "mediaType":this.resType
                }
                this.getListData(Params)
            },

            next() {
                //下一步
                this.$refs['form1'].validate((valid) =>{
                    if(valid){
                        let name = verify.mediaVerify(this.form1.name);
                        let time = this.handleTime();
                        let desc = this.taskDescVerify(this.form1.textarea);
                        if(!desc && this.form1.textarea != '') {
                            this.$message({type:'error',message:'任务描述内容格式不正确，不能输入乱码！'});
                            return false;
                        }
                        if(!name) {
                            this.$message({type:'error',message:'任务名称格式不正确，长度最大为64！'});
                            return false;
                        }
                        if(!time){
                            return false;
                        }
                        this.active = 1;
                    }else{
                        return false;
                    }
                })
            },

            handleData1(index,row) {  
                //选择资源
                this.selectName   = row.mediaName;
                this.MediaID      = row.mediaId;
                this.innerVisible = false;
            },
            save () { //保存

                if(!this.selectName){
                    this.$message({type:'error',message:'请选择资源！'});
                    return false;
                }
                
                let startTime      = Date.parse(this.form1.dateValue[0]);
                let endTime        = Date.parse(this.form1.dateValue[1]);
                let playBeginTime  = getHMStime(this.form1.timeValue1);
                let playEndTime    = getHMStime(this.form1.timeValue2);
                let isCycle        = this.form1.index == '循环' ? '1' : '2';
                let taskName       = trim(this.form1.name);
                let taskDesc       = trim(this.form1.textarea);
                let taskType       = this.resType;
                let mediaId        = this.MediaID;
                

                let Params= {
                    "taskName":taskName, 
                    "taskDesc":taskDesc,
                    "taskType":taskType,
                    "mediaId":mediaId,
                    'isCycle':isCycle,
                    'startTime':startTime,
                    "endTime":endTime,
                    "playBeginTime":playBeginTime,
                    "playEndTime":playEndTime,
                };

                this.axios.post(`${TX_API}/saveTask`,Params,{ headers : Headers }).then(res => {
                    if(res.data.code == "Success"){
                        
                        let Params = {
                            "keyword":'',
                        }
                        this.$emit("getList", Params); //刷新列表数据

                        this.$message({type:'success',duration:1200,message:'新增成功!'});

                        this.clearForm();
                    }else{

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
                    console.log(err)
                    this.$message({
                        message: '请求错误，请刷新页面！',
                        type: 'warning'
                    });
                });
            },

            clearForm() { //清除表单
                this.form1 = {
                    name:'',
                    textarea:'',
                    index:'循环',
                    dateValue:null,
                    timeValue1:null,
                    timeValue2:null,
                };
                this.active = 0;
                this.$emit("close");

                //关闭表单验证
				this.$refs['form1'].resetFields();
            },
            handleDate() {  //选择日期
                // console.log(Date.parse(this.form1.dateValue[0]))
            },
            handleTime() { //选择时间
                let flag  = true;
                let time1 = this.form1.timeValue1;
                let time2 = this.form1.timeValue2;
                // console.log(this.formatTime(time1))
                if(this.formatTime(time1) == '000000'){
                    this.$message({type:'error',message:'播放开始时间必须大于00:00:00！'});
                    flag = false;
                    return flag;
                }
                if(time1 && time2){
                    if(time1 > time2){
                        this.$message({type:'error',message:'播放结束时间必须大于播放开始时间！'});
                        flag = false;
                        return flag;
                    }
                }
                return flag;
            },
            inputText() { //任务描述剩余字数
                this.placeholde = 500 - this.form1.textarea.length;
            },
            taskDescVerify(name) {
                var flag;
                var num = trim(name);
                var myreg = /^[A-Za-z0-9\u4e00-\u9fa5\_|\-|]{1,64}$/;
                if (!myreg.test(num)) {
                    flag = false;
                } else {
                    flag = true;
                }
                return flag;
            },
            formatTime(time) {
                let t = new Date(time);
                let tf = function(i){return (i < 10 ? "0" : "") + i};
                let h  = tf(t.getHours());
                let m  = tf(t.getMinutes());
                let s  = tf(t.getSeconds()); 
                return h + m + s;
            }
        }
    }
</script>

<style scoped>
    .steps{
        width: 100%;
        margin: 0 auto;
    }
    .step1,.step2{
        width: 100%;
        margin-top: 25px;
        display: inline-table;
    }
    .step1 .l{
        width: 50%;
        /* height: 400px; */
        float: left;
        /* border: 1px solid #D3DCE6; */
        padding: 10px;
    }
    .step1 .r{
        width: 50%;
        /* height: 400px; */
        float: left;
        /* border: 1px solid #D3DCE6; */
        border-left:none;
        padding: 10px;
    }
    .step2 .tab{
        width: 100%;
        padding: 10px;
        border: 1px solid #D3DCE6;
    }
    .step2 .el-tabs--top{
        width: 90%;
        margin: 0 auto;
    }
    .btn{
        text-align: center;
        width: 100%;
        height: 40px;
        margin-top: 20px;
        float: left;
    }
    .table{
        width: 100%;
        text-align: center;
        display: inline-table;
    }
    .tip{
        font-size: 12px;
        padding-left: 5px;
        padding-top: 10px;
    }
    .textarea{
        position: relative;
    }
    .textarea .spanInt{
        position: absolute;
        right: 5px;
        bottom: -5px;
        color: #606266;
        font-size: 12px;
    }
    .radio-tab{
        line-height: 30px;
        text-align: center;
        margin-bottom: 15px;
    }
    .spanBottom{
        position: absolute;
        right: 5px;
        bottom: -5px;
        color: #606266;
        font-size: 12px;
    }
</style>
