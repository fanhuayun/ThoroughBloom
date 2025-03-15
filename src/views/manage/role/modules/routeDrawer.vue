<script setup lang="ts">
defineOptions({
  name: 'PersonnelDrawer'
});
import { computed, reactive, ref, watch } from 'vue';
import { landFormRules, cropNaiveForm } from '@/hooks/common/form';
import {
  put_route,
  GetrouteList, Get_route,

} from '@/service/api';
import { $t } from '@/locales';



import { localStg } from '@/utils/storage';
import {TreeOverrideNodeClickBehavior} from "naive-ui";

const options2= ref([])
const database = reactive({
  options: [],
  results: [],
  checkedKeys: [],

});

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});
const options1 = defineModel<boolean>('options1', {
  default: []
});
const routeid = defineModel<string>('routeid', {
  default: ""
});
const { formRef, validate, restoreValidation } = cropNaiveForm();

const { defaultRequiredRule } = landFormRules();



function closeDrawer() {
  visible.value = false;
}

const override: TreeOverrideNodeClickBehavior = ({ option }) => {
  if (option.children) {
    return 'toggleExpand'
  }
  return 'default'
}

let selectoption: T =[]
async function handleSubmit() {

  let results=[]

  const routes=database.checkedKeys
  const objectId=routeid.value
  // console.log('routes',routes)
  const {data, error}=await put_route({objectId,routes})
  if (data.status==200){
    closeDrawer();
    emit('submitted');

  }
}





async function getSelect() {
  const {data, error}=await GetrouteList()
  let list=[]

  if (data.status==200){
    data.results.forEach((item)=>{
      let children=[]
      if (item.children){
        item.children.forEach((item1)=>{
          children.push({"key": item1.objectId,"label":$t(item1.meta.i18nKey)})
        })
        list.push({"key":item.objectId,"label":$t(item.meta.i18nKey),"children":children })
      }else {
        list.push({"key":item.objectId,"label":$t(item.meta.i18nKey)})
      }
    })
    database.options=list
    database.results=data.results
  }
}
async function getSelectroute(objectId) {
  const {data, error}=await Get_route({objectId})

  let checkedKeys=[]

  if (data.status==200){
    data.routes.forEach((item)=>{
      if (item.children){
        checkedKeys.push(item.objectId)
        item.children.forEach((item1)=>{
          checkedKeys.push(item1.objectId)
        })
      }else {
        checkedKeys.push(item.objectId)
      }
    })
    database.checkedKeys=checkedKeys
  }
}


function updateCheckedKeys (v: string[])  {
  console.log(v)
  database.checkedKeys=v
}
watch(visible, () => {
  if (visible.value) {
    getSelectroute(routeid.value)
    getSelect()
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent title="路由分配" :native-scrollbar="false" closable>
      <NTree
          block-line
          :checkable="true"
          :cascade="false"
          :data="database.options"
          :checked-keys="database.checkedKeys"
          check-strictly="true"
          @update:checked-keys="updateCheckedKeys"
          :virtual-scroll="true"
      />

      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
