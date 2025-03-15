<!-- eslint-disable no-console -->
<script setup lang="tsx">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { getdeviceinfo, } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import CardData from './modules/card-data.vue'
import DeviceData from '../deviceData/index.vue'


const appStore = useAppStore();
const route = useRoute();
const state = reactive({
    deviceinfo:{},
    save:[],
    other:[]
});



onMounted(() => {
  const equipId = route.params.equipId;
  console.log("equipId",equipId)
  deviceinfo_(equipId)

  // state.baseInfo.deviceId = equipId;
});

async function deviceinfo_(id){
  const {data,error} =await getdeviceinfo(id)
  state.deviceinfo=data
}










</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <n-card v-if="state.deviceinfo.name" :title="state.deviceinfo.name" style="margin-bottom: 16px">
      <n-tabs type="line" animated   >
        <n-tab-pane name="info" tab="设备信息">


        </n-tab-pane>
        <n-tab-pane name="real_time" tab="实时数据">
        <CardData :deviceId="state.deviceinfo.objectId"/>

        </n-tab-pane>
        <n-tab-pane name="thing" tab="历史数据">
          <DeviceData />

        </n-tab-pane>

      </n-tabs>
    </n-card>
   </div>

</template>

<style scoped></style>
