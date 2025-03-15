<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useTabStore } from '@/store/modules/tab';
defineOptions({ name: 'InitButton' });
const tabStore = useTabStore();
const router = useRouter();
const back = () => {
  tabStore.removeActiveTab();
  router.back();
};
</script>

<template>
  <NButton color="#E0F3EC" class="h-10 rounded-3 shadow-md" @click="back">
    <span class="text-[#009E64]">返回</span>
  </NButton>
</template>

<style scoped></style>
