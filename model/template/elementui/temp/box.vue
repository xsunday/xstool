
<!-- box -->
<template>
  <el-dialog :title="boxTitlePre + title" :visible.sync="visible" @open="openHandler" :fullscreen="false" @close="closeHandler">
    <el-form size="small" v-loading="boxLoading" status-icon :model="boxForm" label-width="80px" :rules="boxFormRules" ref="boxForm">

      
      <el-form-item label="编号" prop="bh">
        <el-input type="text" v-model="boxForm.bh"></el-input>
        </el-form-item>
      
      <el-form-item label="姓名" prop="name">
        <el-input type="text" v-model="boxForm.name"></el-input>
        </el-form-item>
      
      <el-form-item label="拼音" prop="pinyin">
        <el-input type="text" v-model="boxForm.pinyin"></el-input>
        </el-form-item>
      
      <el-form-item label="性别" prop="sex"></el-form-item>
      
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="boxForm.username"></el-input>
        </el-form-item>
      
      <el-form-item label="密码" prop="pass">
        <el-input type="text" v-model="boxForm.pass"></el-input>
        </el-form-item>
      
      <el-form-item label="手机" prop="mobile">
        <el-input type="text" v-model="boxForm.mobile"></el-input>
        </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-switch v-model="boxForm.status" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
      

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeHandler">取 消</el-button>
      <el-button size="small" type="primary" :loading="boxLoading" @click="submitHandler">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  //{&#34;bh&#34;:&#34;编号&#34;,&#34;name&#34;:&#34;姓名&#34;,&#34;pinyin&#34;:&#34;拼音&#34;,&#34;sex&#34;:&#34;性别&#34;,&#34;username&#34;:&#34;用户名&#34;,&#34;pass&#34;:&#34;密码&#34;,&#34;mobile&#34;:&#34;手机&#34;,&#34;status&#34;:&#34;状态&#34;}
  import { boxMixin } from '@/utils/mixins'
  //import request from '@/utils/request'
  export default {
    mixins: [boxMixin],
    components: { ElxDate },
    data() {
      return {
        boxUrl: "/a/b/adminSave", boxUrlSave: "/a/b/adminSave",
        boxForm: {
            bh : "",   name : "",   pinyin : "",   sex : "",   username : "",   pass : "",   mobile : "",   status : "",  
        },
        boxFormRules: {
          //title: [{ required: true, message: '标题不为空' }],
        }
      }
    },
    mounted() {
    },
    methods: {

    }
  }
</script>