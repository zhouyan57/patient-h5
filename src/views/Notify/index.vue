<script setup lang="ts">
import { ref } from 'vue'
import son from './son.vue'
const num = ref(0)
const msg = ref('f')
</script>
<template>
  <!-- <div class="notify-page">notify</div> -->
  <h2>vue3中的 v-model</h2>
  <h3>1. v-model 的用法</h3>
  <h3>父组件</h3>
  <div>num:{{ num }}</div>
  <div>msg:{{ msg }}</div>
  <son v-model="num" v-model:msg="msg"></son>
  <!-- 等价于以下写法 -->
  <!-- <son :modelValue="num" @update:modelValue="num = $event"></son> -->
  <!-- <son v-model="num" :msg="msg" @update:msg="msg = $event"></son> -->
</template>
<style scoped lang="scss"></style>
