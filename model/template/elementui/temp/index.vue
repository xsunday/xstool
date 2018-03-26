<template>
  <section>
    <!--搜索栏-->
    <el-col :span="12" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="tbSearch" size="small">
        <el-form-item>
          <el-input type="text" v-model.lazy="tbSearch.key" placeholder="关键字" suffix-icon="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="tbListLoad">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="tbAdd">新增</el-button>
          <i class="el-icon-question"></i>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table size="small" :data="tbList" v-loading="tbLoading" @selection-change="tbSelectChange" sortable="custom" @sort-change="tbSortChange">

      <el-table-column type="selection" width="55"></el-table-column>

      
        <el-table-column prop="bh" label="编号"></el-table-column>
      
        <el-table-column prop="name" label="姓名"></el-table-column>
      
        <el-table-column prop="pinyin" label="拼音"></el-table-column>
      
        <el-table-column prop="sex" label="性别"></el-table-column>
      
        <el-table-column prop="username" label="用户名"></el-table-column>
      
        <el-table-column prop="pass" label="密码"></el-table-column>
      
        <el-table-column prop="mobile" label="手机"></el-table-column>
      
        <el-table-column prop="status" label="状态"></el-table-column>
      
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button-group size="small">
            <el-button @click="tbAdd(scope.row)" size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="tbDel(scope.row)" size="mini" type="danger" icon="el-icon-delete"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- page -->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRepass" :disabled="this.sels.length===0">批量重置密码</el-button> -->
      <el-pagination @current-change="tbPageChange" :page-size="20" :total="tbTotalCount">
      </el-pagination>
    </el-col>

    <el-col :span="12" style="text-align: right">
      <el-button size="small" type="primary" @click="tbBatchDel" :disabled="tbSelects.length==0">批量删除</el-button>
    </el-col>

    <admin-box :show.sync="boxShow" title="用户" :row="boxParam" @submit="boxSubmit"></admin-box>
  </section>
</template>

<script>
  // {&#34;bh&#34;:&#34;编号&#34;,&#34;name&#34;:&#34;姓名&#34;,&#34;pinyin&#34;:&#34;拼音&#34;,&#34;sex&#34;:&#34;性别&#34;,&#34;username&#34;:&#34;用户名&#34;,&#34;pass&#34;:&#34;密码&#34;,&#34;mobile&#34;:&#34;手机&#34;,&#34;status&#34;:&#34;状态&#34;}
  import { tableMixin } from '@/util/mixins'

  import adminBox from './adminBox';

  export default {
    mixins: [tableMixin],

    components: { adminBox },

  data() {
    return {
      tbUrl: "/a/b/admin", tbUrlDel: "/a/b/adminDel",
    }
  },
  }
</script>