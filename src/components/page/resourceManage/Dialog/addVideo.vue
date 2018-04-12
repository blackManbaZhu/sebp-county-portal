<template>
    <div>
        <el-dialog title="添加视频文件" :visible.sync="addMedia" :show-close="false" :close-on-click-modal="false">
            <!-- <el-form :model="form"> -->
                <el-upload
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :before-upload="beforeUpload"
                    :on-remove="onRemove"
                    :on-exceed="handleExceed"
                    :auto-upload="false"
                    :limit="1"
                    accept=".mp4"
                    >
                    <el-button size="small" type="primary">选择文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传MP4文件，若是其他（rm、rmvb、wmv、mkv、flv）格式，请转码为MP4格式</div>
                </el-upload>
            <!-- </el-form> -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="success" @click="submitUpload">上 传</el-button>
                <el-button type="primary" @click="save">创 建</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:[
            'addMedia'
        ],
        data() {
            return {
                fileType:''
            }
        },
        methods:{
            handleExceed(files, fileList) { //选择限制
                // console.log(files);
                this.$message.warning(`当前限制选择1个文件`);
            },
            onRemove() {
                this.fileType = '';
            },
            beforeUpload(file) { //上传之前
                this.fileType = file.name.split('.')[1];
                if(this.fileType != 'mp4'){
                    this.$message.error(`添加失败！当前文件格式不正确!`);
                    this.fileType = '';
                    return false;
                }
            },
            submitUpload() {
                 this.$refs.upload.submit();
            },
            save() {
                this.$emit('close');
            },
            cancel() {
                this.$emit('close');
            }
        }
    }
</script>

<style  scoped>

</style>
