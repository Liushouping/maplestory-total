<template>
  <!-- 只有在卡片未关闭时才显示 -->
  <div v-if="!closed" class="card">
    <div class="card-header">
      <!-- 头部插槽 -->
      <slot name="header"></slot>
      <!-- 如果可关闭，显示关闭按钮 -->
      <button v-if="closable" @click="closeCard" class="close-button">×</button>
    </div>
    <div class="card-body">
      <!-- 默认插槽，用于主要内容 -->
      <slot></slot>
    </div>
    <div class="card-footer">
      <!-- 底部插槽 -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 定义 props
// props 允许父组件向子组件传递数据
const props = defineProps({
  // closable prop 控制是否显示关闭按钮
  closable: {
    type: Boolean,
    default: false
  }
})

// 定义 emit
// emit 允许子组件向父组件发送事件
// 这里定义了一个 'close' 事件
const emit = defineEmits(['close'])

// 控制卡片是否关闭的响应式变量
const closed = ref(false)

// 关闭卡片的方法
const closeCard = () => {
  // 设置 closed 为 true
  closed.value = true
  // 触发 'close' 事件，通知父组件卡片已关闭
  emit('close')
}
</script>

<style scoped>
/* 卡片基本样式 */
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
}

/* 卡片头部样式 */
.card-header {
  background-color: #f5f5f5;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 卡片主体样式 */
.card-body {
  padding: 15px;
}

/* 卡片底部样式 */
.card-footer {
  background-color: #f5f5f5;
  padding: 10px;
  border-top: 1px solid #ddd;
}

/* 关闭按钮样式 */
.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
}
</style>