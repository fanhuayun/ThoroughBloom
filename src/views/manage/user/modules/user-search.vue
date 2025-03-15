<script setup lang="ts">
import { $t } from '@/locales';
import { cropNaiveForm } from '@/hooks/common/form';
import { ref ,reactive} from 'vue';
import { useproduct } from '@/store/modules/product';
import {_RoleList} from "@/service/api";
import {localStg} from "@/utils/storage";
const produc = useproduct();
produc.get_Role()

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = cropNaiveForm();

const model = reactive({
  objectId: '',
        type: '',
        nick: '',
  // maturitydate:[null,null]
});;

const stata=reactive({
  type:[

  ]
})

const RoledataselectList=ref<CommonType.Option[]>([])

RoledataselectList.value=produc.Roledata.selectList
async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();

  const model1={}
  model1.include=false
  model1.where={}
  model1.userfilter={}

  if(model.objectId!=='' && model.objectId){
    model1.where['objectId']=model.objectId
  }else {
    model1.where['objectId']=localStg.get('deptId')
    model1.include=true
  }

  if (model1.userfilter|| !isValidJSON(model1.userfilter)){
    model1.userfilter={}
    model1.userfilter.where={}
    if ( model.maturitydate && model.maturitydate.length ==2){

      model1.userfilter.where['maturitydate'] = {'$gte':model.maturitydate[0],'$lte':model.maturitydate[1] }
    }
    if (model.nick!==''){
      model1.userfilter.where['nick'] = model.nick
    }
    model1.userfilter.where=model1.userfilter.where
    model1.userfilter.where=JSON.stringify(model1.userfilter.where )
    model1.userfilter=JSON.stringify(model1.userfilter )
  }

  // if ( model.nick && model.nick!==''){
  //   model1.userfilter=model1.userfilter||{}
  //   model1.userfilter.where=model1.userfilter.where||{}
  //
  // }

  console.log('model1',model1)


  await validate();
  emit('search',model1);

}

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// async function get_Role(){
//   const List=[]
//   const  {data,error}=await _RoleList({})
//   if(data.status=200){
//     data.results.forEach((item)=>{
//       List.push(    {label: item.depname, value: item.objectId},)
//     })
//     console.log(  List)
//   }
//   RoledataselectList.value  =List
//   console.log(  Roledata)
// }
//
//
// get_Role()

</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="crop-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="100">
          <NGrid responsive="screen" item-responsive>

            <NFormItemGi span="24 s:12 m:6"  path="title" label='角色' class="pr-24px">

              <NSelect  v-model:value="model.objectId" :clearable=true :options="RoledataselectList"    />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6"  path="title" label='名称' class="pr-24px">

              <NInput  v-model:value="model.nick"     />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6"  path="title" label='到期时间' class="pr-24px">

              <NDatePicker type="datetimerange"  :clearable=true v-model:value="model.maturitydate"     />
            </NFormItemGi>


            <NFormItemGi span="16 s:8 m:4">
              <NSpace style="padding: 0 20px;">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
