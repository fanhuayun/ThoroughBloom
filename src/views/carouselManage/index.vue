<script setup lang="tsx">
import { ref } from 'vue'
import { NButton, NPopconfirm, NImage,NPerformantEllipsis,Ntag } from 'naive-ui';
import {deleteMaintenance, getQuestion, Batch, deletequestion, deleteDict, getDict} from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import {localStg} from "@/utils/storage";
import NoticeSearch from './modules/search.vue';
import NoticeOperateDrawer from './modules/drawer.vue';

import dayjs from "dayjs";
import {enableStatusRecord} from "@/constants/business";
import { useRouterPush } from '@/hooks/common/router';
const { routerPushByKey } = useRouterPush();
import { lyla } from '@lylajs/web'

import type { UploadCustomRequestOptions,UploadFileInfo } from 'naive-ui'



const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  pagination,
  mobilePagination,
  searchParams,
  fromParams,
  resetSearchParams
} = useTable({
  immediate: undefined,
  apiFn: getDict,
  showTotal: true,

  apiParams: {
    count: 'objectId',
    order: '-createdAt',
    limit: 10,
    skip: 0,
    where:{
        class:"carousel",
        type:"carousel"
    }
  },
  columns: () => [

    {
      key: 'objectId',
      title: 'id',
      align: 'center',
      width: 64
    },
    {
      key: 'title',
      title: '图片',
      align: 'center',
      minWidth: 100,
        render: row => (
            <NImage src={row.title} width= "50" />
        )
    },




    {
      key: 'startdate',
      title: '创建时间',
      align: 'center',
      minWidth: 130,
      render: (row) => {
        return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
      },
    },

    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
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



async function handleDelete(id: string) {
  // request
  const {data, error} = await deleteDict(id);
// console.log("data", data)
  if (data.status == 200) {

    getData()
  }
}

function edit(id: number) {
  handleEdit(id);
}





async function batch_(B:any){
  const body={ "requests": B}
  const{data,error}=await Batch(body)
  if (!error){
    getData()
  }
}

</script>

<template>
<div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
  <NoticeSearch v-model:model="searchParams" @reset="resetSearchParams" @search="fromParams" />
  <NCard :title="'题库'" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
    <NoticeOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
  </NCard>
</div>
</template>

<style scoped></style>
