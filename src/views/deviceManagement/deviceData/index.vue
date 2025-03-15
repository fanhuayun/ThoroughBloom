<!-- eslint-disable no-console -->
<script setup lang="tsx">
import { defineProps, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { getdevicedata } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { WEATHER_PRODUCT } from '@/constants/device';
// import { useTable, useTableOperate } from '@/hooks/custom/table';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { localStg } from '@/utils/storage';

import SearchBar from './modules/searchBar.vue';
import LineCard from './modules/line-card.vue';

const appStore = useAppStore();
const route = useRoute();
const state = reactive({
  modalInfo: {},
  showModal: false,
  baseInfo: {
    deviceId: '' as string | string[]
  },
  columns: []
});

const props = defineProps({
  deviceId: String // 假设这是你要传递的地图的 id
});

watch(props.deviceId, newParams => {
  state.baseInfo.deviceId = props.deviceId;
});

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  reloadColumns,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: getdevicedata,
  apiParams: {
    order: '-createdAt',

    skip: 0,
    deviceId: route.params.equipId,
    onDone: res => {
      console.log('------>', res);
      state.columns = [
        {
          key: 'createdat',
          title: '时间',
          width: 180,
          align: 'center',
          render: row => dayjs(row.createdat).format('YYYY-MM-DD HH:mm:ss'),
          fixed: 'left'
        },
        ...res.map(d => ({
          ...d,
          minWidth: 130,
          align: 'center',
          render: row => (row[d.key] === null ? '-' : row[d.key])
        }))
      ];
      reloadColumns();
    }
  },

  showTotal: true,
  columns: () => [...state.columns]
});

// watch(data, newParams => {
//   console.log('当前data:', newParams);
// });

// watch(searchParams, newParams => {
//   console.log('当前搜索参数:', newParams);
// });
const listType = ref(1);
const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  // console.log("checkedRowKeys.value",checkedRowKeys.value);

  onBatchDeleted();
}

function handleDelete(id: number, roles: Array) {
  // request
  console.log('id', id);
  console.log('roles', roles.value());

  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}

function changeListType(newValue) {
  listType.value = newValue;
}
console.log('xxxx', columnChecks);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBar
      v-model:model="searchParams"
      v-model:list-type="listType"
      v-model:columns="columnChecks"
      :info="state.baseInfo"
      @refresh="getData"
      @reset="resetSearchParams"
      @search="getDataByPage"
      @update:change-list-type="changeListType"
    />

    <NCard v-if="listType === 1" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :min-row-height="48"
        :loading="loading"
        :row-key="row => row.id"
        :pagination="mobilePagination"
        style="height: 500px"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
