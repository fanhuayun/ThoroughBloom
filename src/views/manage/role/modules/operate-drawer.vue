<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { cropFormRules, cropNaiveForm } from '@/hooks/common/form';
import {_RoleList, getDict, postChannel, postrole, putChannel} from '@/service/api';
import { $t } from '@/locales';

import type { UploadCustomRequestOptions ,NCascader } from 'naive-ui'
import { localStg } from '@/utils/storage';
import { lyla } from '@lylajs/web'
import { useproduct } from '@/store/modules/product';
const product = useproduct();

const productOptions = ref<CommonType.Option[]>([]);
productOptions.value=product.Productdata.selectList

const status = ref(false)

defineOptions({
  name: 'OperateDrawer'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.Crop | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = cropNaiveForm();
const { defaultRequiredRule } = cropFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增部门',

  };
  return titles[props.operateType];
});





const model  = reactive(createDefaultModel());

function createDefaultModel()  {
  return {

    parent:"",
    name: '',
    depname: '',
    desc: '',
    tempname: '',
  };
}

const state = reactive({
  data:{
    parent:"",
    name: '',
    depname: '',
    desc: '',
    tempname: '',
  },
  options:{
    parent:[],
    template:[]
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




function closeDrawer() {
  visible.value = false;
}

async function  Submit(){
  if (status.value) {
    const info={
      name: model.name
    }
    const {data,error} = await putdevice(model.objectId,info)
    if (data.status==200){
      window.$message?.success('修改成功');
      closeDrawer();
      emit('submitted')
    }
  } else {
    const info={
      parent: state.data.parent,
      name: state.data.name,
      depname: state.data.name,
      desc: state.data.name,
      tempname:state.data.tempname
    }


    const {data,error} = await postrole(info)
    if (data.objectId){
      window.$message?.success('新增成功');
      closeDrawer();
      emit('submitted')
    }
  }
}


async function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {

      const info={
        parent: state.data.parent,
        name: state.data.name,
        depname: state.data.name,
        desc: state.data.name,
        tempname:state.data.tempname
      }


      const {data,error} = await postrole(info)
      if (data.objectId){
        window.$message?.success('新增成功');
        closeDrawer();
        emit('submitted')
      }
    } else {
      console.log(errors)
      // message.error('验证失败')
    }
  })
}




function analyze( results:any  ){
  // const results=[]
  let  list=[]

  results.forEach((item)=>{
     const filter=results.filter(item1=> item.parent.objectId === item1.objectId)
     if (filter.length===0){
       list=[{label:item.name,value:item.objectId , children: iteration(item, results ) }]

     }

  })
  state.options.parent=list
  // return
}

function iteration(item:object, results :any ){
  const list =[]
  const filter=results.filter(item1=> item1.parent.objectId === item.objectId)
  filter.forEach((item2)=> {
      list.push({label:item2.name,value:item2.objectId , children: iteration(item2, results ) })
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
      // data.results.forEach((item)=>{
      //   // if ()
      //
      //   list.push({label:item.name,value:item.objectId})
      // })
    }
    // state.options.parent =list
}
async function get_getDict() {
    const params={
      where: {"data.level":{"$gt":0},"type":"roletemp"}
    }
    const list=[]

    const {data,error} =await getDict(params)
    if (data.status==200){
      data.results.forEach((item)=>{
        list.push({label:item.key,value:item.key})
      })
    }
  state.options.template =list
}





watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    get_RoleList()
    get_getDict()


  }
});
function handleInitModel() {
  Object.assign(model, createDefaultModel());
  if (props.operateType === 'edit' && props.rowData) {
    status.value= true
    Object.assign(model, props.rowData);
  }
}
</script>
<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef"
             :model="state.data"
             :rules="state.rules" >
        <NFormItem label="父级角色" path="parent">
          <NCascader v-if="state.options.parent.length>0" v-model:value="state.data.parent"  :options="state.options.parent" />
        </NFormItem>
        <NFormItem label="名称" path="name" >
          <NInput v-model:value="state.data.name" :disabled="status" />
        </NFormItem>
        <NFormItem label="模板" path="tempname" >
          <NSelect v-if="state.options.template.length>0"  v-model:value="state.data.tempname" :options="state.options.template" :disabled="status"  />
        </NFormItem>

      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleValidateButtonClick">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
<style scoped></style>
