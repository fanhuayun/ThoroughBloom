<script setup lang="ts">
import { defineProps, reactive, watch } from 'vue';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useEcharts } from '@/hooks/common/echarts';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  headerExtra: {
    type: String,
    default: ''
  },
  marginTop: {
    type: Number,
    default: 0
  },
  footerList: {
    type: Array,
    default: () => []
  },
  columnCount: {
    type: Number,
    default: 3
  },
  XItems: {
    type: Array,
    default: () => []
  },
  YItems: {
    type: Array,
    default: () => []
  },
  lineTitle: {
    type: String,
    default: ''
  }
});

defineOptions({
  name: 'LineCard'
});
const appStore = useAppStore();
const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: [props.lineTitle]
  },
  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [] as string[]
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      color: '#26deca',
      name: props.lineTitle,
      type: 'line',
      smooth: false,
      data: [] as number[]
    }
  ]
}));

async function mockData() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  updateOptions(opts => {
    opts.xAxis.data = props.XItems;
    opts.series[0].data = props.YItems;
    return opts;
  });
}

function updateLocale() {
  updateOptions((opts, factory) => {
    const originOpts = factory();

    // opts.legend.data = originOpts.legend.data;
    // opts.series[0].name = originOpts.series[0].name;

    return opts;
  });
}

async function init() {
  mockData();
}

watch(
  () => appStore.locale,
  () => {
    updateLocale();
  }
);

// init
init();
</script>

<template>
  <NCard
    :bordered="false"
    class="card-wrapper"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
  >
    <template v-if="props.headerExtra !== ''" #header-extra>
      <span class="user-select-none inline-flex cursor-pointer items-center gap-2" @click="goToMap">
        {{ props.headerExtra }}
        <span class="h-4 w-4 text-center leading-4">></span>
      </span>
    </template>
    <div class="h-100 flex-col">
      <div class="flex flex-1 pb-20px" :class="[props.footerList.length > 0 ? 'border-b-0.5 border-b-[#e5e7eb]' : '']">
        <div ref="domRef" class="h-full w-full"></div>
      </div>
    </div>
  </NCard>
</template>

<style scoped></style>
