<template>
  <div class="home_box">
    <el-container class="Home_components">
      <!-- 头部导航栏 -->
      <el-header class="Home_nav">
        <div class="Honme_img">
          <img src="../assets/微信图片_20201014185926.jpg" alt="" />
        </div>
        <span>电商后台管理系统</span>
        <el-row class="Home_but">
          <el-button type="info" @click="HomeDel">退出</el-button>
        </el-row>
      </el-header>
      <!-- 左侧区域 -->
      <el-container class="left-box" height="100%">
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'" class="left-nav">
          <div class="toggle_button" @click="toggleButton">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu
            :collapse-transition="false"
            :collapse="isCollapse"
            unique-opened
            :show-timeout="300"
            background-color="#333744"
            text-color="#fff"
            active-text-color="red"
            :router="true"
            :default-active="aclivePath"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <!-- 一级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="icons" :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级子菜单 -->
              <el-menu-item
                @click="saveNav('/' + subItem.path)"
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <!-- 二级菜单模板 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体结构 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      menulist: [], // 左侧菜单数据
      // 将后台传来的id指赋值字体图标通过for循环去添加各自的图标信息
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 控制是否折叠默认是false打开的
      isCollapse: false,
      aclivePath: '' // 被激活的链接地址//路径
    }
  },
  //   created()是生命周期函数在项目一开始的时候就开始加载此函数的业务
  created () {
    this.getMenuList() // 请求左侧菜单的函数
    this.aclivePath = window.sessionStorage.getItem('aclivePath') // 当一访问此页面的时候就吧window.sessionStorage里存的值给aclivePath
  },
  // 所有的菜单

  methods: {
    // 左侧菜单请求的接口
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    HomeDel: function () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    // handleClose (key, keyPath) {
    //   console.log(key, keyPath)
    // },
    toggleButton: function () {
      // console.log('1')
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNav (aclivePath) {
      // console.log(aclivePath)
      // 吧aclivePath里的路径地址存放到window.sessionStorage这里
      window.sessionStorage.setItem('aclivePath', aclivePath)
    }
  }
}
</script>

<style lang='less' scoped>
.home_box {
  height: 100%;
}

.Home_components {
  height: 100%;
  .Home_nav {
    line-height: 60px;
    display: flex;
    height: 60px;
    line-height: 60px;
    background-color: #373d41;
    .Honme_img {
      width: 60px;
      height: 60px;
      // flex: 1;
      // border-radius: 50%;
      img {
        border-radius: 50%;
        width: 100%;
      }
    }
    span {
      font-size: 20px;
      color: #fff;
      padding-left: 20px;
    }
  }
  .Home_but {
    position: absolute;
    right: 10px;
  }
  .left-nav {
    width: 200px;
    // height: 100vh !important;
    background-color: rgb(51, 55, 68);
    box-sizing: border-box;
    overflow: hidden;
  }
  // .left-box {
  // box-sizing: border-box;
  // display: block;
  // display: flex;
  .left-box {
    // background-color: red;
    height: 100%;
  }
  .el-menu {
    border-right: none !important;
  }
  // }
  .icons {
    padding-right: 10px;
  }
  .toggle_button {
    background-color: red;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
