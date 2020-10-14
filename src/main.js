import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui' // 引入element-ul
import 'element-ui/lib/theme-chalk/index.css' // 引css入样式
import './assets/cssbase/base.css' // 引入全局css样式
import axios from 'axios' // 引入axios
Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
