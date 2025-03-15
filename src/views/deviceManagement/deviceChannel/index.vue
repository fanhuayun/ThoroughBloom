<script setup lang="tsx">
import { NButton, NPopconfirm, NTag,NSwitch } from 'naive-ui';
import {topoList, DeleteTopo, queryChannel, postChannelcontrol, deleteChannel} from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';

import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { useTable, useTableOperate } from '@/hooks/common/table';
import Search from './modules/search.vue';
import Modal from './modules/modal.vue';
import Log from './modules/log.vue';
import {localStg} from "@/utils/storage";
import dayjs from "dayjs";
import {reactive, ref} from "vue";
import { useproduct } from '@/store/modules/product';
import Thing from "@/views/deviceManagement/deviceTypeHistoryData/modules/thing.vue";


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
  apiFn: queryChannel,
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
      title: '项目名称',
      align: 'center',
      minWidth: 100
    },


   {
      key: 'cType',
      title: '通道类型',
      align: 'center',
      minWidth: 200,
   },

   {
      key: 'config.port',
      title: '端口',
      align: 'center',
      minWidth: 200,
   },
      {
          key: 'isEnable',
          title: '状态',
          align: 'center',
          width: 130,
          render: (row) => (
              <div>
                  <NSwitch
                      value={row.isEnable} // 使用modelValue而不是v-model:value
                      onChange={(value) => {
                          switchEnable(row.objectId, value); // 调用switchEnable方法
                      }}
                  />
              </div>
          )
      },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      render: row => (
          <div class="flex-center gap-8px">


            <NButton type="primary" ghost size="small" onClick={() => openLog(row)}>
              日志
            </NButton>
            <NButton type="primary" ghost size="small" onClick={() => editModal(row)}>
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




const state = reactive({
  showModal:false,
  model:false,
  data:{}
})
const log = reactive({
  showModal:false,
  name:"",
  objectId:"",

})


function openLog(item:object){
  Logstatus(item.objectId,"start_logger")
  log.name= item.name;
  log.objectId= item.objectId;
  log.showModal = true
}
function logModalClose(){
  Logstatus(log.objectId,"stop_logger")
  log.showModal=false,
  log.name="",
  log.objectId=""
}


function ModalClose(){
  state.data= {};
  state.model= false;
  state.showModal = false
}
function handleAddmodel(){
  state.data= {};
  state.model= false;
  state.showModal = true
}

function editModal(item:object){
  state.data= item;
  state.model= true;
  state.showModal = true
}




async function update() {
    getData()
}
async function handleBatchDelete() {
  // request
  // console.log("checkedRowKeys.value",checkedRowKeys.value);

  onBatchDeleted();
}
async function switchEnable(id:string,isEnable:boolean) {
    let status='disable';
    if (isEnable){
        status='enable'
    };

    const {data,error} =await postChannelcontrol(id,status)
    if (!error){
        getData()
    }

}


async function Logstatus(id: string, status: string){


 await postChannelcontrol(id, status)

}













async function handleDelete(id: string) {
    // request
    const {data, error} = await deleteChannel(id);

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
    <NCard title="通道列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">

        <template #header-extra>
            <TableHeaderOperation
                    v-model:columns="columnChecks"
                    :disabled-delete="checkedRowKeys.length === 0"
                    :loading="loading"
                    @add="handleAddmodel"
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
<!--          <Drawer-->
<!--              v-model:visible="drawerVisible"-->
<!--              :operate-type="operateType"-->
<!--              :row-data="editingData"-->
<!--              @submitted="getDataByPage"-->
<!--          />-->
    <Modal :visible="state.showModal"  :model="state.model" :data="state.data" @update:visible="ModalClose" @update="update"  > </Modal>
    <Log :visible="log.showModal"  :objectId="log.objectId" :name="log.name" @update:visible="logModalClose"   > </Log>


  </div>
</template>

<style scoped></style>
