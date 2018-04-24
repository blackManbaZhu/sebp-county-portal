<template>
    <div>
		<div class="custom-tree-container">
			<div class="block">
				<el-tree
					:data="dataList"
					show-checkbox
					node-key="id"
					:expand-on-click-node="false"
					:default-expanded-keys="[1]"
					@node-expand="NodeClick">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span>
                            <i class="fa fa-folder-open"></i>
                            {{ data.orgName }}&nbsp; {{"( 机构ID: "+data.orgId+" )"}}
                        </span>
						<span v-if="data.areaId"> 
						 {{data.areaName}}: ( {{ data.areaId }} )
						</span>
						<span>
							<el-button
								v-if="data.orgId != orgid"
								type="text"
								size="mini"
								@click="() => remove(node, data)">
								删除
							</el-button>
							<el-button
							    v-if="data.orgId != orgid"
								type="text"
								size="mini"
								@click="() => edit(node, data)">
								编辑
							</el-button>
							<el-button
								type="text"
								size="mini"
								@click="() => append(node,data)">
								添加
							</el-button>
						</span>
					</span>
    			</el-tree>
			</div>
		</div>


		<!-- 添加机构弹出框 -->
		<el-dialog title="添加机构" :visible.sync="dialogFormVisible" @close="clearAddForm" :close-on-click-modal="false">
			<el-form :model="form" :rules="rules"  ref="form" label-width="120px">
				<el-form-item label="机构名称" prop="name">
					<el-input  type="text" v-model="form.name" placeholder="请输入机构名"></el-input>
				</el-form-item>
				<el-form-item label="机构描述">
					<el-input type="text" v-model="form.res" placeholder="请输入机构描述"></el-input>
				</el-form-item>
				<el-form-item label="行政区域代码" prop="areaId">
					<el-input type="text" disabled v-model="form.areaId" placeholder="请输入行政区域代码"></el-input>
					<el-button style="margin-top:10px;" type="primary" @click="openAreaIdOne()">选 择</el-button>
				</el-form-item>
				<el-dialog
					width="50%"
					title="选择行政编码"
					@close="closeAddOrg"
					:visible.sync="innerVisible1"
					:close-on-click-modal="false"
					append-to-body>
					<div style="height:360px;overflow:auto;">
						 <el-tree 
							:data="areaIdTreeOne"
							node-key="id"
							@node-expand="areaNodeFind"
							:expand-on-click-node="true"
							>
							<span class="custom-tree-node" slot-scope="{ node, data }">
								
								<el-radio-group v-model="radio">
									<el-radio :label="node.id" @change="handleNodeClick(node, data)">
										<i class="fa fa-folder-open"></i>
										&nbsp;{{data.areaName}} &nbsp;{{data.areaId}} 
									</el-radio>
								</el-radio-group>
							</span>
						</el-tree>
					</div>
					<div slot="footer" class="dialog-footer" style="text-align: center;">
						<!-- <el-button @click="innerVisible1=false">取 消</el-button> -->
						<el-button type="primary" @click="innerVisible1=false">确 认</el-button>
					</div>
				</el-dialog>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false,form.name = '',form.areaId= '',form.des=''">取 消</el-button>
				<el-button type="primary" @click ="add('form')">添 加</el-button>
			</div>
		</el-dialog>


		<!-- 编辑机构弹窗 -->
		<el-dialog title="编辑机构" :visible.sync="dialogEditVisible" @close="clearEditForm" :close-on-click-modal="false">
			<el-form :model="Edit" :rules="rules" ref="Edit" label-width="120px">
				<el-form-item label="机构名称"  prop="name">
					<el-input type="text" v-model="Edit.name" placeholder="请修改机构名"></el-input>
				</el-form-item>
				<el-form-item label="机构描述">
					<el-input type="text" v-model="Edit.res" placeholder="请输入机构描述"></el-input>
				</el-form-item>
				<el-form-item label="行政区域代码" prop="areaId">
					<el-input type="text" disabled v-model="Edit.areaId" placeholder="请输入行政区域代码"></el-input>
					<el-button style="margin-top:10px;" type="primary" @click="openAreaIdTwo()">选 择</el-button>
				</el-form-item>
				<el-dialog
					width="50%"
					title="选择行政编码"
					@close="closeEditOrg"
					:visible.sync="innerVisible2"
					:close-on-click-modal="false"
					append-to-body>
					<div style="height:360px;overflow:auto;">
						 <el-tree 
							:data="areaIdTreeTwo"
							node-key="id"
							@node-expand="areaNodeFind"
							:expand-on-click-node="true"
							>
							<span class="custom-tree-node" slot-scope="{ node, data }">
								
								<el-radio-group v-model="radio">
									<el-radio :label="node.id" @change="handleNodeClick(node, data)">
										<i class="fa fa-folder-open"></i>
										&nbsp;{{data.areaName}} &nbsp;{{data.areaId}} 
									</el-radio>
								</el-radio-group>
							</span>
						</el-tree>
					</div>
					<div slot="footer" class="dialog-footer" style="text-align: center;">
						<!-- <el-button @click="innerVisible2=false">取 消</el-button> -->
						<el-button type="primary" @click="innerVisible2=false">确 认</el-button>
					</div>
				</el-dialog>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogEditVisible = false,Edit.name = '',Edit.areaId = '',Edit.des=''">取 消</el-button>
				<el-button type="primary" @click ="SaveEdit('Edit')">修 改</el-button>
			</div>
		</el-dialog>


	</div>
