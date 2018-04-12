<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router 
        background-color="#242f42"
        text-color="#fff"
        active-text-color="#ffd04b">
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index" v-if="initRouter(item)">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item 
                        v-for="(subItem,i) in item.subs" 
                        :key="i" 
                        :index="subItem.index"
                        @click="clkTab(item,subItem.title)"
                        v-if="initRouter(subItem)"
                        >
                        {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" @click="clkTab(item,item.title)" v-if="initRouter(item)">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'fa fa-home',
                        index: 'home',
                        title: '首页',
                        extent: '00100'
                    },
                    {
                        icon: 'fa fa-television',
                        index: '2',
                        title: '设备中心',
                        extent: '00200',
                        subs: [
                            {
                                index: 'toOperation',
                                title: '设备操作',
                                extent: '00201'
                            },
                            {
                                index: 'toManagement',
                                title: '设备管理',
                                extent: '00202'
                            }
                        ]
                    },
                     {
                        icon: 'fa fa-user-circle',
                        index: '3',
                        title: '用户中心',
                        extent: '00300',
                        subs: [
                            {
                                index: 'toUserManage',
                                title: '用户管理',
                                extent: '00301'
                            },
                            {
                                index: 'toOrganization',
                                title: '机构管理',
                                extent: '00302'
                            },
                            // {
                            //     index: 'toRoleManage',
                            //     title: '角色管理',
                            //     extent: '00303'
                            // }
                        ]
                    },
                    {
                        icon: 'fa fa-folder-open',
                        index: '4',
                        title: '资源管理',
                        extent: '00400',
                        subs: [
                            {
                                index: 'toMedia',
                                title: '音频管理',
                                extent: '00401'
                            },
                            {
                                index: 'toTimeTask',
                                title: '定时任务',
                                extent: '00402'
                            },
                            {
                                index: 'toRaido',
                                title: '网络电台',
                                extent: '00403'
                            },
                            {
                                index: 'toVideo',
                                title: '视频管理',
                                extent: '00404'
                            },
                            {
                                index: 'toFmManage',
                                title: 'FM频道管理',
                                extent: '00405'
                            },
                            {
                                index: 'toTextVoice',
                                title: '文本转语音',
                                extent: '00406'
                            },
                            {
                                index: 'toPlayList',
                                title: '播放列表',
                                extent: '00407'
                            }
                        ]
                    },
                    {
                        icon: 'fa fa-sitemap',
                        index: '5',
                        title: '机构中心',
                        extent: '00500',
                        subs: [
                            {
                                index: 'toOrganization',
                                title: '机构列表',
                                extent: '00501'
                            }
                        ]
                    },
                   
                    {
                        icon: 'fa fa-file-text-o',
                        index: '6',
                        title: '日志管理',
                        extent: '00600',
                        subs: [
                            {
                                index: 'toLogManage',
                                title: '日志列表',
                                extent: '00601'
                            }
                        ]
                    },
                    {
                        icon: 'fa fa-th-list',
                        index: '7',
                        title: '系统管理',
                        extent: '00700',
                        subs: [
                            // {
                            //     index: 'toModelManage',
                            //     title: '型号管理',
                            //     extent: '00701'
                            // },
                            // {
                            //     index: 'toVersionManage',
                            //     title: '版本管理',
                            //     extent: '00702'
                            // },
                            // {
                            //     index: 'toUpgradeManage',
                            //     title: '设备升级',
                            //     extent: '00703'
                            // },
                            // {
                            //     index: 'toPlatformInfo',
                            //     title: '平台信息',
                            //     extent: '00704'
                            // },
                            // {
                            //     index: 'toTokenManage',
                            //     title: 'Token管理',
                            //     extent: '00705'
                            // },
                            {
                                index: 'toSystemConfig',
                                title: '系统配置',
                                extent: '00706'
                            }
                        ]
                    },
                    {
                        icon: 'fa fa-connectdevelop',
                        index: '8',
                        title: '示例展示',
                        extent: '00800',
                        subs: [
                            {
                                index: 'basetable',
                                title: '基础表格',
                                extent: '00801'
                            },
                            {
                                index: 'map',
                                title: '地图展示',
                                extent: '00802'
                            },
                            {
                                index: 'vuetable',
                                title: 'Vue表格组件',
                                extent: '00803'
                            }
                        ]
                    }
                ],
                menu:[]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        methods:{
            clkTab(item,title){
                this.$emit('clickMenu',item,title,'item','title');
            },
            initRouter(item) {
                let purviewId = localStorage.getItem('extent').split(',');
                let extents   = new Array(item.extent);
                for(let i=0;i<purviewId.length;i++){
                    if(!item.hidden && extents == purviewId[i]){
                        return true;
                    }
                }
                return false;
            },
            initMenu() {
                let path  = this.$route.path.replace('/','');
                let title = '';
                let arr   = [];
                arr   = this.items.filter(function (d) {
                    if( d.index != path && d.subs != undefined && d.subs ) {
                        for(let i=0;i<d.subs.length;i++){
                            if(d.subs[i].index == path){
                                title = d.subs[i].title;
                                return d.subs[i].title;;
                            }
                        }
                    } 
                    else if( d.index == path ){
                        title = d.title;
                        return d;
                    }
                });
                this.$emit('initMenu',arr,title,'item','title');
            }
        },
        mounted(){
           this.initMenu(); //初始化内容区头部导航
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 60px;
        bottom:0;
        background: #2E363F;
        overflow-y: scroll;
    }
    .sidebar > ul {
        height:100%;
    }
    .el-submenu__title i,.el-menu-item i{
        margin-right: 5px;
        width: 24px;
        text-align: center;
        font-size: 18px;
    }
</style>
