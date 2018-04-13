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
                        <el-form-item label="是否循环" prop="selectValue">
                            <el-select v-model="form1.selectValue" placeholder="是否循环" style="width:350px;">
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
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                @change="handleDate()"
                                :picker-options="pickerOptions0"
                                class="handleTime"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="设置播放开始时间" prop="timeValue1">
                            <el-time-picker
                                v-model="form1.timeValue1"
                               
                                placeholder="开始时间">
                            </el-time-picker>
                         </el-form-item>
                         <el-form-item label="设置播放结束时间" prop="timeValue2">
                            <el-time-picker
                                arrow-control
                                
                                v-model="form1.timeValue2"
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
                        <el-form ref="form2" :model="form2" :rules="rules">
                            <el-form-item label="请输入FM频道" prop="FMName">
                                <el-input v-model="form2.FMName" placeholder="76.0~108.0"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="普通音频业务" name="2">
                        <el-upload
                            style="width:50%;float:left;text-align: center;"
                            ref="upload"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :before-upload="voicebeforeUpload"
                            :on-remove="onRemove"
                            :on-exceed="handleExceed"
                            :limit="1"
                            accept=".mp3,.m4a,.wav,.wma,.ogg,.amr,.3gp"
                            >
                            <el-button size="small" type="primary">本地上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传mp3/m4a/wav/wma/ogg/amr/3gp文件</div>
                        </el-upload>
                        <el-button size="small" type="info" style="float:left;" @click="innerVisible1=true">在线资源</el-button>
                        <el-dialog
                            width="50%"
                            title="选择在线音频资源"
                            :visible.sync="innerVisible1"
                            :close-on-click-modal="false"
                            append-to-body>
                                <div class="table">
                                    <el-select style="float:left;" v-model="mediaType" placeholder="全部音频">
                                        <el-option label="全部音频" value="0"></el-option>
                                        <el-option label="录音音频" value="1"></el-option>
                                        <el-option label="上传音频" value="2"></el-option>
                                    </el-select>
                                    <el-table
                                    :data="tableData1"
                                    style="width: 100%;text-algin:center;">
                                    <el-table-column
                                        prop="name"
                                        label="音频名称"
                                        header-align="center"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="createName"
                                        label="创建人"
                                        header-align="center"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="createTime"
                                        header-align="center"
                                        label="创建时间">
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
                                        style="margin-top:15px;float:right;"
                                        background
                                        @current-change="handleCurrentChange1"
                                        :page-size="pageInfo1.currentPage"
                                        layout="total, prev, pager, next, jumper"
                                        :total="pageInfo1.total">
                                    </el-pagination>
                                </div>
                        </el-dialog>
                    </el-tab-pane>
                    <el-tab-pane label="文本任务" name="3">
                        <div class="radio-tab">
                            <el-radio v-model="radio" label="1">手动输入文本</el-radio>
                            <el-radio v-model="radio" label="2">上传txt文档</el-radio>
                        </div>
                        <div v-if="radio == '1'">
                            <el-form ref="form3" :model="form3" :rules="rules">
                                <el-form-item  prop="textarea" style="margin-bottom:10px;position:relative;">
                                    <el-input
                                        class="area"
                                        type="textarea"
                                        :rows="7"
                                        :maxlength="10000"
                                        :minlength="1"
                                        resize="none"
                                        placeholder="请输入内容"
                                        @input="inputTXT"
                                        v-model="form3.textarea">
                                    </el-input>
                                    <span class="spanBottom">剩余{{spanBottom}}字</span>
                                </el-form-item>
                                <el-form-item  prop="textTitle" style="margin-bottom:10px;">
                                    <el-input
                                        style="margin-top:10px;"
                                        placeholder="请输入标题"
                                        v-model="form3.textTitle"
                                        :maxlength="30"
                                        :minlength="1"
                                        clearable>
                                    </el-input>
                                </el-form-item>
                            </el-form>
                             <p class="tip">文字内容应在10000个字以内；标题应在30个字以内且不能有特殊字符。</p>
                        </div>
                        <div v-if="radio == '2'">
                            <el-upload
                            style="text-align: center;"
                            ref="upload"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :before-upload="txtbeforeUpload"
                            :on-remove="onRemove"
                            :on-exceed="handleExceed"
                            :limit="1"
                            accept=".txt"
                            >
                            <el-button size="small" type="primary">本地上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传txt文件,文字内容应在10000个字以内</div>
                            </el-upload>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="普通视频任务" name="4">
                        <el-upload
                            style="width:50%;float:left;text-align: center;"
                            ref="upload"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :before-upload="videobeforeUpload"
                            :on-remove="onRemove"
                            :on-exceed="handleExceed"
                            :limit="1"
                            accept=".mp4"
                            >
                            <el-button size="small" type="primary">本地上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传mp4</div>
                        </el-upload>
                        <el-button size="small" type="info" style="float:left;" @click="innerVisible2=true">在线资源</el-button>
                         <el-dialog
                            width="50%"
                            title="选择在线视频资源"
                            :visible.sync="innerVisible2"
                            :close-on-click-modal="false"
                            append-to-body>
                                <div class="table">
                                    <el-table
                                    :data="tableData2"
                                    style="width: 100%;text-algin:center;">
                                    <el-table-column
                                        prop="name"
                                        label="视频名称"
                                        header-align="center"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="createName"
                                        label="创建人"
                                        header-align="center"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="createTime"
                                        header-align="center"
                                        label="创建时间">
                                    </el-table-column>
                                    <el-table-column label="操作" header-align="center">
                                        <template slot-scope="scope">
                                            <el-button
                                            size="mini"
                                            type="primary"
                                            @click="handleData2(scope.$index, scope.row)">选择</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                    <!-- 分页 -->
                                    <el-pagination 
                                        style="margin-top:15px;float:right;"
                                        background
                                        @current-change="handleCurrentChange2"
                                        :page-size="pageInfo2.currentPage"
                                        layout="total, prev, pager, next, jumper"
                                        :total="pageInfo2.total">
                                    </el-pagination>
                                </div>
                        </el-dialog>
                    </el-tab-pane>
                </el-tabs>
                <div class="btn">
                    <el-button type="primary" @click="back" plain>上一步</el-button>
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="save">保 存</el-button>
                </div>
            </div>
        </el-dialog>
  </div>
