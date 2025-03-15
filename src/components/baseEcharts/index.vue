<script lang="tsx" setup>
import { ref, onMounted, watch, defineProps, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

// 定义 props
const props = defineProps<{
  height?: string;
  width?: string;
  option?: echarts.EChartsOption;
}>();

// 创建 ECharts 实例的引用
const chartRef = ref(null);
let chartInstance = null;

// 初始化 ECharts
const initChart = () => {
  if (!chartRef.value) return;
  // 销毁之前的实例（如果存在）
  if (chartInstance) {
    chartInstance.dispose();
  }
  // 初始化 ECharts 实例
  chartInstance = echarts.init(chartRef.value);
  // 设置图表配置
  if (props.option) {
    chartInstance.setOption(props.option);
  }
};

// 监听 props.option 的变化
watch(
  () => props.option,
  newOption => {
    if (chartInstance && newOption) {
      chartInstance.setOption(newOption);
    }
  },
  { deep: true } // 深度监听
);

// 组件挂载时初始化 ECharts
onMounted(() => {
  initChart();
});

// 组件卸载时销毁 ECharts 实例
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<template>
  <div ref="chartRef" :style="{ height: height, width: width }"></div>
</template>

<style scoped>
/* 确保容器有高度和宽度 */
/* div {
  height: 100%;
  width: 100%;
} */
</style>
