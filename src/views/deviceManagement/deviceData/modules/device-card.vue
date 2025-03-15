<script setup lang="ts">
import { defineProps, reactive, watch } from 'vue';
import dayjs from 'dayjs';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  }
});

console.log('props.item', props.item);
const appStore = useAppStore();
const { routerPushByKey } = useRouterPush();

const state = reactive({

  infoList: [
    {
      key: 'deviceName',
      label: '设备名称：'
    },
    {
      key: 'deviceId',
      label: ''
    },
    {
      key: 'deviceVersion',
      label: '设备版本：',
      fx: () => '无'
    },
    {
      key: 'reportTime',
      label: '最新上报时间：'
    },
    {
      key: 'address',
      label: '地址：'
    }
  ]
});

async function init() {}

watch(
  () => appStore.locale,
  () => {}
);

// init
init();
const test = () => {
  console.log('first');
};
const goToHistoryData = (id: any) => {
  routerPushByKey('devicecontrol_meteorologicalequipment_historydata', { params: { equipId: id } });
}
const goToEquipData = (id: any) => {
  routerPushByKey('devicecontrol_meteorologicalequipment_equipdata', { params: { equipId: id } });
};
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
    <div class="pd h-full w-full flex-col justify-between">
      <div>
        <div class="text-gray-1600 align-items relative flex text-lg font-bold">
          环境监测
          <div class="absolute top-0 h-full w-9 border-l-9 border-l-[#009E64] -left-24px" />
        </div>
        <div class="mt-2 pr-6">
          <div v-for="(subItem, index) in state.infoList" :key="index" class="mb-2 mt-3 text-base font-black font-bold">
            {{ subItem.label }}
            {{ subItem.fx ? subItem.fx(props.item[subItem.key], props.item) : props.item[subItem.key] }}
          </div>
        </div>
      </div>
      <div class="mt-6 flex flex-wrap items-center">

        <NButton class="mr-3px" size="small" @click="goToEquipData(props.item.deviceName)">24小时数据</NButton>

        <NButton class="mr-3px" size="small" @click="goToHistoryData(props.item.deviceId)">历史数据</NButton>
      </div>
    </div>
  </NCard>
</template>

<style scoped>
.flex-item {
  position: relative;
}
</style>
