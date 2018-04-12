<template>
  <!-- 添加设备 弹窗 -->
		<el-dialog title="添加设备" :visible.sync="addDialog" :show-close="false" :close-on-click-modal="false">
			<el-form :model="form" :rules="rules" ref="form" :label-position="'right'">
				<el-row :gutter="60">
					<el-col :span="8">
						<div class="grid-content bg-purple">
							<el-form-item label="设备编号" :label-width="formLabelWidth" prop="number">
								<el-input v-model="form.number" auto-complete="off"></el-input>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="grid-content bg-purple-light">
							<el-form-item label="设备名称" :label-width="formLabelWidth" prop="name">
								<el-input v-model="form.name" auto-complete="off"></el-input>
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row :gutter="60">
					<el-col :span="8">
						<div class="grid-content bg-purple">
							<el-form-item label="网络类型" :label-width="formLabelWidth" prop="networkType">
								<el-select v-model="form.networkType" placeholder="网络类型">
									<el-option label="无线" value="无线"></el-option>
									<el-option label="有线" value="有线"></el-option>
								</el-select>
    						</el-form-item>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="grid-content bg-purple-light">
							<el-form-item label="手机号" :label-width="formLabelWidth" >
								<el-input @blur="verifyPhone()" v-model="form.phone" auto-complete="off"></el-input>
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="6">
						<div class="grid-content bg-purple">
							<el-form-item label="经纬度" :label-width="formLabelWidth" prop="lineStart">
								<el-input @blur="verifyLine" v-model="form.lineStart" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="" :label-width="formLabelWidth" prop="lineEnd">
								<el-input @blur="verifyLine" v-model="form.lineEnd" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="" :label-width="formLabelWidth">
								<el-button @click="handlePoint()" type="primary" plain>打开地图选择</el-button>
							</el-form-item>
						</div>
					</el-col>
					<div id="allmap" v-show="MapShow"></div>
				</el-row>
				<el-row :gutter="60">
					<el-col :span="8">
						<div class="grid-content bg-purple">
							<el-form-item label="所属机构" :label-width="formLabelWidth" prop="tissue">
								<!-- <el-input v-model="form.name" auto-complete="off"></el-input> -->
								<el-cascader  v-model="form.tissue"
								:options="options"
								:show-all-levels="false"
								change-on-select
								></el-cascader>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="grid-content bg-purple">
							<el-form-item label="所属业务组" :label-width="formLabelWidth">
								<el-select v-model="form.businessGroup" placeholder="请选择网络类型">
									<!-- <el-option
										v-for="item in options"
										:key="item.value"
										:label="item.label"
										:value="item.value">
									</el-option> -->
								</el-select>
    						</el-form-item>
						</div>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="Save('form')">确 定</el-button>
			</div>
		</el-dialog>
</template>

<script>
    let verify = {
		phone (number){
			var flag;
			var myreg = /^[1][1,2,3,4,5,7,8,9][0-9]{9}$/;  
			if (!myreg.test(number) && number != ''){  
				flag = false;  
			} else {  
				flag =  true;  
			}
			return flag;
		},
		//经度
		lineStart(number){
			var flag;
			var myreg = /^-?(?:(?:180(?:\.0{1,5})?)|(?:(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d{1,6})?))$/;
			if (!myreg.test(number) && number != '') {  
				flag = false;  
			} else {  
				flag = true;  
			}
			return flag;
		},
		//纬度
		lineEnd(number){
			var flag;
			var myreg = /^-?(?:90(?:\.0{1,5})?|(?:[1-8]?\d(?:\.\d{1,6})?))$/;
			if (!myreg.test(number) && number != '') {  
				flag = false;  
			} else {  
				flag = true;  
			}
			return flag;
		}
	};
    export default {
        props:['addDialog'],
        data() {
            return {
				MapShow:false,
                formLabelWidth:'100px',
				form:{
					number: '',
					name: '',
					networkType: '',
					phone:'',
					lineStart:'',
					lineEnd:'',
					tissue:[],
					businessGroup:'业务组1'
				},
				options: [{
					value: '机构一',
					label: '机构一',
					children: [{
						value: '二级机构',
						label: '二级机构',
						children: [{
							value: '三级机构',
							label: '三级机构'
						},{
							value: '三级机构',
							label: '三级机构'
						},{
							value: '三级机构',
							label: '三级机构'
						},{
							value: '三级机构',
							label: '三级机构'
						}]
					}]
				}],
                rules: {
					name: [
						{ required: true, message: '请输入设备名称', trigger: 'blur' }
					],
					number: [
						{ required: true, message: '请输入设备编号', trigger: 'blur' }
					],
					networkType: [
						{ required: true, message: '请选择网络类型', trigger: 'change' }
					],
					lineStart: [
						{ required: true, message: '请输入经度', trigger: 'blur' }
					],
					lineEnd: [
						{ required: true, message: '请输入纬度', trigger: 'blur' }
					],
					tissue: [
						{ required: true, message: '请选择所属机构', trigger: 'change' }
					]
            	}
            }
        },
        methods:{
            Save(form) {
				this.$refs[form].validate((valid) => {
					let flag1= verify.phone(this.form.phone);
					let flag2= verify.lineStart(this.form.lineStart);
					let flag3= verify.lineEnd(this.form.lineEnd);
					if (valid) {
						if( !flag1 ) {
							this.$message.error('手机号格式不正确！！！');
							return false;
						}
						if( !flag2 && !flag3 ){
							this.$message.error('经纬度格式不正确！！！');
							return false;
						}
						console.log(this.form);
						this.form       = {};
						this.form.phone = '';
						this.MapShow    = false;
                        this.close();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			verifyPhone() {
				let flag1= verify.phone(this.form.phone);
				if(!flag1){
					this.$message.error('手机号格式不正确！！！');
				}
			},
			verifyLine(form) {
				let flag1= verify.lineStart(this.form.lineStart);
				let flag2= verify.lineEnd(this.form.lineEnd);
				if(!flag1){
					this.$message.error('经度格式不正确！！！');
				}
				if(!flag2){
					this.$message.error('纬度格式不正确！！！');
				}
			},
            handlePoint() {
				// 百度地图API功能
				this.MapShow = true;
				var _this = this;
				var map = new BMap.Map("allmap");
				var point = new BMap.Point(118.803625,32.04);
				map.centerAndZoom(point,12);
				var geoc = new BMap.Geocoder();    
				map.addEventListener("click", function(e){        
					var pt = e.point;
					console.log(pt); 
					_this.MapShow = false; 
					_this.form.lineStart = pt['lng'];   
					_this.form.lineEnd = pt["lat"];
				});
			},
            close() {
                this.$emit('closeDialog');
                this.form = {};
            }
        }
    }
</script>

<style scoped>
    #allmap {width:100%;height:500px;}
</style>
