<script setup lang="ts">
import { $t } from '@/locales';
import { cropNaiveForm } from '@/hooks/common/form';
import { ref ,reactive} from 'vue';

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = cropNaiveForm();

const model = reactive({
  name: '',
  type: '',
  question:''
});;

const stata=reactive({
  type:[
    {label: '多选题', value: 2},
    {label: '单选题', value: 1},
    {label: '判断题', value: 3},
    {label: '案例题', value: 4}
  ]
})


async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();


  let model1={}
  model1.where={}
  if(model.name!==''){
    model1.where['name']=model.name
  }
  if(model.question!==''){
    model1.where['question']={"$regex":model.question}
  }
  if(model.type!==''){
    model1.where['number']=model.type
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
            <NFormItemGi span="24 s:12 m:6"  path="title" label='试卷' class="pr-24px">
              <NInput v-model:value="model.name"  />
            </NFormItemGi>
<!--            <NFormItemGi span="24 s:12 m:6"  path="title" label='题目' class="pr-24px">-->
<!--              <NInput v-model:value="model.question"  />-->

<!--            </NFormItemGi>-->
            <NFormItemGi span="24 s:12 m:6"  path="title" label='类型' class="pr-24px">

              <NSelect v-model:value="model.type" :options="stata.type"    />
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
