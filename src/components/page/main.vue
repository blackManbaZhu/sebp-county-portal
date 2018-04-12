<template>
    <div>
        <div class="ms-doc">
            <p class="tip"><span>{{time}}好</span>&nbsp;&nbsp;使用定时功能，让工作有条不紊！</p>
            <el-row>
                <el-col :span="8" v-for="(o, index) in dataList1" :key="index" :class="{'mgl1':index>0?true:false}">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="o.url" class="image1">
                        <div class="info">
                            <span class="span">{{o.theme}}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{o.info}}</time>
                                <el-button type="primary" class="button">进入</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span class="title">数据统计</span>
                        </div>
                        <div class="data-body">
                            <ul>
                                <li>
                                    <span>{{dataInfo.total}}</span>
                                    <label>设备总数</label>
                                </li>
                                <li>
                                    <span>{{dataInfo.lock}}</span>
                                    <label>锁定设备</label>
                                </li>
                                <li>
                                    <span>{{dataInfo.online}}</span>
                                    <label>在线设备</label>
                                </li>
                                <li>
                                    <span>{{dataInfo.play}}</span>
                                    <label>正在播放</label>
                                </li>
                            </ul>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row style="margin-top:20px;">
                <el-col :span="5" v-for="(o, index) in dataList2" :key="index" :class="{'mgl2':index>0?true:false}">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="o.url" class="image2">
                        <div class="info">
                            <span class="span">{{o.theme}}</span>
                            <el-button type="primary" class="button">进入</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span class="title">任务队列</span>
                        </div>
                        <div  class="txt-body">
                            <div v-if="taskList.length > 0"  v-for="(o,index) in taskList" :key="index" class="text item">
                                {{o}}
                            </div>
                            <div v-if="taskList.length = 0" class="text item">暂无任务队列</div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                dataList1:[
                    {
                        url:'./static/img/icon-voice.png',
                        theme:'广播',
                        info:'设置FM调频切换广播内容'
                    },
                    {
                        url:'./static/img/icon-play.png',
                        theme:'多媒体',
                        info:'设置多媒体切换广播内容'
                    }
                ],
                dataList2:[
                    {
                        url:'./static/img/icon-directseeding.png',
                        theme:'直播'
                    },
                    {
                        url:'./static/img/icon-textforvoice.png',
                        theme:'文字转语音'
                    },
                    {
                        url:'./static/img/icon-timed-task.png',
                        theme:'定时任务'
                    }
                ],
                taskList:[
                    '任务1',
                    '任务2'
                ],
                dataInfo:{
                    total:1523,
                    lock:0,
                    online:0,
                    play:0
                },
                time:''
            }
        },
        created() {
            this.getTime();
        },
        methods:{
            getTime() {
                let date  = new Date();
                let times = date.getHours();
                this.time = times < 12 ? '上午':times <= 13 ? '中午':times >13 ?'下午':times >=18 ? '晚上':''
            }
        }
    }
</script>

<style scoped>
.tip{
    padding: 6px 0px;
    color: #999;
}
  .time {
    font-size: 14px;
    color: #999;
  }
  .mgl1{
      margin-left: 2%;
  }
  .mgl2{
      margin-left:3%;
  }
  .mgl3{
      margin-left:1%;
  }
  .bottom {
    margin-top: 13px;
    line-height: 25px;
  }

  .button {
    padding: 5px 15px;
    float: right;
  }

  .image1 {
    height: 220px;
    width: 275px;
    margin-right:15px;
    float: right;
    display: block;
  }
  .image2{
      width: 240px;
      height: 160px;
      text-align: center;
      margin-top:15px;
      margin-left: 13px;
  }
  .info{
    padding: 14px;
    float: left;
    width: 100%;
  }
  .info .span{
      font-size: 18px;
  }
  .data-body{
      height: 213px;
  }
  .data-body li{
      width: 50%;
      height: 100px;
      cursor: pointer;
      float: left;
  }
  .data-body li span{
      display: inline-block;
      width: 100%;
      line-height: 60px;
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      color: #409EFF;
  }
  .data-body li label{
      display: inline-block;
      width: 100%;
      line-height: 20px;
      text-align: center;
  }
  .data-body li:hover{
      background-color: #409EFF;
      color: #fff;
  }
  .data-body li:hover span{
      color: #fff;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 14px;
  }
  .txt-body{
    height: 134px;
    width: 100%;
    overflow-y: auto;
  }
  .box-card{
      margin-left: 8%;
  }
  .box-card .title{
      font-size: 18px;
      font-weight: 600;
  }
  .clearfix:before,.clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }
</style>