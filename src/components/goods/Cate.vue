<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 导航栏区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Welcome' }"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 内容区域 -->
      <div class="text item">
        <!-- 添加角色按钮 -->
        <el-row>
          <el-button type="primary" @click="AddingRoles">添加角色</el-button>
        </el-row>
        <!-- 表格区域 -->
        <zk-table
          class="Form"
          :data="catelist"
          :columns="columns"
          :expand-type="false"
          :selection-type="false"
          :show-index="true"
          :stripe="true"
          :border="true"
          index-text="#"
        >
          <!-- 是否有效区域 -->
          <template slot="likes" slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="red"></i>
          </template>
          <!-- 排序区域 -->
          <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">标签一</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success"
              >标签二</el-tag
            >
            <el-tag v-else type="danger">标签三</el-tag>
          </template>
          <!-- 操作区域 -->
          <template slot="opt" slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="EditCategory(scope.row.cat_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="Delete(scope.row.cat_id)"
              >删除</el-button
            >
          </template>
        </zk-table>
        <!-- 分页区域 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querInfo.pagenum"
            :page-sizes="[3, 5, 10, 50]"
            :page-size="querInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
          <!-- 点击添加显示对话框区域 -->
          <el-dialog title="提示" :visible.sync="AddDisplay" width="30%">
            <!-- 分类名称对话框 -->
            <el-form
              ref="addCateForm"
              :model="addCateForm"
              :rules="addCateFormRules"
              label-width="80px"
              @close="addCateDiaklogClosed"
            >
              <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
              </el-form-item>
              <el-form-item label="父级分类">
                <!-- options 用来指定数据源 -->
                <el-cascader
                  v-model="selectedKeys"
                  expandTrigger="hover"
                  :options="parentCateList"
                  :props="cascaderProps"
                  @change="parentCateChanged"
                  clearable
                  change-on-select
                ></el-cascader
              ></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="AddDisplay = false">取 消</el-button>
              <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 点击编辑按钮显示对话区域 -->
          <el-dialog title="提示" :visible.sync="ButtonToDisplay" width="30%">
            <el-form label-width="90px" :model="EditData" ref="editFormRules">
              <!-- <el-form-item label="旧分类名称" prop="email">
                <el-input v-model="EditData.cat_name" disabled></el-input>
              </el-form-item> -->
              <el-form-item label="更改名称" prop="mobile">
                <el-input v-model="EditData.cat_name"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="ButtonToDisplay = false">取 消</el-button>
              <el-button type="primary" @click="IdentifyChanges"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 2, // 当前页码值
        pagesize: 5 // 显示每页多少条数据
      },
      catelist: [], // 商品分类的数据列表默认为空
      total: 0, // 总的数据条数
      AddDisplay: false, // 点击添加角色显示对话框是否显示
      ButtonToDisplay: false, // 点击编辑按钮是否显示默认关闭false
      EditData: [], // 编辑的模块数据
      addCateForm: {
        cat_name: '', // 分类名称
        cat_pid: 0, // 父级分类的ID
        cat_level: 0 // 分类层级
      },
      // 添加分类表单验证的规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 5,
            message: '长度在 1 到 3 个字符',
            trigger: 'blur'
          }
        ]
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'likes',
          minWidth: '200px',
          type: 'template', // 吧当前列定义为模板列
          template: 'likes' // 模板名称
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template', // 吧当前列定义为模板列
          template: 'order' // 模板名称
        },
        {
          label: '操作',
          //   prop: 'cat_level',
          type: 'template', // 吧当前列定义为模板列
          template: 'opt' // 模板名称
        }
      ],
      parentCateList: [], // 父级分类所有数据
      // 指定级联选择器 的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [] // 选中的父级分类ID数组
    }
  },
  // 生命周期函数 加载页面优先执行此函数
  created () {
    this.ClassificationGoods()
  },
  methods: {
    // 商品分类数据列表区域
    async ClassificationGoods () {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      console.log(res)
      this.catelist = res.data.result
      this.total = res.data.total
      console.log(this.catelist)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      //   this.$message.success('获取成功')
    },
    // 分页区域
    handleSizeChange (newSize) {
      console.log('val')
      this.querInfo.pagesize = newSize
      this.ClassificationGoods()
    },
    handleCurrentChange (newNum) {
      this.querInfo.pagenum = newNum
      this.ClassificationGoods()
    },
    // 点击添加角色模块
    AddingRoles () {
      this.AddDisplay = true
      this.getParentCateList()
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      console.log(res.data)
      //   console.log(res)
      this.parentCateList = res.data
    },
    // 选择项发生变化就会触达这个函数
    parentCateChanged () {
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定添加新的分类
    addCate () {
      this.$refs.addCateForm.validate(async (val) => {
        console.log(val)
        if (!val) {
          this.$message.error('请正确填写信息')
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success(res.meta.msg)
        this.addCateDiaklogClosed()
        this.ClassificationGoods()
        this.AddDisplay = false
      })
    },
    // 监听表单关闭事件
    addCateDiaklogClosed () {
      this.$refs.addCateForm.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 删除模块
    async Delete (id) {
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
      //   const { data: res } = await this.$http.delete("users/" + id);
      const { data: res } = await this.$http.delete('categories/' + id)
      //   console.log(res.meta.msg)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.ClassificationGoods()
    },
    // 点击编辑去编辑分类名称
    async EditCategory (id) {
      console.log(id)
      const { data: res } = await this.$http.get('categories/' + id)
      this.EditData = res.data
      console.log(this.EditData.cat_name)
      this.ButtonToDisplay = true
    },
    // 点击确定吧修改后的值传到后台
    async IdentifyChanges () {
      const { data: res } = await this.$http.put(
        'categories/' + this.EditData.cat_id,
        {
          cat_name: this.EditData.cat_name
        }
      )
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      this.$message.success('跟新成功')
      this.ClassificationGoods()
      this.ButtonToDisplay = false
    }
  }
}
</script>

<style lang="less" scoped>
.block {
  margin-top: 20px !important;
}
.Form {
  margin-top: 20px !important;
}
.el-cascader {
  width: 100% !important;
}

</style>
