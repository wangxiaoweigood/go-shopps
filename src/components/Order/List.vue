<template>
  <div>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 导航区 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 搜索区 -->
      <div class="users_box">
        <el-input
          clearable
          placeholder="请输入内容"
          v-model="queryInfo.query"
          class="users_int"
          @clear="OrderList"
        >
          <el-button
            slot="append"
            @click="OrderList"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div>
      <!-- 表单区 -->
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="#" type="index"> </el-table-column>
        <el-table-column prop="create_time" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="is_send" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row === '是'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <template>
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="ModifyThe"
            ></el-button>
            <!-- 地址按钮 -->
            <el-button
              size="mini"
              type="success"
              icon="el-icon-s-promotion"
              @click="deleteData"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
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
      <!-- 点击修改地址 -->
      <el-dialog title="提示" :visible.sync="listVisible" width="30%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="listVisible = false">取 消</el-button>
          <el-button type="primary" @click="listVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        // 表单页数据
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      tableData: [],
      listVisible: false
    }
  },
  // 生命周期
  created () {
    this.OrderList()
  },
  methods: {
    // TabularData () {},
    // 订单所有的数据
    async OrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      this.tableData = res.data.goods
      this.total = res.data.total
      console.log(res.data.goods)
    },
    // 监听选择页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.OrderList()
    },
    // 监听页码de
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.OrderList()
    },
    // 点击编辑区域
    ModifyThe () {
      this.listVisible = true
    },
    // 点击地址区域
    deleteData () {}
  },
  //   计算属性
  computed: {}
}
</script>

<style lang="less">
.users_box {
  display: flex;
}
.users_int {
  width: 35% !important;
  margin-bottom: 20px;
}
.users_but {
  margin-left: 30px;
}
.block {
  margin-top: 20px;
}
</style>
