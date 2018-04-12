<template>
    <div>
		<div class="custom-tree-container">
			<el-button style="margin-top:15px;" @click="BtnAdd()"><i class="fa fa-folder-open"></i>&nbsp; 添加根机构</el-button>
            <!-- <el-button style="margin-top:15px;">
				<i class="fa fa-bookmark"></i>&nbsp; 添加业务组</el-button> -->
			<div class="block">
				<el-tree
					:data="dataList"
					show-checkbox
					node-key="id"
					:expand-on-click-node="false"
					:default-expanded-keys="[1]">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span>
                            <i class="fa fa-folder-open"></i>
                            {{ node.label }}&nbsp; {{"( id: "+data.id+" )"}}
                        </span>
						<span v-if="data.areaId"> 行政区域代码：
							{{ data.areaId }}
						</span>
						<span>
							<el-button
								type="text"
								size="mini"
								@click="() => append(node,data)">
								添加
							</el-button>
							<el-button
								type="text"
								size="mini"
								@click="() => edit(node, data)">
								编辑
							</el-button>
							<el-button
								type="text"
								size="mini"
								@click="() => remove(node, data)">
								删除
							</el-button>
						</span>
					</span>
    			</el-tree>
			</div>
		</div>
		<!-- 弹出框 -->
		<el-dialog title="添加机构" :visible.sync="dialogFormVisible">
			<el-form :model="form" :rules="rules"  ref="form">
				<el-form-item label="机构名称" :label-width="formLabelWidth" prop="name">
					<el-input :maxlength="60" type="text" v-model="form.name" placeholder="请输入机构名"></el-input>
				</el-form-item>
				<el-form-item label="机构描述" :label-width="formLabelWidth">
					<el-input :maxlength="60" type="text" v-model="form.des" placeholder="请输入机构名"></el-input>
				</el-form-item>
				<el-form-item label="行政区域代码" :label-width="formLabelWidth">
					<el-input type="text" v-model="form.areaId" placeholder="请输入行政区域代码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false,parentNode = false,childrenNode = false,form.name = '',form.areaId= ''">取 消</el-button>
				<el-button type="primary" @click ="add('form')">添 加</el-button>
			</div>
		</el-dialog>
		<el-dialog title="编辑机构" :visible.sync="dialogEditVisible">
			<el-form :model="Edit" :rules="rules" ref="Edit">
				<el-form-item label="机构名称" :label-width="formLabelWidth" prop="name">
					<el-input type="text" v-model="Edit.name" placeholder="请修改机构名"></el-input>
				</el-form-item>
				<el-form-item label="行政区域代码" :label-width="formLabelWidth">
					<el-input type="text" v-model="Edit.areaId" placeholder="请输入行政区域代码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogEditVisible = false,Edit.name = '',Edit.areaId = ''">取 消</el-button>
				<el-button type="primary" @click ="SaveEdit('Edit')">修 改</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
    var localData = {
		save(key,value){
			localStorage.setItem(key,JSON.stringify(value));
		},
		getData(key){
			return JSON.parse(localStorage.getItem(key)) || [];
		}
	};
    export default {
		data () {
			const data = localData.getData('data-list') || [];
			return {
				EditIndex:'',
				EditData:[],
				childrenData:[],
				orgNameVerify:[],
				dataList: JSON.parse(JSON.stringify(data)),
				form:{ name:'',areaId:'' ,des:''},
				Edit:{ name:'',areaId:'' },
				beforeEditName:'',
				rules: {
					name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
					// areaId: [{ required: true, message: '请输入行政区域代码', trigger: 'blur' }]
				},
				disabl:true,
				parentNode:false,
				childrenNode:false,
				dialogVisible:false,
				dialogEditVisible:false,
				dialogFormVisible: false,
				formLabelWidth: '120px',
			};
		},
		watch:{
			//深监控
			dataList:{
				handler:function(){
					localData.save("data-list",this.dataList);
				}, 
				deep:true
			}
		},
		methods: {
			//添加子机构
			append(node,data) {
				this.parentNode        = false;
				this.childrenNode      = true;
				this.dialogFormVisible = true;
				this.childrenData      = data;
				this.verifyOrg(node);
			},
			//删除机构
			remove(node, data) {
				this.$confirm('确认删除该机构吗?', '提示', {
					type: 'warning'
				}).then(() => {
                    const parent   = node.parent;
					const children = parent.data.children || parent.data;
					const index    = children.findIndex(d => d.id === data.id);
					children.splice(index, 1);
					this.deletMessage();
				}).catch(() => {
					console.log("出错!!")
				});
				
			},
			edit(node, data) {
				const parent   = node.parent;
				const children = parent.data.children || parent.data;
				this.dialogEditVisible = true;
				this.Edit.name         = data.label;
				this.Edit.areaId       = data.areaId;
				this.EditIndex         = children.findIndex(d => d.id === data.id);
				this.EditData          = children;
				this.beforeEditName    = this.Edit.name;
				if(!node.parent.label){
					this.orgNameVerify = this.dataList;
				}else{
					this.orgNameVerify = node.parent.childNodes;
				}
			},
			//保持编辑
			SaveEdit(formName) {
				 this.$refs[formName].validate((valid) => {
					 if(valid) {
						 	let arr = this.orgNameVerify;
							if(this.Edit.name == this.beforeEditName){
								 	this.dialogEditVisible = false;
									this.successMessage();
							}else{
								for(let i=0;i<arr.length;i++){
									if(this.Edit.name == arr[i].label){
										this.NameError();
										return false;
									}
						 		}
							}
							this.EditData[this.EditIndex].label  = this.Edit.name;
							this.EditData[this.EditIndex].areaId = this.Edit.areaId;
							this.dialogEditVisible = false;
							this.Edit.name = this.Edit.areaId = '';
							this.successMessage();
					 }else {
						 return false;
					 }
				 })
			},
			//按钮添加主机构
			BtnAdd() {
				this.parentNode        = true;
				this.dialogFormVisible = true;
				this.childrenNode      = false;
				let name = this.form.name;
			},
			add(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid){
						var flag = this.nameVerify(this.form.name);
						if(!flag){
							this.formatError();
							return false;
						}
						if(this.parentNode){
							let arr = this.dataList;
							for(let i=0;i<arr.length;i++){
								if(this.form.name == arr[i].label){
									this.NameError();
									return false;
								}
							}
							let newChild   = { id:arr.length+1, label:this.form.name ,areaId:this.form.areaId ,children : [] ,describe:this.form.des };
							arr.push(newChild);
						}
						if(this.childrenNode){
							let arr   = this.childrenData.children;
							let index = this.childrenData.id;
							for(let i =0;i<arr.length;i++){
								if(this.form.name == arr[i].label ){
									this.NameError();
									return false;
								}
							}
							let newChild = { id:index*10+1, label: this.form.name,areaId:this.form.areaId , children: [] ,describe:this.form.des};
							if (!arr) {
								this.$set(this.childrenData, 'children', []);
							}
							arr.push(newChild);
						}
						this.form.name = this.form.areaId = '';
						this.dialogFormVisible = false;
						this.successMessage();
					}else {
						// this.$message.error('必填，请输入机构名！！！');
						return false;
					}
        		});
			},
			nameVerify(name) {
				var flag;
				var myreg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;  
				if (!myreg.test(name)){  
					flag = false;  
				} else {  
					flag =  true;  
				}
				return flag;
			},
			NameError() {
				this.$message({
					type:'error',
					duration:1200,
					message:'机构名不能和同级机构名相同！'
				});
			},
			formatError() {
				this.$message({
					type:'error',
					duration:1200,
					message:'机构名格式不正确！'
				});
			},
			successMessage() {
				this.$message({
					type:'success',
					duration:1200,
					message:'保存成功'
				});
			},
			deletMessage() {
				this.$message({
					type:'success',
					duration:1200,
					message:'删除成功'
				});
			},
			verifyOrg(node) {
				console.log(node);
			}
		}
	}
</script>

<style scoped>
    .custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
	.block{
		border:1px solid #dcdfe6;
		margin-top:15px;
		padding:10px;
	}
</style>