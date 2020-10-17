<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="text item">
        <template>
          <el-table :data="tableData" border style="width: 100%">
            <!-- <el-table-column prop="date" label="日期" width="180"> -->
            <el-table-column type="index" prop="" label="#" width="60">
            </el-table-column>
            <el-table-column prop="authName" label="权限"> </el-table-column>
            <el-table-column prop="path" label="路径"> </el-table-column>
            <el-table-column prop="level" label="权限等级">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                <el-tag v-else-if="scope.row.level === '1'" type="success"
                  >二级</el-tag
                >
                <el-tag type="danger" v-else>三级</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      tableData: []
    }
  },
  // 生命周期函数
  created () {
    this.ToObtainListOf()
  },
  methods: {
    // 获取列表数据
    async ToObtainListOf () {
      const { data: ret } = await this.$http.get('rights/list')
      console.log(ret)
      this.tableData = ret.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 25px;
}
</style>
