import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // 解析单文件组件的插件
    vue(),
    // 自动导入的插件，解析器可以是 vant element and-vue
    Components({
      // dts：自动生成组件的类型声明文件
      //   默认为 true, vant 中已经提供了组件的类型声明文件，可以关闭
      dts: false,
      // importStyle：自动引入组件样式
      //   默认为 true, 在 main.ts 中已经引入了样式，可以手动关闭
      resolvers: [VantResolver({ importStyle: false })]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
