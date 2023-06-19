import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 导入组件
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
// 导入 svg 图标
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

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
    }),
    // 配置图标
    createSvgIconsPlugin({
      // 指定图标文件夹：绝对路径
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
