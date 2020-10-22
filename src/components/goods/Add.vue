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
          <el-breadcrumb-item :to="{ path: '/Goods' }" class="breaf"
            >商品列表</el-breadcrumb-item
          >
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 文字条幅 -->
      <el-alert title="添加商品信息" type="info" effect="dark"> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧标签页 -->
      <el-form
        :model="addFome"
        :rules="addRuleForm"
        ref="ruleForm"
        label-width="100px"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 基本信息区域 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFome.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFome.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFome.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFome.goods_number" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addFome.goods_cat"
                expandTrigger="hover"
                :options="catelist"
                :props="cateProps"
                @change="handleChanged"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数区域 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item"
                  v-for="item in item.attr_vals"
                  :key="item.attr_id"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性区域 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals">{{
                onlyTableData.attr_vals
              }}</el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片区域 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容区域 -->
          <el-tab-pane label="商品内容" name="4">
            <el-form-item>
              <!-- 富文本 -->
              <quill-editor v-model="addFome.goods_introduce"></quill-editor>
              <!-- 添加商品的按钮 -->
              <el-button @click="add" type="primary" class="btn"
                >添加商品</el-button
              >
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 点击图片展开 -->
    <el-dialog :visible.sync="OpenPicture" width="50%">
      <span>
        <img :src="ImagePath" class="img" alt="" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      activeIndex: 0, // 控制步骤条显示高亮的索引
      tabPosition: 'left', // 控制方向的标签页
      addFome: {
        goods_name: '',
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cat: [], // 商品所属的分类数组
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [], // 商品参数所有的值
      onlyTableData: [], // 商品属性的值
      catelist: [], // 所有分类数据
      ImagePath: [], // 点击展开的图片路径
      OpenPicture: false,
      // content: [],
      // 设置请求头给图片上传
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload', // 上传图片地址
      addRuleForm: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_numbe: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      rules: {}
    }
  },
  // 生命周期函数
  created () {
    this.ProductData()
  },
  methods: {
    // 获取所有数据
    async ProductData () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      // console.log(res.data)
      this.catelist = res.data
      //   console.log(res);
    },
    // 级联选中器选中会有变化
    handleChanged () {
      //   console.log(this.addFome.goods_cat)
      if (this.addFome.goods_cat.length !== 3) {
        this.addFome.goods_cat = []
      }
    },
    // 监听标签页的切换
    beforeTabLeave (activeName, oldActiveName) {
      //   console.log(activeName, oldActiveName)
      if (oldActiveName === '0' && this.addFome.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
      return true
    },
    async tabClicked () {
      //   console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        // console.log('进入参数')
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        // console.log(this);
        if (res.meta.status !== 200) {
          return this.$message.error('请求失败')
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        console.log(res.data)
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        // console.log(this.onlyTableData.attr_vals)
        // console.log(res.attr_id)
        if (res.meta.status !== 200) {
          return this.$message.error('请求失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 如理图片预览效果
    handlePreview (file) {
      // console.log(file)
      this.ImagePath = file.response.data.url
      console.log(this.ImagePath)
      this.OpenPicture = true
    },
    // 处理点击删除图片
    handleRemove (file) {
      // console.log(file)
      const filePath = file.response.data.tmp_path
      // ponse.data.tmp_path
      const i = this.addFome.pics.findIndex((x) => x.pic === filePath)
      // console.log(i)
      this.addFome.pics.splice(i, 1)
      // console.log(this.addFome)
    },
    // 上传成功后的函数
    handleSuccess (response) {
      // console.log(response)
      const PicInit = { pic: response.data.tmp_path }
      this.addFome.pics.push(PicInit)
      // console.log(this.addFome)
    },
    add () {
      this.$refs.ruleForm.validate(async (val) => {
        // console.log(val)
        if (!val) {
          return this.$message.error('请正确填写')
        }
        const form = this._.cloneDeep(this.addFome)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addFome.attrs.push(newinfo)
        })
        // 处理静态参数
        this.onlyTableData.forEach((item) => {
          const newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addFome.attrs.push(newinfo)
          form.attrs = this.addFome.attrs
        })
        const { data: res } = await this.$http.post('goods', form)
        console.log(res.meta.msg)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addFome.goods_cat.length === 3) {
        return this.addFome.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less">
.el-steps {
  margin-top: 25px !important;
}
.el-step__title {
  font-size: 12px !important;
}
.el-tabs {
  margin-top: 30px !important;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.img {
  width: 100%;
}
.ql-editor {
  min-height: 300px !important;
}
.btn {
  margin-top: 10px !important;
}
</style>
