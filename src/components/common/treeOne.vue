<template>
    <div class="tree">
        <el-tree 
        :data="data" 
        :props="defaultProps" 
        node-key="id"
        @node-expand="NodeClick"
        :expand-on-click-node="false"
        :default-expanded-keys="[1]"
        >
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <el-radio-group v-model="radio">
                <el-radio :label="data.orgId" @change="handleNodeClick(node, data)">
                    <i class="fa fa-folder-open"></i>
                    &nbsp;{{data.orgName}}
                </el-radio>
            </el-radio-group>
            <!-- <span>
                <i class="fa" :class="data.type ==='oz'?'fa-folder-open':'fa-bookmark'"></i>
                {{node.label}}
            </span> -->
        </span>
        </el-tree>
    </div>
</template>

<script>
    import { verify, API , tokenMessage , UserHeader} from "../../api/api";
    //机构
	let ORG_API = `${API}/CountryUserMgmt/org/v1`;
    export default {
        data() {
            return {
                radio:'',
                data:[],
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    id:100
                }
            }
        },
        created() {
            this.data = [];
            this.getRoot();
        },
        methods:{
            //获取根机构
            getRoot() {
                let Params= {"orgId" : UserHeader['X-User-OrgId'] };
                this.axios.post(`${ORG_API}/findByOrgId`,Params,{ headers : UserHeader }).then(res => {
					if(res.data.code == "Success") {
                        let arr = res.data.payload;
                        if(arr.isExistChild == 0){
                            arr.children = [];
                        }else{
                            arr.children = [{label:'',id:''}];
                        }
                        this.data.push(arr);
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
            //获取子节点
            getChildren(node) {
				let Params= {"orgId":node.orgId};
                this.axios.post(`${ORG_API}/findByParentId`,Params,{ headers : UserHeader }).then(res => {
					// console.log(res.data.payload);
                    if(res.data.code == "Success") {
                        let arr   =  res.data.payload;
                        node.children = [];
                        let child = node.children;
                        arr.map(value=>{
                            if(value.isExistChild == 0){
                                value.children = [];
                            }else{
                                value.children = [{label:'',id:''}];
                            }
                            child.push(value);
                        })
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
            NodeClick(node,data) {
				this.getChildren(node);
			},
            handleNodeClick(node,data) {
                this.$emit('handleTree',data);
            }
        }
    }
</script>

<style scoped>
    .tree{
        padding: 20px;
    }
</style>