<script setup lang="ts">
import {defineProps, defineEmits, watch, ref, reactive} from 'vue';
import {$t} from "@/locales";
import { useAppStore } from '@/store/modules/app';
// import {NButton,NTable} from "naive-ui";
import {useTable, useTableOperate} from '@/hooks/common/table';
import {getpolling,postpolling} from "@/service/api";
import {localStg} from "@/utils/storage";

defineOptions({
  name: 'Acquisition'
});




// 定义 props，接受外部传入的值
let props = defineProps({
  productId: String, // 假设这是你要传递的地图的 id
  visible: Boolean // 控制弹窗显示的状态
});


watch(props, () => {
  if (props.visible) {
     state.productId=props.productId
    console.log("props",props)
     polling(props.productId)
  }
})

async function polling(id:string){
  const { data ,error}=await getpolling(id)
  if (data.data){
    state.polling=data.data
  }
}


// console.log(props)
// const htmlContent = ref('<p>测试 <span style="font-family: inherit;"><span class="ql-cursor"></span></span></p >');
// 定义 emits，用于通知父组件弹窗何时关闭
const emits = defineEmits(['update:visible']);

// // 当 props.visible 发生变化时，更新 internalVisible
// watch(() => props.visible, (newVal) => {
//   internalVisible.value = newVal;
// });

// 更新父组件的 visible 状态
function updateVisible(value: boolean) {
  emits('update:visible', value);
}



// 定义一个方法，用于在弹窗关闭时调用
function handleClose() {
  updateVisible(false);
}

const state = reactive({
    polling:0,
    productId:"",
});



async function handleSubmit() {



  const {data,error}=await postpolling(state)


  if (data.status==200){
    handleClose();
  }

}


</script>

<template>
  <!-- 使用 internalVisible 替代原来的 v-model:show -->
  <NModal :show="props.visible" @update:show="updateVisible"  preset="dialog" title="设置采集间隔">

    <n-input-number  placeholder="采集策略(单位：秒)" v-model:value="state.polling"></n-input-number>

    <NSpace :size="16" justify="end" style="margin-top:30px " >
      <NButton @click="handleClose">{{ $t('common.cancel') }}</NButton>
      <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
    </NSpace>
  </NModal>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
