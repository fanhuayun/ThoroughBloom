<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import {   topoList, DeleteTopo } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';

import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { useTable, useTableOperate } from '@/hooks/common/table';
import Search from './modules/search.vue';
import Drawer from './modules/drawer.vue';
import {localStg} from "@/utils/storage";
import dayjs from "dayjs";
import {reactive, ref} from "vue";
import { useproduct } from '@/store/modules/product';
import { useRouterPush } from '@/hooks/common/router';
const { routerPushByKey } = useRouterPush();
const product = useproduct();
product.getProduct()




const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  fromParams,
  resetSearchParams
} = useTable({
  immediate: undefined,
  apiFn: topoList,
  showTotal: true,

  apiParams: {
    count: 'objectId',
    order: '-createdAt',
    limit: 10,
    skip: 0,
    where:{ }
  },
  columns: () => [
    {
      key: 'objectId',
      title: 'id',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'name',
      title: '名称',
      align: 'center',
      minWidth: 100
    },


   {
      key: 'product',
      title: '设备类型',
      align: 'center',
      minWidth: 200,
     render: (row) => {
        if(row.product){

          return product.Productdata.data[row.product.objectId];
        }
     },
   },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
          <div class="flex-center gap-8px">

            <NButton type="primary" ghost size="small" onClick={() => goToConsole(row)}>
              {$t('common.edit')}
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDelete(row.objectId)}>
                  {{
                      default: () => $t('common.confirmDelete'),
                      trigger: () => (
                          <NButton type="error" ghost size="small">
                              {$t('common.delete')}
                          </NButton>
                      )
                  }}
            </NPopconfirm>
          </div>
      )
    }
  ]
});
const shuaxin = () => {
  getData();
}
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

const goToConsole = ( info: object) => {

  routerPushByKey('tools_topo', {
    query: {
      viewId: info.objectId,
      productId: info.product.objectId
    }
  });
};


async function handleDelete(id: string) {
    // request
    const {data, error} = await DeleteTopo(id);

    if (data.status == 200) {

      onDeleted();
    }

}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <Search v-model:model="searchParams" @reset="resetSearchParams" @search="fromParams" />
    <NCard title="topo列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">

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
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />

    </NCard>
          <Drawer
              v-model:visible="drawerVisible"
              :operate-type="operateType"
              :row-data="editingData"
              @submitted="getDataByPage"
          />
  </div>
</template>

<style scoped></style>
