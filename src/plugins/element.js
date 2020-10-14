import Vue from 'vue'
import { Button, Form, Formltem, input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form, Formltem)
Vue.use(input)
Vue.prototype.$message = Message // 弹出层组件
