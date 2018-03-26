
<!-- box -->
<template>
  <el-dialog :title="boxTitlePre + title" :visible.sync="visible" @open="openHandler" :fullscreen="false" @close="closeHandler">
    <el-form size="small" v-loading="boxLoading" status-icon :model="boxForm" label-width="80px" :rules="boxFormRules" ref="boxForm">

      
      <el-form-item label="分组id" prop="gid">
        <el-input type="text" v-model="boxForm.gid"></el-input>
        </el-form-item>
      
      <el-form-item label="管理员用户名" prop="username">
        <el-input type="text" v-model="boxForm.username"></el-input>
        </el-form-item>
      
      <el-form-item label="管理员密码" prop="pwd">
        <el-input type="text" v-model="boxForm.pwd"></el-input>
        </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" v-model="boxForm.email"></el-input>
        </el-form-item>
      
      <el-form-item label="真实姓名" prop="realname">
        <el-input type="text" v-model="boxForm.realname"></el-input>
        </el-form-item>
      
      <el-form-item label="电话号码" prop="tel">
        <el-input type="text" v-model="boxForm.tel"></el-input>
        </el-form-item>
      
      <el-form-item label="登陆次数" prop="hits">
        <el-input type="text" v-model="boxForm.hits"></el-input>
        </el-form-item>
      
      <el-form-item label="IP地址" prop="ip">
        <el-input type="text" v-model="boxForm.ip"></el-input>
        </el-form-item>
      
      <el-form-item label="创建时间" prop="addtime">
        <el-input type="text" v-model="boxForm.addtime"></el-input>
        </el-form-item>
      
      <el-form-item label="传递修改密码参数加密" prop="mdemail">
        <el-input type="text" v-model="boxForm.mdemail"></el-input>
        </el-form-item>
      
      <el-form-item label="审核状态" prop="status">
        <el-input type="text" v-model="boxForm.status"></el-input>
        </el-form-item>
      
      <el-form-item label="登录时间" prop="logintime">
        <el-input type="text" v-model="boxForm.logintime"></el-input>
        </el-form-item>
      
      <el-form-item label="微信id" prop="openid">
        <el-input type="text" v-model="boxForm.openid"></el-input>
        </el-form-item>
      
      <el-form-item label="上次登录时间" prop="prelogintime">
        <el-input type="text" v-model="boxForm.prelogintime"></el-input>
        </el-form-item>
      

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeHandler">取 消</el-button>
      <el-button size="small" type="primary" :loading="boxLoading" @click="submitHandler">确 定</el-button>
    </span>
  </el-dialog>
</template>
