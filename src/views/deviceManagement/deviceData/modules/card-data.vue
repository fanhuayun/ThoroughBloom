<script setup>
import { defineProps, reactive } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});

const state = reactive({
  items: [
    { name: '电量', key: 'power', icon: 'dianliang.png' },
    { name: '定时模式', key: 'timer_mode', icon: 'timemode.png' },
    { name: '通道状态', key: 'channel_status', icon: 'paishui.png' },
    { name: '加热状态', key: 'heating_status', icon: 'huo.png' },
    { name: '上仓门', key: 'upper_door', icon: 'cangmen.png' },
    { name: '下仓门', key: 'lower_door', icon: 'xiacangmen.png' },
    { name: '设备版本', key: 'device_version', icon: 'shebeibanben.png' },
    { name: '高温限值', key: 'high_temp_limit', icon: 'maxwendu.png' },
    { name: '低温限值', key: 'low_temp_limit', icon: 'minwendu.png' }
  ]
});
</script>

<template>
  <div class="mx-auto px-4 container">
    <div class="grid grid-cols-2 max-w-5xl gap-4">
      <div
        v-for="(item, index) in state.items"
        :key="item.id"
        class="flex flex-1 overflow-hidden pb-20px md:items-center"
      >
        <img
          :src="'/dgiot_file/device/topo/' + item.icon"
          alt="头像"
          class="h-18 w-18 rounded-full"
        />
        <div
          class="ml-6 h-15 flex-col text-black font-semibold md:justify-evenly"
          style="font-family: 'Arial Normal', 'Arial', sans-serif"
        >
          <div class="text-lg">
            {{ props.data[item.key] }}
          </div>
          <div class="text-lg text-color-[#a6a6a6]" style="font-family: 'Arial Normal', 'Arial', sans-serif">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 这里可以添加一些全局的样式，如果需要的话 */
</style>
