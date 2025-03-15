<script setup lang="ts">
import {defineProps, defineEmits, watch, ref, reactive,onMounted} from 'vue';
import {$t} from "@/locales";
import {FormInst, FormItemRule, NCascader,} from 'naive-ui';
import { useAppStore } from '@/store/modules/app';




defineOptions({
  name: 'Transfer'
});

import { useMessage } from 'naive-ui'
import {_RoleList, postrole, Putroleuser} from "@/service/api";

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
  userid:"",
  delfilter:{where:{
      depname:{'$in':[]}
    }},
  addfilter:{where:{
      depname:{'$in':[]}
    }}
},
  options:{
    parent:[],

  },
  rules:{
    name:{
      required: true,
      message: '请输入名称',
      trigger: ['input']
    },
    parent: {
      required: true,
      message: '请选择',
      trigger: ['blur', 'change']
    },
    tempname:{
      required: true,
      message: '请选择',
      trigger: ['blur', 'change']
    }
  },

});
function analyze( results:any  ){
  // const results=[]
  let  list=[]

  results.forEach((item)=>{
    const filter=results.filter(item1=> item.parent.objectId === item1.objectId)
    if (filter.length===0){
      list=[{label:item.name,value:item.name , children: iteration(item, results ) }]

    }

  })
  state.options.parent=list
  // return
}

function iteration(item:object, results :any ){
  const list =[]
  const filter=results.filter(item1=> item1.parent.objectId === item.objectId)
  filter.forEach((item2)=> {
        list.push({label:item2.name,value:item2.name , children: iteration(item2, results ) })
      }
  )
  return list

}


async function get_RoleList() {
  const params={ }
  const list=[]

  const {data,error} =await _RoleList(params)
  if (data.status==200){
    analyze(data.results)
  }
}


watch(props, () => {
  if (props.visible) {
    state.data.userid=props.objectId
    state.data.delfilter.where.depname.$in=props.depname
    state.data.addfilter.where.depname.$in=props.depname

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
      if (state.data.addfilter.where.depname.$in.length >= 0){
        // console.log(state.data)
        const {data,error} = await Putroleuser(state.data)
        if (!error){
          handleClose();
          emits('submitted')
        }
      }else{
        handleClose();
        emits('submitted')
      }



}


</script>

<template>
  <!-- 使用 internalVisible 替代原来的 v-model:show -->
  <NModal :show="props.visible" @update:show="updateVisible"  preset="dialog" >
    <NForm ref="formRef"
           :model="state.data"
           :rules="state.rules" >
      <NFormItem label="转至角色" path="">
        <NCascader v-if="state.options.parent.length>0" :cascade="false" multiple v-model:value="state.data.addfilter.where.depname.$in"  :options="state.options.parent" />
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
