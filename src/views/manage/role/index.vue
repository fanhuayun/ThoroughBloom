<script setup lang="tsx">
import { NButton, NPopconfirm, NTag,useMessage } from 'naive-ui';
import {_RoleList, getDict, fetchGetRoleList, _Roledelete, deleteChannel, getdevice} from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { enableStatusRecord } from '@/constants/business';

import RoleSearch from './modules/role-search.vue';
import RouteDrawer from './modules/routeDrawer.vue';
import Rules_Drawer from './modules/rulesDrawer.vue';
import {reactive} from "vue";
import OperateDrawer from "./modules/operate-drawer.vue";

const appStore = useAppStore();

const message = useMessage()
const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
  mobilePagination,
  searchParams,
  fromParams,
  resetSearchParams
} = useTable({
  apiFn: _RoleList,
  apiParams: {
    count: 'objectId',
    order: '-createdAt',
    limit: 10,
    skip: 0,

  },
  columns: () => [

    {
      key: 'objectId',
      title: 'id',
      width: 64,
      align: 'center'
    },
    {
      key: 'name',
      title: $t('page.manage.role.roleName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'parent.objectId',
      title: '父级Id',
      align: 'center',
      minWidth: 120,

    },

    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => openroute(row.objectId)}>
            路由管理
          </NButton>
          <NButton type="primary" ghost size="small" onClick={() => openrulesDrawer(row.objectId)}>
            接口分配
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
const stateroute = reactive({
  id: '',
  showModal: false
});
function openroute(id: string) {
  stateroute.id = id;
  stateroute.showModal = true; // 显示弹窗
}
function handlerouteClose() {
  stateroute.showModal = false;
  stateroute.id = '';
  // 弹窗关闭后需要执行的逻辑
}
const rulesDrawer = reactive({
  id: '',
  showModal: false
});
function openrulesDrawer(id: string) {
  rulesDrawer.id = id;
  rulesDrawer.showModal = true; // 显示弹窗
}
function handlerulesDrawerClose() {
  rulesDrawer.showModal = false;
  rulesDrawer.id = '';
  // 弹窗关闭后需要执行的逻辑
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
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

async function handleDelete(id: string  ) {
  // request
  const data1=await get_Rolecount(id)
  // console.log('data1',data1)
  if (data1.count>0){
    message.error('请删除这个角色下的子角色')
  }else{
  const {data, error} = await _Roledelete(id);
  if (data.status == 200) {
    onDeleted();
  }}

}

async function get_Rolecount(id:string){
  const params={ count: 'objectId',
    skip: 0,
    limit: 1,
    where: {"parent":id}
  }
  const {data,error}=await _RoleList(params)
  return data
}



</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="fromParams" />
    <NCard :title="$t('page.manage.role.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
        :scroll-x="702"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />

    </NCard>
    <OperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
    />
    <RouteDrawer
        v-model:visible="stateroute.showModal"
        v-model:routeid="stateroute.id"
        @submitted="getDataByPage"
    />
    <Rules_Drawer
        v-model:visible="rulesDrawer.showModal"
        v-model:routeid="rulesDrawer.id"
        @submitted="getDataByPage"
    />

  </div>
</template>

<style scoped></style>
