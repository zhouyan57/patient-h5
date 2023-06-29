<script setup lang="ts">
import { ref } from 'vue'
import ConsultItem from './ConsultItem.vue'
import { getConsultOrderList } from '@/services/consult'
import type { ConsultType } from '@/enums'
import type { ConsultOrderItem, ConsultOrderPage } from '@/types/consult'
// 1. 获取 & 渲染订单数据
const props = defineProps<{
  type: ConsultType
}>()
const loading = ref(false)
const finished = ref(false)
const current = ref(1)
const pageSize = ref(5)
const consultList = ref<ConsultOrderItem[]>([])
const consultPage = ref<ConsultOrderPage>()
const onLoad = async () => {
  const res = await getConsultOrderList({
    current: current.value,
    pageSize: pageSize.value,
    type: props.type
  })
  // 保存分页数据
  consultPage.value = res.data
  // 保存订单列表
  consultList.value.push(...res.data.rows)
  // 关闭加载效果
  loading.value = false
  // 判断数据源是否加载完毕
  if (consultPage.value.total <= consultList.value.length) {
    finished.value = true
  }
  // 当前页
  current.value++
}

// 2. 删除订单
const delItem = (id: string) => {
  consultList.value = consultList.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
      <consult-item @del-item="delItem" :data="i" v-for="i in consultList" :key="i.id" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
