
<template>
    <div>
        <div class="top">
            <el-button type="primary" plain class="btn" @click="back">返回</el-button>
            <div class="tip"><span>多设备操作</span>&nbsp;/&nbsp;<span>设备型号</span></div>
        </div>
        <el-container>
            <el-main>
               <div class="main">
                   <div class="title">
                       <i class="fa fa-cog"></i>&nbsp;&nbsp;基础设置
                       <span>
                           广播&nbsp;&nbsp;
                           <el-switch
                            v-model="switch1"
                            active-color="#13ce66"
                            >
                           </el-switch>
                       </span>
                    </div>
                    <div class="details">
                        <div class="list">
                            <label>音量</label>
                            <span>
                                <i class="fa fa-volume-up vio"></i>
                                <el-slider v-model="volume"></el-slider>
                                <el-button type="primary" class="btn">执行</el-button>
                            </span>
                        </div>
                    </div>
               </div>
               <div class="main">
                   <div class="title">
                       <i class="fa fa-cog"></i>&nbsp;&nbsp;媒体操作
                   </div>
                   <div class="details al">
                       <div class="list">
                            <label>FM频道</label>
                            <div class="r">
                                <el-input placeholder="添加频道76.0~108.0" v-model="input1" class="inp"></el-input>
                                <el-button type="primary" class="bttn">添加</el-button>
                            </div>
                       </div>
                       <div class="list">
                            <label>网络电台</label>
                            <div class="r">
                                <el-button type="primary" class="bttn">选择</el-button>
                            </div>
                       </div>
                       <div class="list">
                            <label>定时任务</label>
                            <div class="r">
                                <el-button type="primary" class="bttn">选择</el-button>
                                <el-button type="primary" class="bttn">列表</el-button>
                            </div>
                       </div>
                       <div class="list">
                            <label>现场录音</label>
                            <div class="r">
                                <el-input placeholder="添加录音音频名称" v-model="input2" class="inp"></el-input>
                                <el-button type="primary" class="bttn">录音</el-button>
                                <small>时长：</small>
                                <small>发送状态：</small>
                            </div>
                       </div>
                       <div class="list">
                            <label>音频文件</label>
                            <div class="r">
                                <el-button class="bttn"><i class="fa fa-unlink icon"></i>&nbsp;&nbsp;在线资源</el-button>
                                <el-button class="bttn"><i class="fa fa-upload icon"></i>&nbsp;&nbsp;本地上传</el-button>
                            </div>
                       </div>
                       <div class="list">
                            <label>文本转语音</label>
                            <div class="r">
                                <el-button class="bttn"><i class="fa fa-file-audio-o icon"></i>&nbsp;&nbsp;输入文本</el-button>
                            </div>
                       </div>
                   </div>
               </div>
            </el-main>
            <el-aside width="30%">
                <div class="main">
                    <div class="title">
                        <i class="fa fa-play"></i>&nbsp;&nbsp;正在播放
                    </div>
                    <div class="details">
                        <div class="play">
                            暂无播放
                        </div>
                    </div>
                </div>
                <div class="main">
                    <div class="title">
                        <i class="fa fa-list"></i>&nbsp;&nbsp;任务队列
                    </div>
                    <div class="details">
                        <div class="list">
                            <ul>
                                <li>暂无任务队列！</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="main">
                    <div class="title">
                        <i class="fa fa-cog"></i>&nbsp;&nbsp;系统操作
                    </div>
                    <div class="details">
                        <div class="list">
                            <label>锁定设备</label>
                            <el-switch
                                v-model="switch2"
                                active-color="#13ce66"
                                style="float:right;margin-top:20px;"
                            >
                            </el-switch>
                        </div>
                        <div class="list">
                            <label>重启设备</label>
                            <div class="r">
                                <el-button type="primary" class="bttn">执行</el-button>
                            </div>
                        </div>
                        <div class="list">
                            <label>恢复出厂设置</label>
                            <div class="r">
                                <el-button type="primary" class="bttn">执行</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
export default {
   data() {
       return{
           input1:'',
           input2:'',
           switch1:false,
           switch2:false,
           volume:20
       }
   },
   methods:{
       back() {
           this.$confirm('您确定要返回到设备操作界面吗？', '提示', {type: 'warning'}).then(()=>{
               this.$emit('Goback');
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
.main{
    width: 100%;
    border: 1px solid #D3DCE6;
    border-bottom:none;
    margin-bottom: 30px;
}
.main .title{
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #409EFF;
    font-size: 14px;
    font-weight: bold;
    padding-left: 10px;
    padding-right: 20px;
    border-bottom: 1px solid #D3DCE6;
}
.main .title span{
    float: right;
}
.details{
    width: 100%;
    display: inline-table;
}
.details .list{
    padding-left: 30px;
    padding-right: 20px;
    width: 100%;
    display: inline-table;
    border-bottom: 1px solid #D3DCE6;
}
.details .list ul {
    padding-top: 20px;
    width: 100%;
    height: 170px;
    overflow-y: auto;
}
.details .list ul li{
    line-height: 20px;
    font-size: 14px;
}
.list .r{
    width: 50%;
    line-height: 55px;
    float: right;
}
.list .r .inp{
    width: 80%;
}
.list .r .bttn{
    height: 35px;
    line-height: 10px;
    margin-top: 10px;
    margin-left: 10px;
    float: right;
    position: relative;
}
.r .bttn .icon{
    position: absolute;
    font-size: 16px;
    top:9px;
    left: 5px;
}
.list .r small{
    float: left;
    display: inline-block;
    width: 50%;
}
.details label{
    line-height: 55px;
    font-size: 14px;
}
.details span{
    float: right;
    width: 300px;
    height: 50px;
    padding-top: 8px;
    margin-right: 90px;
    position: relative;
}
.details span .vio{
    position: absolute;
    color:#409EFF;
    left: -50px;
    top: 18px;
}
.details .btn{
    position: absolute;
    right: -90px;
    top: 10px;
    height: 35px;
    line-height: 10px;
}
.main .details .input{
    position: absolute;
    top: 0;
}
.play{
    width: 100%;
    height: 100%;
    padding: 18px;
    font-size: 14px;
    text-align: center;
    border-bottom: 1px solid #D3DCE6;
}
.el-aside {
    /* height: 75vh; */
    color: #333;
    padding: 0;
    margin-left: 20px;
  }
.el-main {
    color: #333;
    padding: 0;
}
</style>

