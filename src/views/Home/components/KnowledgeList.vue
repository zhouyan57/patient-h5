<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import { getKnowledgeList } from '@/services/consult'
import type { KnowledgeType } from '@/types/user'
import type { KnowledgeList } from '@/types/consult'
// 1. 加载更多
// 接收参数
const props = defineProps<{
  type: KnowledgeType
}>()
const loading = ref(false)
const finished = ref(false)
const list = ref<KnowledgeList>([])
// 当前页
const current = ref(1)
// 页容量
const pageSize = ref(5)
// 总页数
const pageTotal = ref(0)
// 总条数据
const total = ref(0)

const onLoad = async () => {
  // 发请求得到文章数据源
  const res = await getKnowledgeList({
    type: props.type,
    current: current.value,
    pageSize: pageSize.value
  })
  list.value.push(...res.data.rows)
  pageTotal.value = res.data.pageTotal
  total.value = res.data.total
  // 关闭加载状态
  loading.value = false
  // 判断数据是否加载完成
  if (total.value <= list.value.length) {
    finished.value = true
  }
  // 页码 ++
  current.value++
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card :data="i" v-for="i in list" :key="i.id"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
