<template>
  <div class="page-container px-4 md:px-0">
    <div class="table-container relative">
    <div class="absolute -top-9 left-9 w-[160px] h-[45px] flex items-center justify-center bg-white border-[1.5px] border-black rounded-[15px] tracking-[2px] text-[18px]">
        每週新世界
    </div>
    <div @click="clearScores" class="absolute -top-9 right-4 w-[70px] h-[45px] flex items-center justify-center bg-white border-[1.5px] border-black rounded-[15px] tracking-[2px] text-[18px] cursor-pointer hover:bg-gray-100">
        清除
    </div>
      <table>
        <thead>
          <tr class="tracking-[12px]">
            <th>名稱</th>
            <th>分數</th>
            <th>數量</th>
            <th>計分</th>
            <th class="total-header">總共</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>
              <img :src="`/a-${index + 1}.webp`" alt="Image" />
            </td>
            <td>{{ formatNumber(item.score) }}</td>
            <td>
              <input
                v-model="item.quantity"
                type="text"
                @input="handleInput(item)"
                @blur="handleBlur(item)"
              >
            </td>
            <td>{{ formatNumber(item.score * (item.quantity || 0)) }}</td>
            <td v-if="index === items.length - 1" :rowspan="items.length + 1" class="total-cell text-[24px]">
              <div class="total-wrapper">{{ formatNumber(total) }}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <img v-if="showStamp" src="/pass.png" alt="通過" class="watermark" :class="{ 'stamp-animation': isAnimating }">
      <audio ref="passAudio" src="/pass.wav" preload="auto"></audio>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const items = ref([
  { score: 2, quantity: '' },
  { score: 3, quantity: '' },
  { score: 4, quantity: '' },
  { score: 6, quantity: '' },
  { score: 8, quantity: '' },
  { score: 8, quantity: '' },
  { score: 10, quantity: '' },
  { score: 10, quantity: '' },
  { score: 15, quantity: '' },
  { score: 15, quantity: '' },
  { score: 15, quantity: '' },
])

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.score * (Number(item.quantity) || 0), 0)
})

const handleInput = (item) => {
  item.quantity = item.quantity.replace(/^0+/, '')
  saveData()
}

const handleBlur = (item) => {
  if (item.quantity === '0') {
    item.quantity = ''
  }
  saveData()
}

const showStamp = ref(false)
const isAnimating = ref(false)
const passAudio = ref(null)

watch(total, (newTotal, oldTotal) => {
  if (newTotal >= 1000 && !showStamp.value) {
    showStamp.value = true
    isAnimating.value = true
    if (passAudio.value) {
      passAudio.value.play()
    }
    setTimeout(() => {
      isAnimating.value = false
    }, 500) // 動畫持續時間
  } else if (newTotal < 1000 && showStamp.value) {
    showStamp.value = false
  }
})

const saveData = () => {
  const data = {
    items: items.value,
    expiry: Date.now() + 8 * 24 * 60 * 60 * 1000 // 8 days from now
  }
  localStorage.setItem('scoreData', JSON.stringify(data))
}

const loadData = () => {
  const storedData = localStorage.getItem('scoreData')
  if (storedData) {
    const data = JSON.parse(storedData)
    if (data.expiry > Date.now()) {
      items.value = data.items
    } else {
      localStorage.removeItem('scoreData')
    }
  }
}

onMounted(() => {
  loadData()
})

// 添加格式化數字的函數
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const clearScores = () => {
  items.value.forEach(item => {
    item.quantity = ''
  })
  saveData()
}
</script>

<style scoped>
/* 將字體設置移到這裡，確保它應用到所有元素 */
* {
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 900;
}

/* ... 其他樣式保持不變 ... */

/* 修改數字相關元素的字體 */
input, td:nth-child(2), td:nth-child(4), .total-cell {
  font-family: 'Anton', sans-serif;
  font-weight: normal; /* Anton 字體不需要 900 的字重 */
}

/* ... 其他樣式保持不變 ... */

input {
  width: 50px;
  text-align: center;
  background-color: #fffacd;
  border: none;
  border-bottom: 1px solid #333;
  outline: none;
  padding: 2px 0;
  font-family: 'Anton', sans-serif;
  font-weight: normal;
}

body {
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 700;
}

.page-container {
  background-image: url('https://static.ghost.org/v5.0.0/images/publication-cover.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-container {
  width: 1200px;
  margin: 0 auto;
  position: relative;
  background-color: #fffacd;
  padding: 20px;
  border-radius: 15px;
}

table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin: 0 auto;
  background-color: #fffacd;
  border: 1px solid #333;
}

th, td {
  padding: 8px;
  text-align: center;
  border: 1px solid #333;
}

th {
  background-color: #fffacd;
  border-bottom: 1px solid #333;
}

.total-header {
  border-right: 1px solid #333;
}

.total-cell {
  border-right: 1px solid #333;
  position: relative;
}

.total-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #333;
}

/* 确保最后一行的右边框显示 */
tr:last-child td {
  border-bottom: 1px solid #333;
}

/* ... 其他樣式保持不變 ... */

img {
  width: 30px; 
  height: auto;
  opacity: 1;
  display: block;
  margin: 0 auto;
}

.watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  width: 40vw; /* 使用視窗寬度的百分比 */
  max-width: 400px; /* 設置最大寬度 */
  height: auto;
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
  z-index: 1000; /* 確保在其他元素之上 */
  transition: opacity 0.3s ease-out;
}

@keyframes stampAnimation {
  0% {
    transform: translate(-50%, -50%) rotate(-45deg) scale(5);
    opacity: 0;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) rotate(-45deg) scale(1);
    opacity: 0.5;
  }
}

.stamp-animation {
  animation: stampAnimation 0.5s ease-out;
}

.absolute {
  transition: background-color 0.3s ease;
}
</style>