<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'check-pre'): void
  (e: 'del-item'): void
}>()

const showPopover = ref(false)
const actions = computed(() => {
  return [{ text: '查看处方', disabled: props.disabled }, { text: '删除订单' }]
})
const onSelect = (action: { text: string }) => {
  if (action.text === '查看处方') {
    emit('check-pre')
  } else {
    emit('del-item')
  }
}
</script>
<template>
  <van-popover
    v-model:show="showPopover"
    :actions="actions"
    @select="onSelect"
    placement="top-start"
  >
    <template #reference>
      <span>更多</span>
    </template>
  </van-popover>
</template>
<style scoped></style>
