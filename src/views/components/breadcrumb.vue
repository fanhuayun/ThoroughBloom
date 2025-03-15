<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { watch, ref } from 'vue';


const route = useRoute()
const router = useRouter()

const breadcrumbList = ref([])

const initBreadcrumbList = () => {
  breadcrumbList.value = route.matched
}

const handleRedirect = (path) => {
  router.push(path)
}

watch(route, () => (
  initBreadcrumbList()
), { deep: true, immediate: true })

</script>

<template>
  <n-breadcrumb class="breadcrumb" separator="/">
    <n-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
      <span class="no-redirect" v-if="index === breadcrumbList.length - 1">{{item.name}}</span>
      <span class="redirect" v-else @click="handleRedirect(item.path)">{{item.name}}</span>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<style scoped>
.breadcrumb{
  margin: 10px 0;
}
.no-redirect{
  color: #666;
}
.redirect{
  color: #3a3a3a;
}
</style>
