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

import Log from '../../../tools/log/index.vue';




// 定义 props，接受外部传入的值
let props = defineProps({
  name: String,
  objectId: String,
  visible: Boolean
});

const state = reactive({
  name:"",
  objectId:"",
  loading:true,
});



watch(props, () => {
  if (props.visible) {
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



</script>

<template>
  <!-- 使用 internalVisible 替代原来的 v-model:show -->
  <NModal :show="props.visible" @update:show="updateVisible"  style="width: 1400px; "  preset="dialog" :title="state.name">
<!--    <n-log :loading="state.loading" :log="state.log" />-->
    <Log   v-if="state.objectId.length>0" :objectId="state.objectId" :name="state.name"   > </Log>
    <NSpace :size="16" justify="end" style="margin-top:30px " >
      <NButton @click="handleClose">关闭</NButton>
    </NSpace>
  </NModal>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
