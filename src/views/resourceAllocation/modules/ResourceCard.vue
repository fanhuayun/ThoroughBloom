<script setup>
import { computed, ref, watch } from 'vue';
import { useThemeStore } from '@/store/modules/theme';
import { useModalStore } from '../stores/modal.js';
const themeStore = useThemeStore();
console.log('----》', themeStore.themeColors.primary);
watch(
  () => themeStore.themeColors,
  newVal => {
    // 处理变化
    console.log('..........>', newVal);
  },
  { deep: true } // 深度监听对象内部变化
);
function hexToRgba(hex, alpha) {
  // 移除可能的#号并转换为大写
  hex = hex.replace('#', '').toUpperCase();

  // 检查是否是有效的十六进制颜色值
  if (hex.length !== 6) {
    throw new Error('Invalid hex color value');
  }

  // 提取RGB分量
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // 确保alpha值在0到1之间
  alpha = Math.max(0, Math.min(1, alpha));

  // 返回rgba字符串
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
const modalStore = useModalStore();

const handle = () => {
  console.log('xxxx');
  modalStore.openModal('数据存储服务');
};
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const rowsToShow = ref(3); // 默认展示 3 行
const itemsPerRow = 2; // 每行 2 个
const totalToShow = computed(() => rowsToShow.value * itemsPerRow);
const visibleItems = computed(() => props.items.slice(0, totalToShow.value));
const hasMore = computed(() => totalToShow.value < props.items.length);

const loadMore = () => {
  rowsToShow.value += 3; // 每次展开 3 行（即 6 个）
};

const showMoreText = computed(() => `点击加载更多`);
</script>

<template>
  <div class="container">
    <div class="grid">
      <div
        v-for="(item, index) in visibleItems"
        :key="index"
        class="grid-item"
        :style="{
          backgroundColor: hexToRgba(themeStore.themeColors.primary, 0.2)
        }"
      >
        <img src="../../../assets/imgs/x-icon.png" />
        <div class="grid-item-card">
          <div class="title">{{ item.title }}</div>
          <div class="content text-color-[#000000]">
            {{ item.introduce }}
          </div>
          <div class="btnList">
            <div
              class="btn"
              style="color: #ffffff"
              :style="{
                backgroundColor: hexToRgba(themeStore.themeColors.primary, 1)
              }"
              @click="modalStore.openModal('方案咨询', '立即购买', '')"
            >
              立即购买
            </div>
            <div
              class="btn"
              style="color: #ffffff"
              :style="{
                backgroundColor: hexToRgba(themeStore.themeColors.primary, 1)
              }"
              @click="modalStore.openModal(item.title, '了解详情', item.detail)"
            >
              了解详情
            </div>
            <div
              class="btn"
              style="color: #ffffff"
              :style="{
                backgroundColor: hexToRgba(themeStore.themeColors.primary, 1)
              }"
              @click="modalStore.openModal('联系我们', '联系我们', '')"
            >
              联系我们
            </div>
          </div>
        </div>
      </div>
    </div>
    <p
      v-if="hasMore"
      class="more-text"
      :style="{
        color: hexToRgba(themeStore.themeColors.primary, 1)
      }"
      @click="loadMore"
    >
      {{ showMoreText }}
    </p>
    <p v-else class="no-more-text">敬请期待更多资源~</p>
    <div
      style="
        width: 1200px;
        height: 1px;
        margin-bottom: 3rem;
        background: #714898;
        border-radius: 0px 0px 0px 0px;
        opacity: 0.08;
      "
    />
  </div>
</template>

<style scoped>
.btnList {
  display: flex;
  gap: 0.6rem;
}

.content {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #000000;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.btn {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: bold;
  font-size: 0.875rem;
  color: #714898;
  text-align: left;
  font-style: normal;
  text-transform: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5.5rem;
  height: 2.25rem;
  background: #efe6f7;
  border-radius: 8px 8px 8px 8px;
  color: rgba(113, 72, 152, 1);
}

.container {
  width: 75rem;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-start;
  /* 关键: 让项目靠左对齐，而不是居中 */
  align-items: flex-start;
}

.grid-item-card {
  margin-left: 1.5rem;
  height: 100%;
  display: flex;
  gap: 0.6rem;
  flex-direction: column;
  align-items: start;
  justify-content: space-evenly;
}

.title {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: bold;
  font-size: 1.125rem;
  color: #150f1a;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.grid-item {
  width: calc(50% - 0.25rem);
  /* 2 列布局，减去间隙 */
  padding: 0.5rem;
  background: #f5f5f5;
  text-align: center;
  border-radius: 0.25rem;
  font-size: 1rem;
  width: 36.75rem;
  height: 11.3rem;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  padding: 1.5rem;
}

.grid-item > img {
  width: 6rem;
  height: 6rem;
}

.more-text,
.no-more-text {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: #007aff;
  cursor: pointer;
}

.more-text {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  color: #714898;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.no-more-text {
  color: #9d97a2;
  text-align: center;
}
</style>
