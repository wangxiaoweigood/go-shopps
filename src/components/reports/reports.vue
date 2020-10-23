<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
      <div id="main" style="width: 1000px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted () {
    this.RenderData()
  },
  methods: {
    async RenderData () {
      const { data: res } = await this.$http.get('reports/type/1')
      var myChart = this.$echarts.init(document.getElementById('main'))
      const result = this._.merge(res.data, this.options)
      myChart.setOption(result)
    },
    showEach () {
      console.log(this.$echarts)

      // 使用刚指定的配置项和数据显示图表。
    }
  }
}
</script>

<style lang="less" scoped>
#main {
  margin-top: 20px;
  width: 600px;
  height: 600px;
}
</style>