</template>

<script>
    import { verify } from "../../../../api/api.js";
    let options1 = [
        { value:'循环' ,index:'0' },
        { value:'不循环' ,index:'1' }
    ]
    export default {
        props:[
            'addTask'
        ],
        data() {
            return {
                //音频类型
                mediaType:'',
                //音频在线分页
                pageInfo1:{
                    total:20,
                    currentPage: 5,
                },
                //视频在线分页
                pageInfo2:{
                    total:20,
                    currentPage: 5,
                },
                //基本信息表单数据
                form1:{
                    name:'',
                    textarea:'',
                    selectValue:'循环',
                    dateValue:null,
                    timeValue1:null,
                    timeValue2:null,
                },
                //FM
                form2:{
                    FMName:'',
                },
                //文本内容
                form3:{
                    textarea:'',
                    textTitle:'',
                },
                //下拉框
                options1:options1,
                //音频数据
                tableData1:[
                    {
                        name:'123.mp3',
                        createName:'xxx',
                        createTime:'2016.12.12'
                    }
                ],
                //视频数据
                tableData2:[
                    {
                        name:'123.mp3',
                        createName:'xxx',
                        createTime:'2016.12.12'
                    }
                ],
                rules:{
                    name:[
                        { required:true, message:"请输入任务名称" , trigger:'blur' }
                    ],
                    selectValue:[
                        { required:true, message:"请选择是否循环" , trigger:'change' }
                    ],
                    dateValue:[
                        { required:true, message:"请选择开放时间" , trigger:'change' }
                    ],
                    timeValue1:[
                        { required:true, message:"请选择播放开始时间" , trigger:'change' }
                    ],
                    timeValue2:[
                        { required:true, message:"请选择播放结束时间" , trigger:'change' }
                    ],
                    FMName:[
                        { required:true, message:"请输入FM名称" , trigger:'blur' }
                    ],
                    textarea:[
                        { required:true, message:"请输入文本内容" , trigger:'blur' }
                    ],
                    textTitle:[
                        { required:true, message:"请输入文本标题" , trigger:'blur' }
                    ]
                },
                radio:'1',
                innerVisible1:false,
                innerVisible2:false,
                active: 1,
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
            },
            handleMenu(tab,event) { //类型选择导航按钮
                // this.activeMenu = tab;
            },
            next() {
                this.$refs['form1'].validate((valid) =>{
                    if(valid){
                        let name = verify.mediaVerify(this.form1.name);
                        let time = this.handleTime();
                        if(!name){
                            this.$message({type:'error',duration:1200,message:'名称格式不正确！'});
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
            back() { //返回上一步
                this.active = 0;
            },
            save () { //保存
                switch (this.activeMenu) {
                    case '1': //FM
                        let number = Number(this.form2.FMName);
                        let fm     = verify.FMverify(number);
                        if(!fm || number < 76.0 || number > 108.0){
                            this.$message({type:'error',message:'FM频道格式不正确,且范围在76.0~108.0之间！'});
                            return false;
                        };
                        break;
                    case '2': //音频
                        break;
                    case '3'://文本
                        let name = verify.mediaVerify(this.form3.textTitle);
                        if(!name){
                            this.$message({type:'error',message:'文本标题格式不正确！'});
                            return false;
                        }
                        break;
                    case '4': //视频
                        break;
                    default:
                        break;
                }
            },
            submitData() {  //提交数据

            },
            handleDate() {  //选择日期
                // console.log(this.form1.dateValue)
            },
            handleTime() { //选择时间
                let flag  = true;
                let time1 = this.form1.timeValue1;
                let time2 = this.form1.timeValue2;
                if(time1 && time2){
                    let nowtime = Date.parse(new Date());
                    if(time1 > time2){
                        this.$message({type:'error',message:'设置播放结束时间必须大于开始时间！'});
                        flag = false;
                        return flag;
                    }
                    if(time1 < nowtime){
                        this.$message({type:'error',message:'设置播放开始时间必须大于当前时间！'});
                        flag = false;
                        return flag;
                    }
                    if(time2 < nowtime){
                        this.$message({type:'error',message:'设置播放结束时间必须大于当前时间！'});
                        flag = false;
                        return flag;
                    }
                }
                return flag;
            },
            handleExceed(files, fileList) { //选择类型限制个数
                // console.log(files);
                this.$message.warning(`当前限制选择1个文件`);
            },
            onRemove() { //移除选中文件时
                this.fileType = '';
            },

            //选择音频文件具体操作
            voicebeforeUpload(file) { //上传之前
                this.fileType = file.name.split('.')[1];
                const size    = file.size / 1024 / 1024 < 20;
                if(this.fileType != 'mp3' && this.fileType != 'm4a' && this.fileType != 'wav'
                && this.fileType != 'wma' && this.fileType != 'ogg' && this.fileType != 'amr'
                && this.fileType != '3gp'
                ){
                    this.$message.error(`添加失败！当前文件格式不正确!`);
                    this.fileType = '';
                    return false;
                }
                if(!size){
                    this.$message({type:'error',duration:1200,message:'添加失败，文件大小不能超过20M!'});
                }
            },

            //选择视频文件具体操作
            videobeforeUpload(file) { //上传之前
                this.fileType = file.name.split('.')[1];
                const size    = file.size / 1024 / 1024 < 2048;
                if(this.fileType != 'mp4'){
                    this.$message.error(`添加失败！当前文件格式不正确!`);
                    this.fileType = '';
                    return false;
                }
                if(!size){
                    this.$message({type:'error',duration:1200,message:'添加失败，文件大小不能超过2G!'});
                }
            },

            //选择TXT文档具体操作
            txtbeforeUpload(file) { //上传之前
                this.fileType = file.name.split('.')[1];
                if(this.fileType != 'txt' ){
                    this.$message.error(`添加失败！当前文件格式不正确!`);
                    this.fileType = '';
                    return false;
                }
            },

            handleData1() {  //选择在线音频资源

            },
            handleCurrentChange1() { //分页

            },
            handleData2() { //选择在线视频资源

            },
            handleCurrentChange2() { //分页

            },
            inputText() { //任务描述剩余字数
                this.placeholde = 500 - this.form1.textarea.length;
            },
            inputTXT(){
                this.spanBottom = 10000 - this.form3.textarea.length;
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
