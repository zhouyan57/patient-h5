<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAllDep } from '@/services/consult'
import type { DepList } from '@/types/consult'
import { useConsultStore } from '@/stores'
const active = ref(0)
// 1. 一级科室列表
const depList = ref<DepList>([])
onMounted(async () => {
  const res = await getAllDep()
  depList.value = res.data
})
// 2. 二级科室列表
const subDepList = computed(() => {
  return depList.value[active.value]?.child
})
// 3 保存科室 ID
const store = useConsultStore()
</script>

<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <!-- 左侧侧边栏 -->
      <van-sidebar v-model="active">
        <van-sidebar-item :title="i.name" v-for="i in depList" :key="i.id" />
      </van-sidebar>
      <!-- 右侧二级科室 -->
      <div class="sub-dep">
        <router-link
          @click="store.setDepId(i.id)"
          to="/consult/illness"
          v-for="i in subDepList"
          :key="i.id"
          >{{ i.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
// .consult-dep-page {
//   padding-top: 46px;
// }
.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
</style>
