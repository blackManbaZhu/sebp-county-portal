<template>
    <div>
        <el-dialog title="添加音频文件" :visible.sync="addMedia" :before-close="cancel" :close-on-click-modal="false">
            <!-- <el-form :model="form"> -->
                <el-upload
                    ref="upload"
                    :headers="headers"
                    :action="uploadUrl"
                    :before-upload="beforeUpload"
                    :on-remove="onRemove"
                    :on-exceed="handleExceed"
                    :on-success="uploadSuccess"
                    :on-error='uploadError'
                    :auto-upload="false"
                    :limit="1"
                    accept=".mp3,.m4a,.wav,.wma,.ogg,.amr,.3gp"
                    >
                    <el-button size="small" type="primary">选择文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传mp3/m4a/wav/wma/ogg/amr/3gp文件</div>
                </el-upload>
            <!-- </el-form> -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="success" @click="submitUpload">上 传</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { verify , API,  Headers , getTime, getHMStime } from "../../../../api/api.js";
    //上传音频
    let TX_API = `${API}/zuul/CountryResMgmt/media/v1`;
    export default {
        props:[
            'addMedia'
        ],
        data() {
            return {
                fileType:'',
                //上传接口 
                uploadUrl:`${TX_API}/uploadMusic`,
                //请求头
                headers: Headers
            }
        },
        methods:{
            handleExceed(files, fileList) { //选择限制
                this.$message.warning(`当前限制选择1个文件`);
            },
            onRemove() {
                this.fileType = '';
            },
            beforeUpload(file) { //上传之前
                this.fileType = file.name.split('.')[1];
                const size    = file.size / 1024 / 1024 < 20;
                if(this.fileType != 'mp3' && this.fileType != 'MP3' && this.fileType != 'm4a' && this.fileType != 'M4A'
                && this.fileType != 'wav' && this.fileType != 'WAV' && this.fileType != 'wma' && this.fileType != 'WMA'
                && this.fileType != 'ogg' && this.fileType != 'OGG' && this.fileType != 'amr' && this.fileType != 'AMR'
                && this.fileType != '3gp' && this.fileType != '3GP'
                ){
                    this.$message.error(`添加失败！当前文件格式不正确!`);
                    this.fileType = '';
                    return false;
                }
                if(!size){
                    this.$message({type:'error',message:'添加失败，文件大小不能超过20M!'});
                }
            },
            uploadSuccess(res) { //上传成功
                if(res.code == "Success"){
                    this.$message({type:'success',duration:1200,message:'上传成功!'});
                    //关闭弹窗
                    this.$emit('close'); 
                }else{
                    this.$message({type:'error', message: res.message});
                }
                this.$refs.upload.clearFiles();
            },
            uploadError(err) { //上传失败
                this.$message({type:'error',message:'上传失败，请重新上传!'});
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            cancel() {
                this.$refs.upload.clearFiles();
                this.$emit('close');
            }
        }
    }
</script>

<style  scoped>

</style>
