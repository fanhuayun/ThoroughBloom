<!-- eslint-disable vue/define-props-declaration -->
<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useNaiveForm } from '@/hooks/common/form';
import { useTabStore } from '@/store/modules/tab';

const tabStore = useTabStore();
const props = defineProps({
  listType: {
    type: Number,
    default: 1
  },
  columns:Array,
  info: {
    type: String,
    default: () => '---'
  }
});

defineOptions({
  name: 'DeviceSearch'
});

const router = useRouter();
const back = () => {
  tabStore.removeActiveTab();
  router.back();
};

const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  default: () => []
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
  (e: 'refresh'): void;
  (e: 'update:changeListType'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel('model');

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}

function refresh() {
  emit('refresh');
}

function selectGraph() {
  emit('update:changeListType', 2);
}
function selectTable() {
  emit('update:changeListType', 1);
}
const updateTimeRange = (dayNum: number) => {

  model.value.timeRange = [dayjs().subtract(dayNum, 'day').valueOf(), dayjs().valueOf()];
};
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
      <div class="mb-5 flex items-center">
        <NButton class="mr-5" type="primary" @click="back">返回</NButton>

      </div>
      <NGrid responsive="screen" item-responsive class="h-10">
        <NFormItemGi span="20 m:10" class="pr-24px" :min="1">
          <NSpace class="w-full" justify="start">

            <NButton @click="reset">导出</NButton>
            <NButton type="primary" ghost @click="refresh">更新数据</NButton>
          </NSpace>
        </NFormItemGi>
        <NFormItemGi span="24 m:14" path="timeRange" class="pr-30px" >
          <NSpace class="w-full w-800px" justify="end">
            <NButton class="mr-8px" @click="updateTimeRange(1)">近一天</NButton>
            <NButton class="mr-8px" @click="updateTimeRange(7)">近七天</NButton>
            <NButton class="mr-8px" @click="updateTimeRange(30)">近一月</NButton>
            <NDatePicker
              v-model:value="model.timeRange"
              update-value-on-close
              type="daterange"
              :actions="null"
              class="mr-8px w-100"
            />
            <TableColumnSetting v-model:columns="columns" />
            <NButton type="primary"  size="small" @click="search">
              <template #icon>
                <icon-ic-round-search class="text-icon" />
              </template>
              查询
            </NButton>
          </NSpace>
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
