<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
// 1. 加载更多
const loading = ref(false)
const finished = ref(false)
const list = ref<number[]>([])
const onLoad = () => {
  setTimeout(() => {
    const arr = [1, 2, 3, 4, 5]
    list.value.push(...arr)
    // 手动修改加载状态
    loading.value = false
    if (list.value.length >= 15) {
      finished.value = true
    }
  }, 2000)
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
      <knowledge-card v-for="i in 5" :key="i"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
