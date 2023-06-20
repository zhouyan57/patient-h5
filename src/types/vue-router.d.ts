import 'vue-router'

declare module 'vue-router' {
  // 扩展 辕信息类型
  interface RouteMeta {
    // 标题
    title?: string
  }
}
