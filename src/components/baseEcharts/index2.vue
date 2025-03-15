<script lang="tsx" setup>
import { nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import * as echarts from 'echarts';
import T from './echarts-theme-T';

// 注册 ECharts 主题
echarts.registerTheme('T', T);

// 定义 props
const props = defineProps<{
  height?: string;
  width?: string;
  option?: echarts.EChartsOption;
}>();

// 定义 ref
const tlEcharts = ref<HTMLDivElement | null>(null);
const myChart = ref<echarts.ECharts | null>(null);

// 处理窗口大小变化
const handleResize = () => {
  myChart.value?.resize();
};

// 绘制图表
const draw = () => {
  // console.log('tlEcharts.value',tlEcharts.value, props.option);

  if (!tlEcharts.value) return;
  myChart.value = echarts.init(tlEcharts.value, 'T');
  myChart.value.setOption(props.option || {});
  window.addEventListener('resize', handleResize);
};

// 监听 option 变化
watchEffect(() => {
  if (myChart.value) {
    myChart.value.setOption(props.option || {});
  }
});

// 组件挂载时绘制图表
onMounted(async() => {
  console.log('绘制图画');
  await nextTick();
  draw();
  // 手动触发一次 resize 事件，确保图表正确调整大小
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 200);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div ref="tlEcharts" class="echart" :style="{ height: height, width: width }"></div>
</template>
