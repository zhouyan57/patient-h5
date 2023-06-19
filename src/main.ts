import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 导入 vant 样式
import 'vant/lib/index.css'
// 导入全局样式
import './styles/main.scss'
// 导入生成的虚拟精灵图
import 'virtual:svg-icons-register'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
