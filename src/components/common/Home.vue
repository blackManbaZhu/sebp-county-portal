<template>
    <div class="wrapper" >
        <v-head></v-head>
        <v-sidebar @clickMenu="clickMenu" @initMenu="initMenu"></v-sidebar>
        <div class="content">
             <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane 
                 v-for="item in tab" 
                 :key="item.index"
                 :index="item.index" 
                 :label="item.title" 
                 :name="item.title"
                 >
                 </el-tab-pane>
            </el-tabs> -->
            <el-tabs v-model="activeName">
                <el-tab-pane :label="activeName" :name="activeName">
                 </el-tab-pane>
            </el-tabs>
            <!-- <div class="line"></div> -->
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components:{
            vHead, vSidebar
        },
        data() {
            return {
                activeName: '',
                tab:[]
            };
        },
        computed:{
            tabData(){
                return this.tab.filter((arr) =>{
                    return arr;
                })
            },
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        methods: {
            handleClick(tab, event) {
                this.$router.push("/"+tab.$attrs.index);
            },
            clickMenu (item,title){
                this.tab = [];
                this.activeName = title;
                item.subs ? this.tab = item.subs : this.tab.push(item);
            },
            initMenu (item,title) {
                this.tab = [];
                this.activeName = title;
                item[0].subs ? this.tab = item[0].subs : this.tab.push(item[0]);
            }
        }
    }
</script>

<style>
 .el-container{
     min-width: 1000px;
 }
</style>

