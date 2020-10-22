import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui' // 引入element-ul
import 'element-ui/lib/theme-chalk/index.css' // 引css入样式
import './assets/cssbase/base.css' // 引入全局css样式
import './plugins/axios.js' // 引入配置axios
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid' //
import VueQuillEditor from 'vue-quill-editor' // 富文本编辑器
import _ from 'lodash'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.prototype._ = _
Vue.use(VueQuillEditor /* { default global options } */)
Vue.use(ZkTable)
Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
