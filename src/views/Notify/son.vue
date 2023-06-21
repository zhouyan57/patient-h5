<script setup lang="ts">
// 接收 v-model 传过来的参数
const props = defineProps<{
  modelValue: number
  msg: string
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'update:msg', v: string): void
}>()
const addValue = () => {
  emits('update:modelValue', props.modelValue + 1)
}
const changeMsg = () => {
  emits('update:msg', 'son')
}
</script>
<template>
  <h3>子组件</h3>
  <div>modelValue: {{ modelValue }}</div>
  <div>msg:{{ msg }}</div>
  <button @click="addValue">点我数字++</button>
  <button @click="changeMsg">点我修改 msg</button>
</template>
<style scoped></style>
