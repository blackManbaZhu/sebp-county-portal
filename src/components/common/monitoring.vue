<template>
  <div class="map-content">
        <div class="topBtn">
            <el-button type="primary" plain class="btn" @click="back">返回设备管理</el-button>
            <h3>xx应急智能广播平台</h3>
        </div>
        <div class="map">
                <div class="top">
                    <ul>
                        <li 
                            @click="CheckDevice('1')" 
                            :class="{active:NavActive == '1'}">
                            <span class="all"><i class="fa fa-circle-o"></i></span>全部设备(1523)
                        </li>
                        <li 
                            @click="CheckDevice('2')" 
                            :class="{active:NavActive == '2'}">
                            <span class="zaixian"><i class="fa fa-volume-up"></i></span>在线(2)
                        </li>
                        <li 
                            @click="CheckDevice('3')" 
                            :class="{active:NavActive == '3'}">
                            <span class="zaibo"><i class="fa fa-volume-up"></i></span>在播(0)
                        </li>
                        <li 
                            @click="CheckDevice('4')" 
                            :class="{active:NavActive == '4'}">
                            <span class="suoding"><i class="fa fa-volume-up"></i></span>锁定(0)
                        </li>
                        <li 
                            @click="CheckDevice('5')" 
                            :class="{active:NavActive == '5'}">
                            <span class="lixian"><i class="fa fa-volume-up"></i></span>离线(0)
                        </li>
                    </ul>
                    <div class="search">
                        <el-input
                                class="inpt"
                                placeholder="关键字搜索"
                                prefix-icon="el-icon-search"
                                v-model="inputSeach">
                            </el-input>
                    </div>
                </div>
                <div id="allmap"></div>
            </div>
  </div>
</template>

<script>
export default {
   data () {
       return {
            NavActive:'1',
            inputSeach:'',
            data_info:[
                [118.803194,32.093242,'南京站','地址：南京市玄武区龙蟠路111号'],
                [118.802763,32.075743,'玄武湖公园','地址:南京市玄武区玄武巷1号(近洞庭路)']
            ],
            opts:{
                width : 200,    
                height: 80,    
                title : "信息窗口",
                enableMessage:true
            }
       }
   },
   methods:{
       CheckDevice(index){
           this.NavActive = index;
       },
       mapData() {
            let map = new BMap.Map("allmap");
            let point = new BMap.Point(118.803625,32.04);
            map.enableScrollWheelZoom();
			map.centerAndZoom(point,13); 
            let addClickHandler = (title,content,marker) =>{
                let _this = this;
                marker.addEventListener("click",function(e){
                    _this.opts.title = title;
			        openInfo(content,e)}
		        ); 
            };
            let openInfo = (content,e) =>{
                let p = e.target;
                let point      = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                let infoWindow = new BMap.InfoWindow(content,this.opts);  // 创建信息窗口对象 
                map.openInfoWindow(infoWindow,point); //开启信息窗口
            }
            this.data_info.map((value)=>{
                let marker  = new BMap.Marker(new BMap.Point(value[0],value[1]));
                let title   = value[2];
                let content = value[3]; 
                map.addOverlay(marker);
                addClickHandler(title,content,marker);
            })
       },
       back() {
           this.$router.push({ path:'/toManagement',name:'Management',params:{item:false} });
       }
   },
   mounted() {
       this.mapData()
   }
}
</script>

<style  scoped>
    .map-content{
        padding: 20px;
    }
    .map{
        width: 100%;
        border: 1px solid #dcdfe6;
		margin-top:10px;
		/* padding:10px; */
        position: relative;
        display: inline-table;
    }
    .topBtn{
        width: 100%;
        display: inline-table;
    }
    .topBtn h3{
        text-align: center;
        width: 100%;
        line-height: 40px;
    }
    .btn{
        float: left;
    }
    .top{
        width: 100%;
        height: 50px;
        background-color: rgba(255,255,255,0.7);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
    .search{
        width: 360px;
        float: right;
        padding: 5px 0;
        margin-right: 10px;
    }
    .top ul{
        width: 100%;
    }
    .top ul li{
        margin-right: 5px;
        padding-left:30px;
        padding-right:15px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        float: left;
        cursor: pointer;
        position: relative;
    }
    .top ul li span{
        position: absolute;
        left: 5px;
        top: 15px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        line-height: 20px;
        text-align: center;
    }
    .top ul li span i{
        color: #fff;
        font-size: 14px;
        z-index: 10;
    }
    .top ul li:hover{
        background-color: #a8c7e6;
    }
    .top ul li.active{
        background-color: #a8c7e6;
    }
    .all{
        background-color: #329fbe;
    }
    .zaixian{
        background-color: #0f4c80;
    }
    .zaibo{
        background-color: #168008;
    }
    .suoding{
        background-color: #dd870c;
    }
    .lixian{
        background-color: #a5a3a3;
    }
    #allmap {
        width:100%;
        height:85vh;
        z-index: 0;
        border: 1px solid #dcdfe6;
        position: absolute;
    }
</style>
