<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 导航栏区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 文字提醒 -->
    <el-alert title="注意：只允许为第三级分类设置相关参数！" type="error">
    </el-alert>
    <!-- 选择商品分类模块 -->
    <div class="block">
      <span class="demonstration">选择商品分类模块:</span>
      <el-cascader
        v-model="selectedCateKesys"
        :options="catelist"
        expandTrigger="hover"
        :props="cateProps"
        @change="handleChange"
      ></el-cascader>
    </div>
    <!-- Tabs标签栏切换 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 动态参数模板 -->
      <el-tab-pane label="动态参数" name="many">
        <!-- 动态参数模板--button按钮 -->
        <el-row>
          <el-button
            :disabled="isBtnDisabeld"
            type="primary"
            size="mini"
            @click="DynamicDisplay = true"
            >添加参数</el-button
          >
        </el-row>
        <!-- 动态参数表格区域 -->
        <el-table :data="manyTabData" border style="width: 100%">
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, i) in scope.row.attr_vals"
                closable
                @close="ClickDelete(i, scope.row)"
                :key="i"
                >{{ item }}</el-tag
              >
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="Editor(scope.row.attr_id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="DeleteUser(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 静态参数模板 -->
      <el-tab-pane label="静态属性" name="only">
        <!-- 静态参数模板--button按钮 -->
        <el-row>
          <el-button
            type="primary"
            :disabled="isBtnDisabeld"
            size="mini"
            closable
            @click="DynamicDisplay = true"
            >添加属性</el-button
          >
        </el-row>
        <!-- 静态参数表格区域 -->
        <el-table :data="onlyTabData" border style="width: 100%">
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, i) in scope.row.attr_vals"
                closable
                @close="ClickDelete(i, scope.row)"
                :key="i"
                >{{ item }}</el-tag
              >
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="Editor(scope.row.attr_id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="DeleteUser(scope.row.attr_id)"
                >删除</el-button
              >
            </template></el-table-column
          >
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--点击动态参数下的添加参数按钮区域显示对话框  -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="DynamicDisplay"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DynamicDisplay = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击编辑区域 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="DynamicEditor"
      width="50%"
      @close="DialogClosed"
    >
      <el-form
        :model="Dylistfeom"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="Dylistfeom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DynamicEditor = false">取 消</el-button>
        <el-button type="primary" @click="Params">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data: function () {
    return {
      catelist: [], // 分类参数的所有数据
      //   options: [],
      activeName: 'many',
      manyTabData: [], // 获取到动态参数的数据
      onlyTabData: [], // 获取到静态属性的数据
      selectedCateKesys: [], // 双向绑定数据
      Dylistfeom: [], // 请求修改的空数组
      DynamicDisplay: false, // 显示动态参数区域的对话框
      DynamicEditor: false, // 点击编辑区域显示对话框
      addForm: {
        attr_name: ''
      },
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  // 生命周期函数 加载页面优先执行此函数
  created () {
    this.ClassificationGoods()
  },
  methods: {
    async ClassificationGoods () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败')
      }

      this.catelist = res.data
      //   console.log(this.catelist + '2')
      //   console.log(res)
    },
    // 级联选择器选中会变化这个函数
    handleChange () {
      this.getparamsData()
    },

    // 点击Tabs标签栏切换默认事件
    handleClick () {
      // 点击动态参数返回的是many
      //   静态返回的是only
      console.log(this.activeName)
      this.getparamsData()
    },
    // 这是获取商品参数的数据函数
    async getparamsData () {
      // 如果选入的不是三级菜单的话默认自动清空
      if (this.selectedCateKesys.length !== 3) {
        this.selectedCateKesys.length = []
        this.manyTabData = []
        this.onlyTabData = []
      }
      //   console.log(this.selectedCateKesys)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取后台信息失败')
      }
      if (this.activeName === 'many') {
        return (this.manyTabData = res.data)
      }
      this.onlyTabData = res.data
      console.log(this.onlyTabData)
    },

    // 监听Form表单关闭事件
    addDialogClosed () {
      this.$refs.ruleForm.resetFields()
    },
    // 点击确定提交添加
    addParams () {
      this.$refs.ruleForm.validate(async (val) => {
        // console.log(val)
        if (!val) {
          return this.$message.error('请正确填写')
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.DynamicDisplay = false
        this.getparamsData()
      })
    },

    async Editor (id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      this.Dylistfeom = res.data
      this.DynamicEditor = true
    },
    // 监听表单事件
    DialogClosed () {
      this.$refs.ruleForm.resetFields()
    },
    // 点击确定提交修改数据
    Params () {
      this.$refs.ruleForm.validate(async (val) => {
        // console.log(val)
        if (!val) {
          return this.$message.error('请核对')
        }
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.Dylistfeom.attr_id}`,
          {
            attr_name: this.Dylistfeom.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('请求失败')
        }
        this.$message.success('修改成功')
        // console.log(res)
        this.DynamicEditor = false
        this.getparamsData()
      })
    },
    // 点击删除区域
    async DeleteUser (id) {
      console.log(id)
      const remover = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/` + id
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getparamsData()
    },
    // 文本框失去焦点，或者摁下回车键都会触发的函数
    async handleInputConfirm (row) {
      //   console.log('2')
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //   row.inputValue = row.inputValue()
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求保存自己添加的值
      this.saveAttrVals(row)
    },
    // 将对attr_vals的操作添加数据库
    async saveAttrVals (row) {
      // 发起请求保存自己添加的值
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('添加失败')
      }
      this.$message.success('修改数据成功')
    },
    showInput (row) {
      row.inputVisible = true
      // 让表单自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击删除对应的参数可选项
    ClickDelete (val, row) {
      console.log(val, row)
      row.attr_vals.splice(val, 1)
      this.saveAttrVals(row)
    }
  },
  // 计算属性
  computed: {
    isBtnDisabeld () {
      if (this.selectedCateKesys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId () {
      if (this.selectedCateKesys.length === 3) {
        return this.selectedCateKesys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.block {
  margin-top: 20px !important;
  //   background-color: red !important;
}
.el-cascader {
  margin-left: 10px !important;
}
.el-row {
  margin-bottom: 20px !important;
}
.input-new-tag {
  width: 60px;
}
</style>
