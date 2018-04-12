import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/main.vue'], resolve)
                },
                //设备中心
                {
                    path: '/toOperation',
                    component: resolve => require(['../components/page/equipmentCenter/equipmentOperation.vue'], resolve)
                },
                {
                    path: '/toManagement',
                    name:'Management',
                    component: resolve => require(['../components/page/equipmentCenter/equipmentManage.vue'], resolve)
                },
                //资源管理
                {
                    path: '/toMedia',
                    component: resolve => require(['../components/page/resourceManage/media.vue'], resolve)
                },
                {
                    path: '/toTimeTask',
                    component: resolve => require(['../components/page/resourceManage/timedTask.vue'], resolve)
                },
                {
                    path: '/toRaido',
                    component: resolve => require(['../components/page/resourceManage/internetRadio.vue'], resolve)
                },
                {
                    path: '/toVideo',
                    component: resolve => require(['../components/page/resourceManage/videoManage.vue'], resolve)
                },
                {
                    path: '/toFmManage',
                    component: resolve => require(['../components/page/resourceManage/FmManage.vue'], resolve)
                },
                {
                    path: '/toPlayList',
                    component: resolve => require(['../components/page/resourceManage/playList.vue'], resolve)
                },
                {
                    path: '/toTextVoice',
                    component: resolve => require(['../components/page/resourceManage/textVoice.vue'], resolve)
                },
                //机构中心
                {
                    path: '/toOrganization',
                    component: resolve => require(['../components/page/organizationCenter/organizationList.vue'], resolve)
                },
                //用户中心
                {
                    path: '/toUserManage',
                    component: resolve => require(['../components/page/userCenter/userManage.vue'], resolve)
                },
                {
                    path: '/toRoleManage',
                    component: resolve => require(['../components/page/userCenter/roleManage.vue'], resolve)
                },
                //日志管理
                {
                    path: '/toLogManage',
                    component: resolve => require(['../components/page/logManagement/logManage.vue'], resolve)
                },
                //系统管理
                {
                    path: '/toModelManage',
                    component: resolve => require(['../components/page/systemManage/modelManage.vue'], resolve)
                },
                {
                    path: '/toVersionManage',
                    component: resolve => require(['../components/page/systemManage/VersionManage.vue'], resolve)
                },
                {
                    path: '/toUpgradeManage',
                    component: resolve => require(['../components/page/systemManage/upgradeManage.vue'], resolve)
                },
                {
                    path: '/toPlatformInfo',
                    component: resolve => require(['../components/page/systemManage/PlatformInfo.vue'], resolve)
                },
                {
                    path: '/toTokenManage',
                    component: resolve => require(['../components/page/systemManage/tokenManage.vue'], resolve)
                },
                {
                    path: '/toSystemConfig',
                    component: resolve => require(['../components/page/systemManage/systemConfig.vue'], resolve)
                },
                //-_- demo
                {
                    path: '/basetable',
                    component: resolve => require(['../components/page/demo/BaseTable.vue'], resolve)
                },
                {
                    path: '/map',
                    component: resolve => require(['../components/page/demo/map.vue'], resolve)
                },
                {
                    path: '/vuetable',
                    component: resolve => require(['../components/page/demo/VueTable.vue'], resolve)     // vue-datasource组件
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/monitor',
            component: resolve => require(['../components/common/monitoring.vue'], resolve)
        },
    ]
})
