<script setup lang="tsx">
import { ref } from 'vue'
import { NButton, NImage, NPopconfirm, useMessage } from 'naive-ui';
import {getdevice, productList, Deleteproduct, getpolling} from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import Search from './modules/search.vue';
import { useTable, useTableOperate } from '@/hooks/common/table';
import CropOperateDrawer from './modules/operate-drawer.vue';

const appStore = useAppStore();
import { useRouterPush } from '@/hooks/common/router';
const { routerPushByKey } = useRouterPush();


const message = useMessage()
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
  apiFn: productList,
  showTotal: true,

  apiParams: {
    count: 'objectId',
    order: '-updatedAt',
    limit: 10,
    skip: 0,
    where:{},
    keys: 'name,objectId,devType,channel,login'
  },
  columns: () => [
    {
      key: 'objectId',
      title: 'id',
      align: 'center',

    },
    {
      key: 'name',
      title: '类型名称',
      align: 'center',
      minWidth: 100
    },

    {
      key: 'devType',
      title: '设备厂家',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'device_counts',
      title: '设备总数',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'offline_counts',
      title: '离线数量',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'online_counts',
      title: '在线数量',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 330,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => goToHistoryData(row.objectId)}>
            配置
          </NButton>
          <NButton type="primary" ghost size="small" onClick={() => edit(row.objectId)}>
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

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted

} = useTableOperate(data, getData);

async function handleBatchDelete() {
  onBatchDeleted();
}

async function handleDelete(id: string) {

  const data1=await getdevicecount(id)
  // console.log('data1',data1)
  if (data1.count>0){
    message.error('请删除这个类型下的设备')
  }else{
    const {data,error} = await Deleteproduct(id)
    if (data.status==200){
      onDeleted();
    }
  }

}


async function getdevicecount(id:string){
  const params={ count: 'objectId',
    skip: 0,
    limit: 1,
    where: {"product":id}
  }
  const {data,error}=await getdevice(params)
  return data
}


function edit(id: number) {

  handleEdit(id);
}

const isCardView = ref(false)
const toggleDisplayMode = () => {
  isCardView.value = !isCardView.value;
}


const goToHistoryData = (id: any) => {

  routerPushByKey('devicemanagement_devicetypehistorydata', { params: { equipId: id } });
};


</script>

<template>
<div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
  <Search v-model:model="searchParams" @reset="resetSearchParams" @search="fromParams" />
  <NCard title="设备类型" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
      v-if="!isCardView"
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
    <div v-else class="card-container">

            <!-- 分页组件 -->
      <NPagination
        v-if="isCardView"
        :page-size="pagination.pageSize"
        :current-page="pagination.page"
        @update:current-page="(page) => { pagination.page = page; getDataByPage();  }"
        :total="pagination.pageSize"
        show-size-picker
        :page-sizes="pagination.pageSizes"
        class="c-pagination"
        >
        <template #prefix="{ itemCount }">
          共 {{ itemCount }} 条
        </template>
      </NPagination>
    </div>
    <CropOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
  </NCard>
</div>
</template>

<style scoped>
.cardsBox {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  height: calc(100vh - 350px);
  overflow: auto;
  padding: 20px;
}
.c-button {
  position: absolute;
  bottom: 12px;
  right: 10px;
}
.card-container {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.c-pagination {
  position: absolute;
  bottom: 14px;
  right: 16px;
}
.cropCard {
  flex: 1 1 calc(25% - 20px); /* 基础宽度为 20% 减去间距 */
  max-width: calc(25% - 20px); /* 最大宽度为 20% 减去间距 */
  min-width: calc(20%); /* 最小宽度 */
  height: 295px;
  border: 1px solid #5e5e5e;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0.1, 0.1, 0.1, 0.1);
}

@media (max-width: 1200px) {
  .cropCard {
    flex: 1 1 calc(33.33% - 20px); /* 中等屏幕时，每行最多 3 张 */
    max-width: calc(33.33% - 20px);
  }
}

@media (max-width: 900px) {
  .cropCard {
    flex: 1 1 calc(50% - 20px); /* 小屏幕时，每行最多 2 张 */
    max-width: calc(50% - 20px);
  }
}
.spacing {
  margin-bottom: 10px;
}
.cropCard .operate {
  margin-left: 220px;
}
.spacing{
  display: flex;
}
.spacing .label{
  flex: 1;
}
.spacing .value{
  flex: 2;
}
</style>
