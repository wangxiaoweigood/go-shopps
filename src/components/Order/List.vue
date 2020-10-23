<template>
  <div class="table">
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
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间"
          ><template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
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
      <el-dialog
        title="修改地址"
        :visible.sync="listVisible"
        width="30%"
        @close="addRessDing"
      >
        <el-form
          :model="ruleForm"
          label-width="100px"
          :rules="rules"
          ref="addressForm"
        >
          <el-form-item label="省市区/县" prop="region">
            <el-cascader
              :options="cityData"
              v-model="ruleForm.region"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="name">
            <el-input v-model="ruleForm.name" clearable></el-input
          ></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="listVisible = false">取 消</el-button>
          <el-button type="primary" @click="Determine">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 显示地址对话框 -->
      <el-dialog title="物流信息" :visible.sync="ExplicitAddress">
        <span>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in data"
              :key="index"
              :timestamp="item.time"
            >
              {{ item.context }}
            </el-timeline-item>
          </el-timeline></span
        >
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      data: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context:
            '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context:
            '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ],
      meta: { status: 200, message: '获取物流信息成功！' },
      options: [],
      ruleForm: {
        name: '',
        region: ''
      },
      queryInfo: {
        // 表单页数据
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      tableData: [],
      listVisible: false, // 修改地址
      ExplicitAddress: false, // 显示地址
      cityData,
      // 表单自定义校验规则
      rules: {
        name: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        region: [
          { required: true, message: '请选择详细地址', trigger: 'change' }
        ]
      }
    }
  },
  // 生命周期
  created () {
    this.OrderList()
  },
  methods: {
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

      this.$message.success('修改成功')
    },
    // 点击地址区域
    deleteData () {
      this.ExplicitAddress = true
    },
    // 监听表单关闭事件
    addRessDing () {
      this.$refs.addressForm.resetFields()
    },
    // 点击确定校验表单
    Determine () {
      this.$refs.addressForm.validate((val) => {
        if (!val) {
          return this.$message.error('请填写信息')
        }
        this.$message.success('修改成功')
        this.listVisible = false
      })
    }
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
.table {
  margin-top: 20px !important;
  font-size: 12px !important;
}
.el-cascader {
  width: 100% !important;
}
</style>
