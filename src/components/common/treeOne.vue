<template>
    <div class="tree">
        <el-tree 
        :data="data" 
        :props="defaultProps" 
        node-key="id"
        
        :expand-on-click-node="false"
        :default-expanded-keys="[1]"
        >
        <span class="custom-tree-node" slot-scope="{ node, data }">
            
            <el-radio-group v-model="radio">
                <el-radio :label="node.id" @change="handleNodeClick(node, data)">
                    <i class="fa" :class="data.type ==='oz'?'fa-folder-open':'fa-bookmark'"></i>
                    &nbsp;{{node.label}}
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
    export default {
        props:[
            'datalist'
        ],
        data() {
            return {
                radio:'',
                data:this.datalist,
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    id:100
                }
            }
        },
        methods:{
            handleNodeClick(node,data) {
                console.log(data);
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