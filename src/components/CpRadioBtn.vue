<script setup lang="ts">
// 1. 接收数据源
defineProps<{
  // 选项的数据源
  data: {
    label: string
    value: string | number
  }[]
  // 默认值
  modelValue: string | number
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
}>()
// 2. 修改选中选项
const changeDefault = (value: string | number) => {
  emits('update:modelValue', value)
}
</script>

<template>
  <div class="cp-radio-btn">
    <!-- <a class="item" href="javascript:;">男</a>
    <a class="item" href="javascript:;">女</a> -->
    <a
      @click="changeDefault(item.value)"
      v-for="(item, index) in data"
      :key="index"
      class="item"
      :class="{ active: modelValue === item.value }"
      href="javascript:;"
      >{{ item.label }}</a
    >
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid var(--cp-bg);
    background-color: var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;
    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>
