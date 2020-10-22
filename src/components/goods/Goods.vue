<template>
  <div>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 导航区域 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Welcome' }"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 搜索框区域 -->
      <div class="users_box">
        <el-input
          clearable
          v-model="queryInfo.query"
          placeholder="请输入内容"
          class="users_int"
          @clear="TabularData"
        >
          <el-button
            slot="append"
            @click="TabularData"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-row class="users_but">
          <el-button type="primary" @click="AddUser">添加商品</el-button>
        </el-row>
      </div>
      <!--表格区域 -->
      <el-table border :data="goodslist" style="width: 100%" class="table">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="570">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建事件"> </el-table-column>
        <el-table-column label="操作">
          <!-- 按钮区域 -->
          <template slot-scope="scope">
            <!-- 点击编辑 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="ModifyThe"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteData(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域  -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      queryInfo: {
        // 表单页数据
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      ruleForm: {},
      goodslist: [], // 表单所有数据
      total: 0,
      name: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ]
    }
  },
  // 生命周期最先调用此方法
  created () {
    this.TabularData()
  },
  methods: {
    // 表格数据
    async TabularData () {
      // console.log('11')
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败数据')
      }
      // console.log(res.data)
      this.total = res.data.total
      this.goodslist = res.data.goods
      // console.log(this.total)
    },
    // 监听选择页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.TabularData()
    },
    // 监听页码de
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.TabularData()
    },
    // 点击编辑按钮
    ListUsers () {},
    // 点击上传按钮
    ModifyThe () {},
    // 点击添加商品跳转页面
    AddUser () {
      this.$router.push('/goods/add')
    },
    // 点击删除按钮
    async deleteData (id) {
      // console.log(id)

      const remover = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      // 确认confirm
      // 取消cancel
      // console.log(remover)
      if (remover !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.TabularData()
    },
    TypeError () {}
  }
}
</script>

<style lang="less" scoped>
.users_int {
  width: 35%;
}
.users_box {
  display: flex;
}
.users_int {
  width: 35%;
}
.users_but {
  margin-left: 30px;
}
.tab {
  margin-top: 20px;
  // text-align: center;
}

.table {
  margin-top: 20px !important;
  font-size: 12px;
}
.block {
  margin-top: 20px;
}
</style>
