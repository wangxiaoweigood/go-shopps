<template>
  <div id="add">
    <el-card class="box-card">
      <div class="text item">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/Welcome' }"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
          <el-button type="primary" @click="AddingRoles">添加角色</el-button>
        </el-row>
        <!-- 表格区域 -->
        <template>
          <el-table :data="tableData" border>
            <!-- 展开列表 -->
            <el-table-column type="expand" label="" width="50">
              <template slot-scope="scope">
                <el-row
                  :class="['dbbottom', lindex1 === 0 ? 'datop' : '', 'vcenter']"
                  v-for="(item1, lindex1) in scope.row.children"
                  :key="item1.id"
                >
                  <!-- 一级权限 -->
                  <el-col :span="5">
                    <el-tag
                      @close="ClickDelete(scope.row, item1.id)"
                      closable
                      >{{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 二级和三级权限 -->
                  <el-col :span="19">
                    <el-row
                      :class="[index2 === 0 ? '' : 'datop', 'vcenter']"
                      v-for="(item2, index2) in item1.children"
                      :key="item2.id"
                    >
                      <el-col :span="6">
                        <el-tag
                          type="success"
                          @close="ClickDelete(scope.row, item2.id)"
                          closable
                          >{{ item2.authName }}</el-tag
                        >
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag
                          @close="ClickDelete(scope.row, item3.id)"
                          closable
                          type="warning"
                          v-for="item3 in item2.children"
                          :key="item3.id"
                        >
                          {{ item3.authName }}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" prop="date" label="#" width="50">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述">
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <!-- slot-scope="scope" -->
                <el-button-group>
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-edit"
                    @click="editor(scope.row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    size="small"
                    icon="el-icon-delete"
                    @click="DeleteData(scope.row.id)"
                    >删除</el-button
                  >

                  <el-button
                    type="warning"
                    size="small"
                    icon="el-icon-thumb"
                    @click="AssignRoles(scope.row)"
                    >分配权限</el-button
                  >
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <!--弹出对话框区域  -->
        <!-- 分配权限区域 -->
        <el-dialog
          title="分配权限"
          :visible.sync="dialogVisible"
          width="30%"
          @close="setRightDialiog"
        >
          <el-tree
            ref="treeRef"
            :data="AccessData"
            show-checkbox
            node-key="id"
            :props="treeProps"
            default-expand-all
            :default-checked-keys="defKeys"
          >
          </el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button @click="Determine" type="primary">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 添加角色区域对话框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="addDialog"
        >
          <el-form
            label-width="100px"
            :rules="rules"
            :model="form"
            ref="addFormRes"
            hide-required-asterisk
          >
            <el-form-item label="角色名称" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="role">
              <el-input v-model="form.role"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddUsers"> 确 定 </el-button>
          </span>
        </el-dialog>
        <!-- 点击编辑按钮去修改角色名and描述 -->
        <el-dialog title="提示" :visible.sync="DisplaysEdit" width="30%">
          <el-form
            label-width="100px"
            :rules="Validation"
            :model="CharacterData"
            ref="addFormRes"
            hide-required-asterisk
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="CharacterData.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="CharacterData.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="DisplaysEdit = false">取 消</el-button>
            <el-button type="primary" @click="EditorToDetermine"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      tableData: [], // 列表数据
      defKeys: [], // 默认选中的值
      roleId: '', // 当前即将分配权限的角色的id
      dialogVisible: false, // 控制对话框的
      addDialogVisible: false, // 控制添加用户的弹出层
      DisplaysEdit: false, // 点击编辑按钮的弹出层
      AccessData: [],
      CharacterData: {},
      // 验证修改输入框
      Validation: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      //   树形图绑定对象
      // 点击添加自定义验证
      // 添加用户自定义表单验证
      rules: {
        username: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ]
      },

      treeProps: {
        label: 'authName',
        children: 'children'
      },

      // rules: {},
      form: {
        username: '',
        role: ''
      }
    }
  },
  //   生命周期函数
  created  () {
    this.RoleList()
  },
  methods: {
    async RoleList  () {
      // 请求接口
      const { data: res } = await this.$http.get('roles')
      // console.log(res.data)
      this.tableData = res.data
    },
    // 点击删除按钮删除权限
    async ClickDelete  (role, rightId) {
      //   console.log(role.id, rightId)
      // 弹窗提醒用户是否删除
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
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //   console.log(res)
      this.$message.success('删除成功')
      //   this.RoleList()
      role.children = res.data
    },
    // 点击打开分配权限
    async AssignRoles  (role) {
      this.roleId = role.id
      //   console.log(1)
      //   console.log(role)
      const { data: res } = await this.$http.get('rights/tree')
      //   console.log(res)
      this.AccessData = res.data
      // 通过递归获取到的三级节点的id
      this.getLeafkys(role, this.defKeys)
      this.dialogVisible = true
    },
    // 通过递归的方式获取角色下所有的三级权限的id.保存到defKeys
    getLeafkys  (node, arr) {
      // 如果当前node节点不包含children属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafkys(item, arr)
      })
    },
    // 点击确定吧勾选中的权限配置给后台
    async Determine  () {
      //   console.log('1')

      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const IdStr = keys.join(',')
      //   console.log(IdStr)
      // console.log(this.roleId)
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: IdStr
        }
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('授权失败')
      }
      this.$message.success('授权成功')
      this.dialogVisible = false
      this.RoleList()
    },
    // 监听分配授权对话框的关闭事件
    setRightDialiog  () {
      this.defKeys = []
    },
    // 点击添加模块
    AddingRoles  () {
      console.log('1')
      this.addDialogVisible = true
    },
    //  点击添加模块退出重置表格输=数据
    addDialog  () {
      this.addDialogVisible = false
    },
    //  点击添加模块确定按钮去更新数据
    AddUsers  () {
      this.$refs.addFormRes.validate(async (val) => {
        // console.log(val)
        if (!val) {
          return console.log('表单验证失败')
        }
        const { data: res } = await this.$http.post('roles', {
          roleName: this.form.username,
          roleDesc: this.form.role
        })
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.$refs.addFormRes.resetFields()
        this.RoleList()
      })

      // console.log(this.form)
    },
    // 点击编辑去修改角色名称and描述
    async editor  (id) {
      console.log(id)
      this.DisplaysEdit = true
      const { data: res } = await this.$http.get('roles/' + id)
      // console.log(res.data)
      this.CharacterData = res.data
      console.log(this.CharacterData)
    },
    // 编辑区域 点击确定提交修改后的数据
    EditorToDetermine  () {
      this.$refs.addFormRes.validate(async (val) => {
        if (!val) {
          return console.log('格式错误')
        }
        console.log(val)
        const { data: res } = await this.$http.put(
          'roles/' + this.CharacterData.roleId,
          {
            roleName: this.CharacterData.roleName,
            roleDesc: this.CharacterData.roleDesc
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.meta.$message.error('添加失败')
        }

        this.$message.success('修改成功')
        this.DisplaysEdit = false
        this.RoleList()
      })
      // this.$refs.addFormRes.()
    },
    // 点击删除模块 根据id去删除
    async DeleteData  (id) {
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
      if (remover !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.RoleList()
    }
  }
}
</script>

<style lang="less" scoped>
.add {
  text-align: center !important;
}
.el-row {
  margin: 15px 0 !important;
}
.el-button-group {
  //   padding-left: 40px !important;
  .el-button {
    margin-right: 20px !important;
  }
  .el-row {
    margin: 20px 0 !important;
  }
}
.el-tag {
  margin: 10px;
}
.datop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
