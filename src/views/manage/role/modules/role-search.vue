<script setup lang="ts">
import {computed, reactive, ref, watch} from 'vue';
import { $t } from '@/locales';
import { cropFormRules, cropNaiveForm } from '@/hooks/common/form';
import { translateOptions } from '@/utils/common';
import { useproduct } from '@/store/modules/product';
const product = useproduct();

const productOptions = ref<CommonType.Option[]>([]);
productOptions.value=product.Productdata.selectList

defineOptions({
  name: 'Search'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = cropNaiveForm();


const model = reactive({
  where: {},
});


const params = reactive({
  name: '',
  product:''
});

function update_name() {
  if(params.name||""!==""){
    model.where.name={"$regex":params.name}
  }else{
    try {
      delete model.where.name
    }catch (ere){
    }
  }

}
function update_product() {
  if(params.product||""!==""){
    model.where.product=params.product
  }else{
    try {
      delete model.where.product
    }catch (ere){
    }
  }


}

async function reset() {
  // await restoreValidation();
  params.name= '';
  params.product='';
  // emit('reset');
}
async function search() {
  let model1={}
  model1.where={}
  if(params.product!=''){
    model1.where['product']=params.product
    console.log(model1)
  }
  if(params.name!==''){
    model1.where['name']={"$regex":params.name}
    console.log(model1)
  }
  await validate();
  emit('search',model1);
}


</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="crop-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="100">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="名称" path="name" class="pr-24px">
              <NInput v-model:value="params.name"   placeholder="请输入名称" />
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
