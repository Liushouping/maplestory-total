<template>
  <div class="about-page">
    <!-- 布局切换按钮 -->
    <div class="layout-toggle">
      <button @click="toggleLayout">切换布局</button>
    </div>
    <!-- 卡片容器，根据 isGridLayout 切换网格布局 -->
    <div :class="{ 'card-grid': isGridLayout }">
      <!-- 循环渲染卡片组件 -->
      <Card
        v-for="(card, index) in cards"
        :key="index"
        :closable="true"
        @close="closeCard(index)"
        v-show="!card.closed"
      >
        <!-- 卡片标题 -->
        <template #header>{{ card.title }}</template>
        <!-- 卡片内容 -->
        {{ card.content }}
        <!-- 卡片底部 -->
        <template #footer>
          <small>更新时间: {{ card.updateTime }}</small>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Card from '@/components/card.vue'

// 控制是否使用网格布局
const isGridLayout = ref(false)

// 卡片数据数组
const cards = ref([
  { title: '我们的使命', content: '为客户提供最优质的服务', updateTime: '2023-04-01', closed: false },
  { title: '我们的团队', content: '由经验丰富的专业人士组成', updateTime: '2023-04-02', closed: false },
  { title: '我们的历史', content: '成立于2010年，不断成长和创新', updateTime: '2023-04-03', closed: false },
])

// 切换布局方法
const toggleLayout = () => {
  isGridLayout.value = !isGridLayout.value
}

// 关闭指定卡片的方法
const closeCard = (index) => {
  cards.value[index].closed = true
}
</script>

<style scoped>
/* 页面样式 */
.about-page {
  padding: 20px;
}

/* 布局切换按钮样式 */
.layout-toggle {
  margin-bottom: 20px;
}

/* 网格布局样式 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
</style>