<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
import qs from 'qs';
import { localStg } from '@/utils/storage';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();

const iframeRef = ref<HTMLIFrameElement | null>(null);
const isFullscreen = ref(false); // 是否全屏状态
const angularPageUrl = ref('https://test.hgjzt.com/topo'); // Angular 项目的页面 URL
// const angularPageUrl = ref('http://localhost:4200/topo'); // Angular 项目的页面 URL
const tokenInterval: NodeJS.Timeout | null = null; // 定时器句柄

// 切换全屏状态
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// 定期发送 token 信息给 iframe
const createUrl = (url: any) => {
  const sessionToken = localStg.get('token');
  const userId = localStg.get('userobjectId');
  const params = {
    sessionToken,
    userId,
    productId: route.query.productId,
    deviceId: route.query.deviceId||null,
    viewId: route.query.viewId||null
  };
  return `${url}?${qs.stringify(params)}`;
};

onMounted(() => {
  angularPageUrl.value = createUrl(angularPageUrl.value);
});
</script>

<template>
  <NSpace vertical :size="16">
    <NGrid :x-gap="16" :y-gap="16" :cols="8">
      <NGridItem :span="5">
        <div class="h-206 rounded-4 bg-[#ffffff] p-5 p-x-6 shadow-md">
          <div class="mb-4 flex items-center justify-between">
            <NButton  type="primary" class="mr-2 h-10 rounded-3 shadow-md" @click="appStore.backPageAndCloseCurTab">
              <span >返回</span>
            </NButton>
            <NButton
              v-if="!isFullscreen"
              type="primary"
              class="mr-2 h-10 rounded-3 shadow-md"
              @click="toggleFullscreen"
            >
              <span >全屏</span>
            </NButton>
          </div>
          <div class="iframe-container" :class="[{ fullscreen: isFullscreen }]" aria="fuxa">
            <iframe id="angularFrame" ref="iframeRef" :src="angularPageUrl" class="h-full w-full" frameborder="0" />
          </div>
          <NButton
            v-if="isFullscreen"
            type="primary"
            class="fullscreen-exit-button h-10 rounded-3 shadow-md"
            @click="toggleFullscreen"
          >
            <span >退出全屏</span>
          </NButton>
        </div>
      </NGridItem>
      <NGridItem :span="3">
        <div class="h-206 rounded-4 bg-[#ffffff] p-5 p-x-6 shadow-md"></div>
      </NGridItem>
    </NGrid>
  </NSpace>
</template>

<style scoped>
.iframe-container {
  position: relative;
  height: 46.25rem; /* 初始高度 */
  width: 100%; /* 初始宽度 */
  transition: all 0.3s ease;
}

.iframe-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000; /* 确保在最前 */
  background: #ffffff; /* 可选背景颜色 */
}

.fullscreen-exit-button {
  position: fixed;
  top: 4rem; /* 距离顶部 */
  right: 1rem; /* 距离右侧 */
  z-index: 1001; /* 确保高于 iframe */
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}
</style>
