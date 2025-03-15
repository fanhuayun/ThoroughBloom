<script setup lang="ts">
import {defineProps, defineEmits, watch, ref, reactive} from 'vue';
import {$t} from "@/locales";
import { useAppStore } from '@/store/modules/app';

import {useTable, useTableOperate} from '@/hooks/common/table';
import {queryChannel,putChannel} from "@/service/api";
import {localStg} from "@/utils/storage";

defineOptions({
  name: 'Channel'
});

const map=reactive({
  data:{
    '1':'采集通道',
    '2':'资源通道',
  }
})


// 定义 props，接受外部传入的值
let props = defineProps({
  productId: String, // 假设这是你要传递的地图的 id
  model: String, // 假设这是你要传递的地图的 id
  visible: Boolean // 控制弹窗显示的状态
});


watch(props, () => {
  if (props.visible) {
     state.productId=props.productId
     getchannel(props.productId)
  }
})


// console.log(props)
// const htmlContent = ref('<p>测试 <span style="font-family: inherit;"><span class="ql-cursor"></span></span></p >');
// 定义 emits，用于通知父组件弹窗何时关闭
const emits = defineEmits(['update:visible','update']);

// // 当 props.visible 发生变化时，更新 internalVisible
// watch(() => props.visible, (newVal) => {
//   internalVisible.value = newVal;
// });

// 更新父组件的 visible 状态
function updateVisible(value: boolean) {
  emits('update:visible', value);
}

async function getchannel(equipId){
  let params = { }
  if (props.model=='other'){
    params={
      count: 'objectId',
      order: '-createdAt',
      where: {'product':{"$ne":{"__type":"Pointer","className":"Product","objectId":equipId}} ,"type":{"$in":["1","3"]}}
    }
  } else  if (props.model=='save'){
    params={
      count: 'objectId',
      order: '-createdAt',
      where: {'product':{"$ne":{"__type":"Pointer","className":"Product","objectId":equipId}} ,"type":{"$in":["2"]}}
    }
  }
  const{data,error} =await queryChannel(params)
  if (data.status==200){
    state.results=data.results
  }
}



// 定义一个方法，用于在弹窗关闭时调用
function handleClose() {
  updateVisible(false);
}

const state = reactive({
    results:[],
    productId:"",
});



async function addchannel(channleId) {

  const data1={'product':
        {'objects':[{"__type": "Pointer",
        "className": "Product",
        "objectId": state.productId
      }],
      '__op':'AddRelation'}}

  const {data,error}=await putChannel(channleId,data1)
  if (data.status==200){
    emits('update',props.model);
    handleClose();
  }
}


</script>

<template>
  <!-- 使用 internalVisible 替代原来的 v-model:show -->
  <NModal :show="props.visible" @update:show="updateVisible" style="width: 800px;"  preset="dialog" title="添加通道">

    <n-scrollbar style="max-height: 700px">
      <n-table >
        <thead>
        <tr>
          <th>通道编号</th>
          <th>通道名称</th>
          <th>通道类型</th>
          <th>服务类型</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="state.results" v-for="(item, index) in state.results">
          <td>{{item.objectId}}</td>
          <td>{{item.name}}</td>
          <td>{{map.data[item.type]}}</td>
          <td>{{item.cType}}</td>
          <td>
            <NSpace :size="16" >
              <NButton type="primary" @click="addchannel(item.objectId)" >添加</NButton>
            </NSpace>
          </td>
        </tr>
        </tbody>
      </n-table>
    </n-scrollbar>
  </NModal>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
