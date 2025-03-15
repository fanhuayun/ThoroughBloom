<script setup lang="ts">
defineOptions({
  name: 'PersonnelDrawer'
});
import { computed, reactive, ref, watch } from 'vue';
import { landFormRules, cropNaiveForm } from '@/hooks/common/form';
import {
  put_route,
  GetrouteList, Get_route, GetPermissionList, put_role,

} from '@/service/api';
import { $t } from '@/locales';



import { localStg } from '@/utils/storage';
import {NCascader, TreeOverrideNodeClickBehavior} from "naive-ui";

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

async function handleSubmit() {

  let results=[]

  const rules=database.checkedKeys
  const objectId=routeid.value

  const {data, error}=await put_role({objectId,rules})
  if (data.status==200){
    closeDrawer();
    emit('submitted');

  }
}


 function analyze( results:any ){
  // const results=[]
  let  list=[]

  results.forEach((item)=>{
    // const filter=results.filter(item1=> item.parent.objectId === '1')
    // if (filter.length===1){
      // list.push({label:item.alias,value:item.name , children: iteration(item, results ) })
    if (item.parent.objectId.trim() === '0'){
      list.push({label:item.alias,key:item.name , children: iteration(item, results ) })
    }
    // }
  })
  // state.options.parent=list
  // return
  database.options=list
  console.log(database.options)
}

function iteration(item:object, results :any ){
  const list =[]
  const filter=results.filter(item1=> item1.parent.objectId === item.objectId)
  filter.forEach((item2)=> {
        // list.push({label:item2.alias,value:item2.name , children: iteration(item2, results ) })
        list.push({label:item2.alias,key:item2.name})
      }
  )
  return list

}



async function getSelect() {
  const {data, error}=await GetPermissionList()
  let list=[]

  if (data.status==200){
    analyze(data.results)

    database.results=data.results
  }
}
async function getSelectroute(objectId) {
  const {data, error}=await Get_route({objectId})

  let checkedKeys=[]

  if (data.status==200){
    data.rules.forEach((item)=>{

        checkedKeys.push(item.name)
    })
    database.checkedKeys=checkedKeys
  }
}


function updateCheckedKeys (v)  {
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
    <NDrawerContent title="接口分配" :native-scrollbar="false" closable>
      <NTree
          block-line
          :checkable="true"
          :cascade="true"
          :data="database.options"
          :checked-keys="database.checkedKeys"
          check-strictly="true"
          @update:checked-keys="updateCheckedKeys"
          :virtual-scroll="true"
      />
<!--      <NCascader  multiple v-model:value="database.checkedKeys"  :options="database.options" />-->

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
