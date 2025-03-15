<script setup lang="tsx">
import { ref } from 'vue'
import { NButton, NImage, NPopconfirm, NTag } from 'naive-ui';
import { getdevice, deletedevice} from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import Search from './modules/search.vue';
import { useTable, useTableOperate } from '@/hooks/common/table';
import OperateDrawer from './modules/operate-drawer.vue';
const appStore = useAppStore();
import { useRouterPush } from '@/hooks/common/router';
const { routerPushByKey } = useRouterPush();
import { useproduct } from '@/store/modules/product';
import dayjs from "dayjs";
const product = useproduct();
product.getProduct()
const status=ref({
  "OFFLINE": {
  "value":"离线",
  "status":"warning"
  },
  "ONLINE":{ "value":"在线",
    "status":"primary"
  },
})


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
  apiFn: getdevice,
  showTotal: true,

  apiParams: {
    count: 'objectId',
    order: '-updatedAt',
    limit: 10,
    skip: 0,
    where:{},
  },
  columns: () => [
    {
      key: 'objectId',
      title: 'id',
      align: 'center',
    },
    {
      key: 'name',
      title: '设备名称',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'devaddr',
      title: '设备编号',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'product',
      title: '设备类型',
      align: 'center',
      minWidth: 300,
      render:  row => {
        const typename=product.Productdata.data[row.product.objectId]
        return <NTag>{typename}</NTag>;
      }
    },

    {
      key: 'ACL',
      title: '所属角色',
      align: 'center',
      minWidth: 300,
      render:  row => (<div >{ Object.keys(row.ACL).map((d) => (<div>{d.replaceAll("role:","")}</div>))}</div>)
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      minWidth: 100,
      render:  row => {
        return <NTag type={status.value[row.status].status}>{status.value[row.status].value}</NTag>;
      }
    },
    {
      key: 'updatedAt',
      title: '最后更新时间',
      align: 'center',
      minWidth: 200,
      render: (row) => {
        return dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 330,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => goToHistoryData(row.objectId)}>
            详细
          </NButton>
          <NButton type="primary" ghost size="small" onClick={() => goToConsole(row)}>
            topo
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
  const {data,error} = await deletedevice(id)
  if (data.status==200){
    onDeleted();
  }
}

function edit(id: number) {

  handleEdit(id);
}

const isCardView = ref(false)
const toggleDisplayMode = () => {
  isCardView.value = !isCardView.value;
}
const goToConsole = ( info: object) => {

  routerPushByKey('tools_topo', {
    query: {
      deviceId: info.objectId,
      productId: info.product.objectId
    }
  });
};

const goToHistoryData = (id: any) => {

  routerPushByKey('devicemanagement_devicehistorydata', { params: { equipId: id } });
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
      <div class="cardsBox">
        <NCard
          v-for="item in data"
          :key="item.objectId"
          class="cropCard"
        >
          <div class="spacing">
            <NText class="label">{{$t('page.farmManage.crop.orgName')}}</NText>
            <NText class="value">{{ item.orgName }}</NText>
          </div>
          <div class="spacing">
            <NText class="label">{{$t('page.farmManage.crop.cropName')}}</NText>
            <NText class="value">{{ item.cropName }}</NText>
          </div>
          <div class="spacing">
            <NText class="label">{{$t('page.farmManage.crop.cropCode')}}</NText>
            <NText class="value">{{ item.cropCode }}</NText>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <NImage
              width="100"
              src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
               class="label"
            />
            <!-- <NButton
              class="value"
              strong secondary round type="info" size="small"
              @click="() => checkImg(item)"
            >查看</NButton> -->
          </div>
          <div class="spacing">
            <NText class="label">{{$t('page.farmManage.crop.type')}}</NText>
            <NText class="value">{{ item.type }}</NText>
          </div>
          <div class="spacing">
            <NText class="label">{{ item.opPerson }}</NText>
            <NText class="value">{{ item.time }}</NText>
          </div>
          <div class="gap-8px c-button">
            <NButton type="primary" ghost size="small" @click="() => edit(item.objectId)">
              {{$t('common.edit')}}
            </NButton>
            <NPopconfirm
              @onPositiveClick="handleDelete(item.objectId)"
            >
              <template #trigger>
                <NButton type="error" ghost size="small">
                  {{$t('common.delete')}}
                </NButton>
              </template>
              {{$t('common.confirmDelete')}}
            </NPopconfirm>
          </div>
        </NCard>
      </div>
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
    <OperateDrawer
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
