<template>
    <div class="header">
        <div class="logo">应急智能广播系统</div>
        <div class="user-info">
            <span class="el-dropdown-link">
                <i class="fa fa-bell icon"></i>
                紧急锁定
            </span>
            <span class="el-dropdown-link">
                <i class="fa fa-question-circle-o icon"></i>
                系统帮助
            </span>
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <i class="fa fa-user-circle icon"></i>
                    {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>18888888888</el-dropdown-item>
					<el-dropdown-item>修改密码</el-dropdown-item>
                    <el-dropdown-item  divided @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: 'admin'
            }
        },
        computed:{
            username(){
                let username = JSON.parse(localStorage.getItem('ms_username'));
                return username ? username : this.name;
            }
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('ms_username')
                    this.$router.push('/login');
                }
            },
            //退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出登录吗?', '提示', {
					type: 'warning'
				}).then(() => {
                    localStorage.removeItem('ms_username');
                    localStorage.removeItem('extent');
					_this.$router.push('/login');
				}).catch(() => {

				});
			},
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        font-size: 22px;
        line-height: 60px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .user-info .icon{
        font-size: 18px;
        color: #fff;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
    .user-info .el-dropdown-link{
        padding-left: 20px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
    }
</style>
