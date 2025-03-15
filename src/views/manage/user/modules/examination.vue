<script setup lang="ts">
import {defineProps, defineEmits, watch, ref, reactive,onMounted} from 'vue';
import {$t} from "@/locales";
import {FormInst, FormItemRule, NCascader,} from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import dayjs from "dayjs";

import { useRouterPush } from '@/hooks/common/router';
const { routerPushByKey } = useRouterPush();

defineOptions({
  name: 'Examination'
});

import { useMessage } from 'naive-ui'
import {_RoleList, Get_mark, postrole, Putroleuser} from "@/service/api";

const message = useMessage()
const formRef = ref<FormInst | null>(null)





// 定义 props，接受外部传入的值
let props = defineProps({
  objectId: String,
  name: String,

  visible: Boolean
});

const state = reactive({
    UserId:"",
    results:[]

});



async function get_Get_mark() {
  const params={'userId':state.UserId }


  const {data,error} =await Get_mark(params)
  if (data.status==200){
    state.results =data.results
    console.log(state.results)
  }
}


watch(props, () => {
  if (props.visible) {
    state.UserId  =props.objectId
    state.results  =[]


    get_Get_mark()
  }
})
const emits = defineEmits(['update:visible','submitted']);


function updateVisible(value: boolean) {
  emits('update:visible', value);
}

function handleClose() {
  updateVisible(false);
}


function formatDuration(seconds, max = 5400) {
  // seconds=max-seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = '';
  if (seconds >= 5400) {
    return '0秒'
  }
  if (hours > 0) {
    result += `${hours}小时`;
  }
  if (minutes > 0) {
    result += `${minutes}分钟`;
  }
  if (remainingSeconds > 0) {
    result += `${remainingSeconds}秒`;
  }

  return result || '0秒';
}
 function goToConsole(info: object)  {
  console.log(info)
   routerPushByKey('tools_erorrqusetiondata', {
    query: {
      userId: state.UserId,
      name: state.name,
      number: info.number
    }
  });
  console.log(info)
};

</script>

<template>
  <!-- 使用 internalVisible 替代原来的 v-model:show -->
  <NModal :show="props.visible" @update:show="updateVisible" :title="props.name+'考试记录'" preset="dialog" >
    <n-table >
      <thead>
      <tr>
        <th>试卷</th>
        <th>交卷时间</th>
        <th>分数</th>
        <th>用时时间</th>
        <th>错题记录</th>

      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in state.results">
        <td>{{item.name}}</td>
        <td>{{ dayjs(item.createdat).format("YYYY-MM-DD HH:mm:ss") }}</td>
        <td>{{item.mark}}</td>
        <td>{{formatDuration(5400-item.date)}}</td>
        <td><NButton  ghost size="small" @click="goToConsole(item)">查看</NButton> </td>


      </tr>
      </tbody>
    </n-table>
  </NModal>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
