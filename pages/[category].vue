<template>
    <div class=" flex flex-col justify-center items-center">
      <!-- 篩選按鈕 -->
      <div class="flex flex-row justify-center items-center space-x-2 my-10">
        <button class="bg-gray-900 px-8 py-1 rounded-xl text-gray-50 text-[18px] text-thin tracking-[2px]" @click="navigateToCategory('travel')">旅遊</button>
        <button class="bg-gray-900 px-8 py-1 rounded-xl text-gray-50 text-[18px] text-thin tracking-[2px]" @click="navigateToCategory('food')">美食</button>
        <button class="bg-gray-900 px-8 py-1 rounded-xl text-gray-50 text-[18px] text-thin tracking-[2px]" @click="navigateToCategory('life')">生活</button>
      </div>
  
      <!-- 顯示篩選後的商品 -->
      <div class="w-[600px] bg-gray-100 flex flex-col justify-center items-center space-y-4 text-thin text-[14px] tracking-[2px]">
        <div v-for="product in filteredProducts" :key="product.id" class="px-4 py-2">
          {{ product.name }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'nuxt/app'
  
  // 模擬商品數據
  const products = ref([
    { id: 1, name: '旅遊商品 1', category: 'travel' },
    { id: 2, name: '美食商品 1', category: 'food' },
    { id: 3, name: '生活商品 1', category: 'life' },
    { id: 4, name: '旅遊商品 2', category: 'travel' },
    { id: 5, name: '美食商品 2', category: 'food' },
  ])
  
  const route = useRoute()
  const router = useRouter()
  
  // 篩選商品
  const filteredProducts = computed(() =>
    products.value.filter(product => product.category === route.params.category)
  )
  
  // 導航到不同分類
  const navigateToCategory = (category) => {
    router.push(`/${category}`)
  }
  </script>
  
<style scoped>
* {
    font-family: 'Noto Sans TC', sans-serif;
    font-weight: 700;
}
</style>