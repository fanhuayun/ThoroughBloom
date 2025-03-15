<script setup lang="ts">
import {computed, reactive, ref, watch} from 'vue';
import { $t } from '@/locales';
import { cropFormRules, cropNaiveForm } from '@/hooks/common/form';
import { translateOptions } from '@/utils/common';


defineOptions({
  name: 'Search'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = cropNaiveForm();

// const model = defineModel('model');
const model = reactive({
  where: {},

});
type RuleKey = Extract<keyof Api.SystemManage.CropSearchParams, 'cropCode' >;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = cropFormRules(); // inside computed to make locale reactive

  return {
    cropCode: patternRules.cropCode
  };
});
const params = reactive({
  name: '',

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
async function reset() {
  await restoreValidation();
  emit('reset');
}
async function search() {
  await validate();
  emit('search',model);
}


</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="crop-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="100">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="设备类型名称" path="name" class="pr-24px">
              <NInput v-model:value="params.name" @change="update_name"  placeholder="请输入设备类型名称" />
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
