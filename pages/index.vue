<template>
  <div>
    <!-- 現有的頁面內容 -->
    <div class="page-container px-4 xl:px-0">
      <div class="table-container relative">
        <!-- 頁面標題 -->
        <div class="absolute -top-9 left-9 w-[160px] h-[45px] flex items-center justify-center bg-white border-[1.5px] border-black rounded-[15px] tracking-[2px] text-[18px]">
          每週新世界
        </div>
        <!-- 清除按鈕 -->
        <div @click="clearScores" class="absolute -top-9 right-4 w-[70px] h-[45px] flex items-center justify-center bg-white border-[1.5px] border-black rounded-[15px] tracking-[2px] text-[18px] cursor-pointer hover:bg-gray-100">
          清除
        </div>
        <!-- 主表格 -->
        <table>
          <thead>
            <tr class="tracking-[12px]">
              <th>名稱</th>
              <th>分數</th>
              <th>數量</th>
              <th>計分</th>
              <th>總共</th>
            </tr>
          </thead>
          <tbody>
            <!-- 遍歷項目列表 -->
            <tr v-for="(item, index) in items" :key="index">
              <td>
                <!-- 顯示項目圖片 -->
                <img 
                  :src="`/a-${index + 1}.webp`" 
                  alt="Image" 
                  @click="handleImageClick(index + 1)"
                  class="cursor-pointer hover:opacity-80"
                />
              </td>
              <td>{{ formatNumber(item.score) }}</td>
              <td>
                <!-- 數量輸入框 -->
                <input
                  v-model="item.quantity"
                  type="text"
                  @input="handleInput(item)"
                  @blur="handleBlur(item)"
                >
              </td>
              <td>{{ formatNumber(item.score * (item.quantity || 0)) }}</td>
              <!-- 總分單元格 -->
              <td 
              v-if="index === items.length - 1" 
              class="total-cell text-[24px]">
                <count-up
                :end-val="total"
                :options="{ duration: 0.75, enableScrollSpy: true, useGrouping: false }">
                {{ formatNumber(total) }}
                </count-up>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 通過印章 -->
        <img v-if="showStamp" src="/pass.png" alt="通過" class="watermark" :class="{ 'stamp-animation': isAnimating }">
        <!-- 通過音效 -->
        <audio ref="passAudio" src="/pass.wav"></audio>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import CountUp from 'vue-countup-v3'

// 定義項目列表
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

// 計算總分
const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.score * (Number(item.quantity) || 0), 0)
})

// 處理輸入事件
const handleInput = (item) => {
  item.quantity = item.quantity.replace(/^0+/, '') // 移除前導零
  saveData() // 保存數據
}

// 處理失焦事件
const handleBlur = (item) => {
  if (item.quantity === '0') {
    item.quantity = '' // 如果輸入為0，清空輸入
  }
  saveData() // 保存數據
}

// 控制印章顯示和動畫
const showStamp = ref(false)
const isAnimating = ref(false)
const passAudio = ref(null)

// 控制翻牌動畫
const isFlipping = ref(false)

// 監聽總分變化
watch(total, (newTotal, oldTotal) => {
  if (newTotal >= 1000 && !showStamp.value) {
    showStamp.value = true
    isAnimating.value = true
    passAudio.value.play() // 播放音效
    setTimeout(() => {
      isAnimating.value = false
    }, 500) // 動畫持續時間
  } else if (newTotal < 1000 && showStamp.value) {
    showStamp.value = false
  }
  if (newTotal !== oldTotal) {
    isFlipping.value = true
    setTimeout(() => {
      isFlipping.value = false
    }, 500) // 動畫持續時間
  }
})

// 保存數據到本地存儲
const saveData = () => {
  const data = {
    items: items.value,
    expiry: Date.now() + 8 * 24 * 60 * 60 * 1000 // 8天後過期
  }
  localStorage.setItem('scoreData', JSON.stringify(data))
}

// 從本地存儲加載數據
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

// 組件掛載時加載數據
onMounted(() => {
  loadData()
})

// 格式化數字（添加千位分隔符）
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 清除所有分數
const clearScores = () => {
  items.value.forEach(item => {
    item.quantity = ''
  })
  saveData()
}

const isLoading = ref(true)

onMounted(() => {
  // 模擬加載過程
  setTimeout(() => {
    isLoading.value = false
  }, 2000) // 2秒後隱藏加載動畫
})

</script>

<style scoped>
/* 全局字體設置 */
* {
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 900;
}

/* 數字相關元素的字體設置 */
input, td:nth-child(2), td:nth-child(4), .total-cell {
  font-family: 'Anton', sans-serif;
  font-weight: normal; /* Anton 字體不需要 900 的字重 */
}

/* 輸入框樣式 */
input {
  width: 50px;
  text-align: center;
  background-color: #fff;
  border: none;
  border-bottom: 1px solid #333;
  outline: none;
  padding: 2px 0;
  font-family: 'Anton', sans-serif;
  font-weight: normal;
}

/* 頁面背景設置 */
.page-container {
  
  background-image: url('/bg.jpg');
  background-size: cover;
  background-position: center;
  
  /* background: #333; */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 表格容器樣式 */
.table-container {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  width: 850px;
  margin: 0 auto;
  position: relative;
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
}

/* 表格樣式 */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid #333;
}

th, td {
  padding: 8px;
  text-align: center;
  border: 1px solid #333;
}

th {
  background-color: #fff;
}

/* 圖片樣式 */
img {
  width: 30px; 
  height: auto;
  opacity: 1;
  display: block;
  margin: 0 auto;
}

/* 水印（印章）樣式 */
.watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  width: 40vw;
  max-width: 400px;
  height: auto;
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
  z-index: 1000;
  transition: opacity 0.3s ease-out;
}

/* 印章動畫 */
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

/* 按鈕過渡效果 */
.absolute {
  transition: background-color 0.3s ease;
}

/* 加載動畫 */
.loading-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>