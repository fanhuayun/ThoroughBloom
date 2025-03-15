<script setup lang="ts">
import { watch, ref, reactive,onMounted} from 'vue';
import {$t} from "@/locales";
import {FormInst, FormItemRule, NCascader,} from 'naive-ui';
import { useAppStore } from '@/store/modules/app';




defineOptions({
  name: 'Deleteall'
});

import { useMessage } from 'naive-ui'
import {_RoleList, Batch, getQuestion, postrole, Putroleuser} from "@/service/api";

const message = useMessage()
const formRef = ref<FormInst | null>(null)





// 定义 props，接受外部传入的值
let props = defineProps({
  objectId: String,
  depname: Array,
  visible: Boolean
});

const state = reactive({

data: {
  name:""
},
  options:{
    re:[],

  },
  rules:{

  },

});



async function get_RoleList() {
  const params= {where:
  {
    parent:"520817600c"
  }
}
  const list=[]

  const {data,error} =await _RoleList(params)
  if (data.status==200){
    data.results.forEach((item)=>{
      list.push({label:item.name,value:item.name })
    })
  }
  state.options.re=list
}


watch(props, () => {
  if (props.visible) {


    get_RoleList()
  }
})
const emits = defineEmits(['update:visible','submitted']);


function updateVisible(value: boolean) {
  emits('update:visible', value);
}

function handleClose() {
  updateVisible(false);
}


async function handleValidateButtonClick() {


  // console.log(state.data)
      if (state.data.name !== ''){
        // console.log(state.data)
        const name=state.data.name
        const list=[]
        const params={
          where:{name}
        }
        const {data,error} =await getQuestion(params)
        if (data.status==200){
          data.results.forEach((item)=>{
            const D = {
              "path": `/classes/Question/${item.objectId}`,
              "method": "DELETE",
              body:{}
            }
            list.push(D)
          })
          // console.log('list',list)
          const error1 =await batch_(list)
          if (!error1){
            handleClose();
            emits('submitted')
          }
        }

        // const {data,error} = await Putroleuser(state.data)

      }else{
        handleClose();
        emits('submitted')
      }



}
async function batch_(B:any){
  const body={ "requests": B}
  const{data,error}=await Batch(body)
  // if (!error){
  //   getData()
  // }
  return error

}


</script>

<template>
  <!-- 使用 internalVisible 替代原来的 v-model:show -->
  <NModal :show="props.visible" @update:show="updateVisible"  preset="dialog" >
    <NForm ref="formRef"
           :model="state.data"
           :rules="state.rules" >
      <NFormItem label="试卷名" path="">
        <NSelect  v-model:value="state.data.name"  :options="state.options.re" />
      </NFormItem>


    </NForm>
<!--    <template #footer>-->
      <NSpace :size="16" justify="end" >
        <NButton @click="handleClose">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleValidateButtonClick">{{ $t('common.confirm') }}</NButton>
      </NSpace>

  </NModal>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
