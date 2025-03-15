<script setup lang="ts">
import {defineProps, defineEmits, watch, ref, reactive,onMounted} from 'vue';
import {$t} from "@/locales";
import  { FormInst,FormItemRule, } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';

import {postChannel,putChannel, resource_types} from "@/service/api";


defineOptions({
  name: 'log'
});

import { useMessage } from 'naive-ui'
import object from "async-validator/dist-types/validator/object";
import bus from "@/utils/bus";
const message = useMessage()
const formRef = ref<FormInst | null>(null)






// 定义 props，接受外部传入的值
let props = defineProps({
  name: String,
  objectId: String,
});

const state = reactive({
  name:"",
  objectId:"",
  loading:true,
  log:""
});



watch(props, () => {
  if (props.objectId) {
    state.name=props.name
    state.objectId=props.objectId
  }
})
const emits = defineEmits(['update:visible']);


function updateVisible(value: boolean) {
  emits('update:visible', value);
}

function handleClose() {
  updateVisible(false);
}

onMounted(async () => {


  let topic = `$dg/user/channel/${props.objectId}`

  bus.off(topic)
  bus.on(topic, (e) => {
    // const {data} = JSON.parse(decode(e))
    // let resData = deepClone(data)
    state.loading=false
    state.log=(`${state.log}${e}\n`)
  });

})


</script>

<template>
  <!-- 使用 internalVisible 替代原来的 v-model:show -->

  <NCard :title="state.name" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
    <n-log style="height: 600px" rows="20" :loading="state.loading" :log="state.log" />
  </NCard>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
