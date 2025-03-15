<script setup lang="ts">
import {defineProps, defineEmits, watch, ref, reactive,computed} from 'vue';
import {$t} from "@/locales";
import type { FormInst,FormItemRule, } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';

import {postChannel,putChannel, resource_types} from "@/service/api";


defineOptions({
  name: 'modal'
});

import { useMessage } from 'naive-ui'
import object from "async-validator/dist-types/validator/object";
const message = useMessage()
const formRef = ref<FormInst | null>(null)



const stata=reactive({
  status:false,
  selectData:{},
  select:[],
  selectboolean:[{label: '是', value: true},{label: '否', value: false}],
  data:{}
})


// 定义 props，接受外部传入的值
let props = defineProps({
  data: Object,
  model:Boolean,
  visible: Boolean
});

const state = reactive({
  data:{
    config:{}

  },
  rules:{
    name:{
      required: true,
      message: '请输入名称',
      trigger: ['input']
    },
    cType: {
        required: true,
        message: '请选择',
        trigger: ['blur', 'change']
      },
    config:{}
  },
});



watch(props, () => {
  if (props.visible) {


    model()
    getresource_types()
    // polling(props.productId)
  }
})

async function getresource_types(){

  let List=[]
  let map={}
  const {data,error}= await resource_types()
  if (!error){
    data.forEach((item) => {
      List.push({ label: item.title.zh, value: item.cType })
      map[item.cType]=item
    })

  }
  stata.select=List
  stata.selectData=map

  cType()
}

function model(){

  if (!props.model){

  }else {

    stata.status=props.model
    state.data=props.data



  }



}





// console.log(props)
// const htmlContent = ref('<p>测试 <span style="font-family: inherit;"><span class="ql-cursor"></span></span></p >');
// 定义 emits，用于通知父组件弹窗何时关闭
const emits = defineEmits(['update:visible','update']);



// 更新父组件的 visible 状态
function updateVisible(value: boolean) {
  emits('update:visible', value);
}



// 定义一个方法，用于在弹窗关闭时调用
function handleClose() {
  updateVisible(false);
}


function cType(){

  const params= stata.selectData[state.data.cType].params



  let map={}

  for (const paramsKey in params) {
    let config={}

    map[paramsKey]={...params[paramsKey],...{key:"config."+ paramsKey }}
    if (params[paramsKey].type=='integer'){
      config={
        message: '请输入',
        trigger: ['input'],
        type: 'number',
        required:params[paramsKey].required
      }
    }else if (params[paramsKey].type=='enum'){
      config={
        message: '请选择',
        trigger: ['blur', 'change'],
        required:params[paramsKey].required
      }
    }else if (params[paramsKey].type=='string'){
      config={
        message: '请输入',
        trigger: ['input'],
        required:params[paramsKey].required
      }
    }
    if (!stata.status){
      state.data.config[paramsKey]=params[paramsKey].default
    }

    state.rules.config[paramsKey]=config
  }
  if (!stata.status){
    state.data.type=stata.selectData[state.data.cType].type

  }
  stata.data.params=map
}



function deletetable(key,indexToRemove){

  state.data.config[key] =  state.data.config[key].filter((_, index) => index !== indexToRemove);

}
function addtable(key){

  state.data.config[key]=[...state.data.config[key],{"key":"","value":""}]


}




async function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {

      if (!stata.status) {
        const data1={...state.data,...{ product:{"__type": "Relation", "className": "Product"},"status":"OFFLINE" }}

        const {data, error} = await postChannel(data1)
        if (data.status == 200) {
          updateVisible(false);
          emits('update');
        }

      } else {
        const {objectId,config,name}=state.data
        const {data, error} = await putChannel(objectId, {config,name})
        if (data.status == 200) {
          updateVisible(false);
          emits('update');
        }
      }
    } else {
      console.log(errors)
      message.error('验证失败')
    }
  })
}






</script>

<template>
  <!-- 使用 internalVisible 替代原来的 v-model:show -->
  <NModal :show="props.visible" @update:show="updateVisible"  style="width: 1400px" preset="dialog" title="通道配置">
    <n-form
        ref="formRef"
        inline
        :label-width="80"
        :model="state.data"
        :rules="state.rules"
        size="large"
    >   <n-flex justify="space-around" size="large">
      <n-grid  :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="数据类型" path="cType">
          <n-select v-model:value="state.data.cType" :options="stata.select" @update:value="cType()" :disabled="stata.status" placeholder="选择类型" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="名称" path="name">
          <n-input v-model:value="state.data.name" placeholder="输入类型" />
        </n-form-item-gi>
      </n-grid>
      <n-grid  :cols="24" :x-gap="24" v-if="stata.data.params">
        <n-form-item-gi v-for="(value, key) in stata.data.params" :span="12" :label="value.title.zh"  :path="value.key">
          <n-select v-if="value.type=='enum'" v-model:value="state.data.config[key]" :options="value.enum"  placeholder="选择" />
          <n-select v-if="value.type=='boolean'" v-model:value="state.data.config[key]" :options="stata.selectboolean"  placeholder="选择" />
          <n-input v-if="value.type=='string' && value.title.zh!=='通道ICO'" v-model:value="state.data.config[key]"   placeholder="输入" />
          <n-input-number v-if="value.type=='integer'" v-model:value="state.data.config[key]"   placeholder="输入" precision="0" />
          <n-flex vertical v-if="value.type=='object'">
            <n-table :bordered="false" :single-line="false">
              <thead>
              <th>{{value.table.key.title.zh}}</th>
              <th>{{value.table.value.title.zh}}</th>
              </thead>
              <tbody>
              <tr v-for="(_ , index) in state.data.config[key]">
                <td>
                  <n-input  v-model:value="state.data.config[key][index].key"  ></n-input>
                </td>
                <td>
                  <n-input  v-model:value="state.data.config[key][index].value"  ></n-input>
                </td>
                <td>
                  <NButton type="error" @click="deletetable(key ,index)">
                    {{ "删除" }}
                  </NButton>
                </td>
              </tr>
              </tbody>
            </n-table>
            <NButton @click="addtable(key)"  style="margin: 0 auto"  circle>
              <SvgIcon icon="ic:add" class="mr-1 text-5 text-[#009E64]" />
            </NButton>
          </n-flex>
        </n-form-item-gi>
      </n-grid>







    </n-flex>
    </n-form>

    <NSpace :size="16" justify="end" style="margin-top:30px " >
      <NButton @click="handleClose">{{ $t('common.cancel') }}</NButton>
      <NButton type="primary" @click="handleValidateButtonClick">{{ $t('common.confirm') }}</NButton>
    </NSpace>
  </NModal>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
