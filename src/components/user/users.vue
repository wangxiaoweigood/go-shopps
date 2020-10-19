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
        <el-input
          clearable
          @clear="ListUsers"
          v-model="usersInfo.query"
          placeholder="请输入内容"
          class="users_int"
        >
          <el-button
            slot="append"
            @click="ListUsers"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-row class="users_but">
          <el-button type="primary" @click="AddUser">添加用户</el-button>
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
              <el-switch
                @change="UserState(scope.row)"
                v-model="scope.row.mg_state"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <!-- 右侧按钮区域 -->
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="ModifyThe(scope.row.id)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteData(scope.row.id)"
              ></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="分配权限"
                placement="top-start"
              >
                <el-button
                  @click="assignRoles(scope.row)"
                  type="warning"
                  icon="el-icon-star-off"
                  circle
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="usersInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="addDialog"
    >
      <el-form
        label-width="100px"
        :rules="rules"
        :model="form"
        ref="addFormRes"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="AddUsers"> 确 定 </el-button>
      </span>
    </el-dialog>
    <!-- 点击修改图标模块对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="IconToModify"
      width="30%"
      @close="resetForm"
    >
      <el-form
        label-width="60px"
        :rules="editFormRules"
        :model="modify"
        ref="editFormRules"
        hide-required-asterisk
      >
        <el-form-item label="用户名">
          <el-input v-model="modify.username" disabled>{{
            form.username
          }}</el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modify.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="modify.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine"> 确 定</el-button>
      </span>
    </el-dialog>
    <!--点击分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：<el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    // 自定义邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^(([^<>()|[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 自定义手机号验证规则
    var checkMobile = (rule, value, callback) => {
      const Moblie = /^1[3|4|5|7|8][0-9]{9}$/
      if (Moblie.test(value)) {
        return callback()
      }
      callback(new Error('手机号格式错误'))
    }

    return {
      usersInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改表单数据modify
      modify: {},
      rolesList: [],
      // 修改表单验证规则
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 修改表单数据表单验证
      // 表单验证
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入合法的手机号',
            trigger: 'blur'
          },

          {
            validator: checkMobile,
            trigger: 'blur'
          },
          {
            min: 0,
            max: 11,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ]
      },
      userlist: [],
      selectRoleId: '',
      // 分配角色数据
      userInfo: [],
      total: 0,
      // 控制弹出框
      addDialogVisible: false,
      // 控制点击图标修改
      IconToModify: false,
      // 控制更改角色
      setRoleDialogVisible: false
    }
  },
  // 生命周期页面一开始就调用此方法
  created () {
    this.ListUsers()
  },
  methods: {
    // 请求表格数据
    async ListUsers () {
      const { data: res } = await this.$http.get('users', {
        params: this.usersInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total

      // console.log(this.userlist.mg_state)
    },
    // 监听选择页
    handleSizeChange (newSize) {
      console.log(newSize)
      this.usersInfo.pagesize = newSize
      this.ListUsers()
    },
    // 监听页码de
    handleCurrentChange (newPage) {
      this.usersInfo.pagenum = newPage
      this.ListUsers()
    },
    // 用户状态
    async UserState (state) {
      console.log(state)
      const { data: res } = await this.$http.put(
        `users/${state.id}/state/${state.mg_state}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        state.mg_state = !state.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('更新成功')
    },
    // 弹出层
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    // 添加用户
    AddUser: function () {
      // console.log('1')
      this.addDialogVisible = true
    },
    // 监听添加用户对话框的关闭事件
    addDialog () {
      // 让表单重置
      this.$refs.addFormRes.resetFields()
    },
    // 点击确定去校验表单格式
    AddUsers () {
      this.$refs.addFormRes.validate(async (val) => {
        // console.log(val)
        if (!val) {
          return this.$message.error('格式错误')
        }
        const { data: res } = await this.$http.post('users', this.form)
        // console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.ListUsers()
      })
    },
    // 点击修改图标模块
    async ModifyThe (id) {
      // console.log(id)
      this.IconToModify = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      // console.log(res.data);
      this.$message.success(res.meta.msg)
      this.modify = res.data
      // console.log(this.modify)
    },
    // 点击取消重置表单
    resetForm () {
      // editFormRules 是表单的名字resetFields()重置方法
      this.$refs.editFormRules.resetFields()
    },
    // 点击确定表单域验证格式
    determine () {
      this.$refs.editFormRules.validate(async (val) => {
        // console.log(val)
        if (!val) {
          return console.log('验证失败')
        }
        const { data: res } = await this.$http.put('users/' + this.modify.id, {
          email: this.modify.email,
          mobile: this.modify.mobile
        })
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('修改失败')
        }
        this.IconToModify = false
        this.ListUsers()
      })
      // console.log('1')
    },
    // 点击删除图标去删除数据
    async deleteData (id) {
      console.log(id)
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
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res)
      this.$message.success('删除成功')
      this.ListUsers()
    },
    async assignRoles (userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo () {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的值')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')

      this.setRoleDialogVisible = false
      this.ListUsers()
    },
    setRoleDialogClosed () {
      this.selectRoleId = ''
      this.userInfo = {}
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
  // text-align: center;
}
.block {
  margin-top: 20px !important;
}
</style>
