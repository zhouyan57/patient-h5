<script setup lang="ts">
// 接收 v-model 传过来的参数
const props = defineProps<{
  modelValue: number
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', v: number): void
}>()
const addValue = () => {
  emits('update:modelValue', props.modelValue + 1)
}
</script>
<template>
  <h3>子组件</h3>
  <div>modelValue: {{ modelValue }}</div>
  <button @click="addValue">点我数字++</button>
</template>
<style scoped></style>
