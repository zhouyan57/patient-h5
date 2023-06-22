import { followLike } from '@/services/consult'
import { showSuccessToast } from 'vant'
import { ref } from 'vue'

export const useFollow = () => {
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    // 开启加载状态
    loading.value = true
    setTimeout(async () => {
      await followLike({
        type: 'doc',
        id: item.id
      })
      showSuccessToast(item.likeFlag ? '取关成功' : '关注成功')
      // 修改关注的状态
      item.likeFlag = item.likeFlag ? 0 : 1
      loading.value = false
    }, 2000)
  }
  return {
    loading,
    follow
  }
}
