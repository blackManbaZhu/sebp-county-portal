import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import Vuex from 'vuex'
import VueRouter from 'vue-router'
// import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import "../static/css/audio.css";
Vue.use(VueAxios, axios)
Vue.use(ElementUI);
Vue.use(VueRouter);

//
axios.interceptors.response.use(response => {
    // console.log(response)
    if (response.data.message == '非法token' && response.data.code == "TokenInvalid") {
        router.push('/login');
    }
    return response;
},
    error => {
        
    })


router.beforeEach((to, form, next)=>{

    if( to.path == '/login' ){
        localStorage.removeItem('ms_username');
        localStorage.removeItem('phone');
        localStorage.removeItem('extent');
        localStorage.removeItem('token');
        localStorage.removeItem('orgId');
        localStorage.removeItem('userId');
    }

    let user = localStorage.getItem('token');

    if (!user && to.path != '/login'){
        next( { path:'/login' } );
    }else {
        next();
    }
    
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');