</template>

<script>
	import { verify, API ,trim, tokenMessage , Headers ,UserHeader} from "../../../api/api";
	//机构
	let ORG_API  = `${API}/CountryUserMgmt/org/v1`;
	//行政编码
	let AREA_API = `${API}/CountryConfigMgmt/area/v1`

    export default {
		data () {
			return {
				orgid:UserHeader['X-User-OrgId'], //如果是根机构 不可以删除
				//记录编辑机构
				EditData:[],
				//记录新增机构
				childrenData:[],
				//新增行政区域编码
				areaIdTreeOne:[],
				//编辑行政区域编码
				areaIdTreeTwo:[],
				//机构树
				dataList:[],
				radio:'',
				//新增表单
				form:{ 
					name:'',
					areaId:'' ,
					des:''
				},
				//编辑表单
				Edit:{ 
					name:'',
					areaId:'',
					des:'',
					areaName:''
				},
				rules: {
					name: [{ required: true, message: '请输入机构名称'}],
					areaId: [{ required: true, message: '请选择行政编码'}]
				},
				//弹框
				innerVisible1:false,
				innerVisible2:false,
				dialogVisible:false,
				dialogEditVisible:false,
				dialogFormVisible: false,
			};
		},
		created() {
			//初始化数据
			this.getRoot();
		},
		methods: {
			getRoot(){
				//获取根节点信息
				let Params= {"orgId": UserHeader['X-User-OrgId']};
                this.axios.post(`${ORG_API}/findByOrgId`,Params,{ headers: UserHeader }).then(res => {
					if(res.data.code == "Success") {
						let arr = res.data.payload;
						if(arr.isExistChild == 0){
							arr.children = [];
						}else {
							arr.children = [{label:'',id:''}];
						}
						this.dataList.push(arr);
						
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
			getChildren(data) {
				//获取子节点信息
				let Params= {"orgId":data.orgId};
                this.axios.post(`${ORG_API}/findByParentId`,Params,{ headers : UserHeader}).then(res => {
					if(res.data.code == "Success") {
						let arr       =  res.data.payload;
						data.children = [];
						let child     = data.children;
						arr.map(value=>{
							if(value.isExistChild == 0){
								value.children = [];
							}else{
								value.children = [{label:'',id:''}];
							}
							child.push(value);
						})
						// console.log(child)
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
			NodeClick(data, node) { 
				//选择节点
				this.getChildren(data);
			},

			openAreaIdOne() {  
				//点击获取省 新增
				this.axios.get(`${AREA_API}/findShengArea`,{ headers : UserHeader }).then(res => {
					if(res.data.code == "Success") {
						let array = res.data.payload;

						this.areaIdTreeOne = array.map(value =>{
							value.children = [{areaId:'',areaName:''}];
							return value;
						})

						if(this.areaIdTreeOne.length) {
							this.innerVisible1=true
						}

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
			openAreaIdTwo() {  
				//点击获取省 编辑
				this.axios.get(`${AREA_API}/findShengArea`,{ headers : UserHeader }).then(res => {
					if(res.data.code == "Success") {
						let array = res.data.payload;

						this.areaIdTreeTwo = array.map(value =>{
							value.children = [{areaId:'',areaName:''}];
							return value;
						})

						if(this.areaIdTreeTwo.length) {
							this.innerVisible2=true
						}

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

			areaNodeFind(data) { 
				//行政编码子节点展开
				let areaId = data.areaId;
				let Params= {"areaId":areaId};
                this.axios.post(`${AREA_API}/findByParentId`,Params,{ headers : UserHeader }).then(res => {
					if(res.data.code == "Success") {
						let arr       = res.data.payload
						data.children = [];
						let child     = data.children;
						arr.map(value=>{
                            value.children = [];
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

			//关闭行政编码弹窗
			closeAddOrg() {
				this.areaIdTreeOne = [];
			},

			//关闭行政编码弹窗
			closeEditOrg() {
				this.areaIdTreeTwo = [];
			},

			handleNodeClick(node,data) { 
				//选择行政编码
				this.form.areaId   = data.areaId;
				this.Edit.areaId   = data.areaId;
				this.Edit.areaName = data.areaName;
			},
			//添加子机构
			append(node,data) {
				this.dialogFormVisible = true;
				this.childrenData      = data;
			},
			//删除机构
			remove(node, data) {
				this.$confirm('确认删除该机构吗?', '提示', {
					type: 'warning'
				}).then(() => {
                    var parent   = node.parent;
					var children = parent.data.children || parent.data;
					var index    = children.findIndex(d => d.orgId === data.orgId);

					let Params= {"orgId":data.orgId};
					this.axios.post(`${ORG_API}/deleteByOrgId`,Params,{ headers : UserHeader }).then(res => {
						
						if(res.data.code == "Success") {
							this.deletMessage();
							children.splice(index, 1);
						}
						else {

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
				}).catch(() => {
					console.log("出错!!")
				});
			},



			edit(node, data) { 
				//编辑机构信息

				this.EditData          = data;

				this.dialogEditVisible = true;

				let Params= {"orgId":data.parentId};

                this.axios.post(`${ORG_API}/findByParentId`,Params,{ headers : UserHeader }).then(res => {
					if(res.data.code == "Success") {
						//获取机构数据
						let arr       =  res.data.payload;
						var obj;
						arr.map(value => {
							if(value.areaName == data.areaName){
								obj = value;
							}
						})
						this.Edit.name         = obj.orgName;
						this.Edit.areaId       = obj.areaId;
						this.Edit.res          = obj.orgDesc ? obj.orgDesc :'';
						this.Edit.areaName     = obj.areaName;
						// console.log(obj)
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
			//保存编辑
			SaveEdit(formName) {
				 this.$refs[formName].validate((valid) => {
					 if(valid) {
							var flag = this.nameVerify(trim(this.Edit.name));
							var res  = this.descVerify(trim(this.Edit.res));
							if(!flag){
								this.formatError();
								return false;
							}
							if( !res && this.Edit.res) {
								this.desError();
								return false;
							}

							let orgName = trim(this.Edit.name);
							let orgId   = this.EditData.orgId;
							let areaId  = this.Edit.areaId;
							let orgDesc = trim(this.Edit.res);


							let Params= {"orgName":orgName,"orgDesc":orgDesc,'orgId':orgId,"areaId":areaId};


							this.axios.post(`${ORG_API}/updateByOrgId`,Params,{ headers : UserHeader }).then(res => {
								if(res.data.code == "Success") {
									this.successMessage();
									
									this.EditData.orgName  = this.Edit.name;
									this.EditData.areaId   = this.Edit.areaId;
									this.EditData.areaName = this.Edit.areaName;
									this.dialogEditVisible = false;
									this.Edit.name         = this.Edit.areaId = '';
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
									message: err.message,
									type: 'warning'
								});
							});
					 }else {
						 return false;
					 }
				 })
			},
			//新增机构
			add(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid){
						var flag = this.nameVerify(trim(this.form.name));
						var res  = this.descVerify(trim(this.form.res));

						if(!flag){
							this.formatError();
							return false;
						}
						if(!res && this.form.res) {
							this.desError();
							return false;
						}
						
						let orgName = trim(this.form.name);
						let parentId= this.childrenData.orgId;
						let areaId  = this.form.areaId;
						let orgDesc = trim(this.form.res);

						let Params= {"orgName":orgName,"orgDesc":orgDesc, 'parentId':parentId,"areaId":areaId};

						// console.log(Params)

						this.axios.post(`${ORG_API}/saveOrg`,Params,{ headers : UserHeader }).then(res => {
							if(res.data.code == "Success") {

								this.getChildren(this.childrenData)
								
								this.successMessage();

								this.form.name = this.form.areaId = '';

								this.dialogFormVisible = false;

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
					}else {
						return false;
					}
        		});
			},
			nameVerify(name) {
				var flag;
				var myreg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,64}$/;  
				if (!myreg.test(name)){  
					flag = false;  
				} else {  
					flag =  true;  
				}
				return flag;
			},
			descVerify(name) {
				var flag;
				var myreg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,128}$/;  
				if (!myreg.test(name)){  
					flag = false;  
				} else {  
					flag =  true;  
				}
				return flag;
			},

			clearAddForm() {
				this.areaIdTreeOne = [];

				//清空数据
				this.form = { 
					name:'',
					areaId:'' ,
					des:''
				};

				this.$refs['form'].resetFields();

			},
			clearEditForm() {
				this.areaIdTreeTwo = [];

				this.Edit = { 
					name:'',
					areaId:'',
					des:''
				};
				//关闭表单验证
				this.$refs['Edit'].resetFields();
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
					message:'机构名格式不正确，只能输入中文，英文和数字且不能超过64字符！'
				});
			},
			desError() {
				this.$message({
					type:'error',
					duration:1200,
					message:'机构描述格式不正确，只能输入中文，英文和数字且不能超过128字符！'
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


			// verifyOrg(node) {
			// 	console.log(node);
			// }
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