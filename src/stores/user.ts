// 管理与用户相关的全局数据
import { defineStore } from 'pinia'
import { ref } from 'vue'
// 用户类型
type User = {
  token: string
  refreshToken: string
  avatar: string
  mobile: string
  account: string
  id: string
}
export const useUserStore = defineStore('user', () => {
  // 1. 定义用户信息
  const user = ref<User>()
  // 2. 定义方法
  // 保存用户信息
  const setUser = (obj: User) => {
    user.value = obj
  }
  // 清除用户信息
  const removeUser = () => {
    user.value = undefined
  }
  return { user, setUser, removeUser }
})
