<script setup lang="ts">
import { ref } from 'vue'
import son from './son.vue'
const num = ref(0)
</script>
<template>
  <!-- <div class="notify-page">notify</div> -->
  <h2>vue3中的 v-model</h2>
  <h3>1. v-model 的用法</h3>
  <h3>父组件</h3>
  <div>num:{{ num }}</div>
  <son v-model="num"></son>
  <!-- 等价于以下写法 -->
  <!-- <son :modelValue="num" @update:modelValue="num = $event"></son> -->
</template>
<style scoped lang="scss"></style>
