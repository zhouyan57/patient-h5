import { followLike, orderDel } from '@/services/consult'
import { showSuccessToast, showImagePreview, showToast } from 'vant'
import { ref } from 'vue'
import { getPrescriptionUrl, orderCancel } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import { OrderType } from '@/enums'

// 1. 关注功能
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

// 2. 查看处方
export const useShowPrescription = () => {
  const checkPre = async (id: string | undefined) => {
    if (id === undefined) return
    // 得到处方路径
    const res = await getPrescriptionUrl(id)
    // 展示图片
    showImagePreview([res.data.url])
  }
  return {
    checkPre
  }
}

// 3. 取消订单
export const useOrderCancel = () => {
  const loading = ref(false)
  const cancel = async (data: ConsultOrderItem) => {
    if (!data.id) return showToast('订单 id 有误')
    loading.value = true
    setTimeout(async () => {
      await orderCancel(data.id)
      // 手动让订单状态改为已取消
      data.status = OrderType.ConsultCancel
      data.statusValue = '已取消'
      loading.value = false
    }, 1000)
  }
  return { loading, cancel }
}

// 4. 删除订单
export const useOrderDel = (callback: (myid: string) => void) => {
  // const emit = defineEmits<{
  //   (e: 'del-item', id: string): void
  // }>()
  const delLoading = ref(false)
  const del = (id: string | undefined) => {
    if (!id) return showToast('订单 id 有误')
    delLoading.value = true
    setTimeout(async () => {
      await orderDel(id)
      // 将要删除订单的 id 提交给父组件，在父组件中删除订单
      // emit('del-item', id)
      // 在这里执行一段逻辑代码
      callback && callback(id)
      delLoading.value = false
    }, 1000)
  }
  return { delLoading, del }
}
