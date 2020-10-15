<template>
  <!-- <div>

    <div style="margin-top: 15px">

    </div>
  </div> -->
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="users_box">
        <el-input placeholder="请输入内容" class="users_int">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-row class="users_but">
          <el-button type="primary">添加用户</el-button>
        </el-row>
      </div>

      <template>
        <el-table :data="userlist" stripe border class="tab">
          <el-table-column type="index" label="#" width="60"> </el-table-column>
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <!-- {{ mg_state s}} -->
              <el-switch v-model="scope.row.mg_state"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
              <el-button
                type="warning"
                icon="el-icon-star-off"
                circle
              ></el-button>
            </el-row>
          </el-table-column>
        </el-table>
      </template>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="usersInfo.query"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="usersInfo.pagesize"
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
      usersInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0
    }
  },
  created () {
    this.ListUsers()
  },
  methods: {
    async ListUsers () {
      const { data: res } = await this.$http.get('users', {
        params: this.usersInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      console.log(newSize)
      this.usersInfo.pagesize = newSize
      this.ListUsers()
    },
    // 监听页码de
    handleCurrentChange (newPage) {
      this.usersInfo.pagenum = newPage
      this.ListUsers()
    }
  }
}
</script>
<style lang="less" scoped>
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
  text-align: center;
}
.block {
  margin-top: 20px !important;
}
</style>
